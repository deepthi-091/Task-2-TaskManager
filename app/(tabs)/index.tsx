import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/TaskItem';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { FilterType, Task } from '@/types/task';

type ModalMode = 'view' | 'edit';

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'All',
  pending: 'Pending',
  completed: 'Done',
};

export default function TaskManagerScreen() {
  const { tasks, loading, addTask, toggleTask, editTask, deleteTask } = useTasks();
  const [inputText, setInputText] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('view');
  const [modalVisible, setModalVisible] = useState(false);

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    addTask(trimmed);
    setInputText('');
  };

  const openView = (task: Task) => {
    setSelectedTask(task);
    setModalMode('view');
    setModalVisible(true);
  };

  const openEdit = (task: Task) => {
    setSelectedTask(task);
    setModalMode('edit');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? completedCount / tasks.length : 0;

  const filterCounts: Record<FilterType, number> = {
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: completedCount,
  };

  const filters: FilterType[] = ['all', 'pending', 'completed'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Tasks</Text>
            <Text style={styles.headerSub}>
              {completedCount} of {tasks.length} completed
            </Text>
          </View>

          {tasks.length > 0 && (
            <View style={styles.progressCircleWrap}>
              <Text style={styles.progressPercent}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          )}
        </View>

        {/* Progress bar */}
        {tasks.length > 0 && (
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` as any }]} />
          </View>
        )}

        {/* ── Stats row ── */}
        {tasks.length > 0 && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.statNumber, { color: '#3B82F6' }]}>{tasks.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#FFFBEB' }]}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>
                {tasks.length - completedCount}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{completedCount}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>
        )}

        {/* ── Add Task Input ── */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor="#9BA1A6"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.addBtn, !inputText.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* ── Filter tabs ── */}
        <View style={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {FILTER_LABELS[f]}
              </Text>
              <View style={[styles.filterBadge, filter === f && styles.filterBadgeActive]}>
                <Text style={[styles.filterBadgeText, filter === f && styles.filterBadgeTextActive]}>
                  {filterCounts[f]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Task List ── */}
        {loading ? (
          <ActivityIndicator style={styles.loader} size="large" color="#0a7ea4" />
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={toggleTask}
                onDelete={deleteTask}
                onView={openView}
                onEdit={openEdit}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>
                  {filter === 'completed' ? '🏆' : filter === 'pending' ? '✅' : '📋'}
                </Text>
                <Text style={styles.emptyTitle}>No tasks here</Text>
                <Text style={styles.emptySubtitle}>
                  {filter === 'all'
                    ? 'Add your first task above to get started.'
                    : `No ${FILTER_LABELS[filter].toLowerCase()} tasks right now.`}
                </Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>

      {/* ── Task Detail / Edit Modal ── */}
      <TaskDetailModal
        task={selectedTask}
        mode={modalMode}
        visible={modalVisible}
        onClose={closeModal}
        onSave={editTask}
        onDelete={deleteTask}
        onToggle={toggleTask}
        onSwitchToEdit={() => setModalMode('edit')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  flex: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#11181C',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    color: '#687076',
    marginTop: 2,
  },
  progressCircleWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercent: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // Progress bar
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    borderRadius: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: '#687076',
    fontWeight: '500',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  // Input
  inputCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 14,
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#11181C',
  },
  addBtn: {
    height: 44,
    paddingHorizontal: 18,
    backgroundColor: '#0a7ea4',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: '#B0D4E0',
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  filterBtnActive: {
    backgroundColor: '#0a7ea4',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#687076',
  },
  filterTextActive: {
    color: '#fff',
  },
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#687076',
  },
  filterBadgeTextActive: {
    color: '#fff',
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },
  loader: {
    marginTop: 60,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9BA1A6',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
