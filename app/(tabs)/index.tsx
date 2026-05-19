import '../../global.css';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { TaskItem } from '@/components/TaskItem';
import { neutral, semantic } from '@/constants/colors';
import { useTasks } from '@/hooks/useTasks';
import { FilterType, Task } from '@/types/task';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView className="flex-1 bg-blue-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-row items-center justify-between px-4 pt-4 pb-3">
          <View>
            <Text className="text-3xl font-black text-gray-900 -tracking-0.5">My Tasks</Text>
            <Text className="text-sm text-gray-600 mt-0.5">
              {completedCount} of {tasks.length} completed
            </Text>
          </View>

          {tasks.length > 0 && (
            <View className="w-14 h-14 rounded-full bg-cyan-700 items-center justify-center">
              <Text className="text-white font-bold text-sm">
                {Math.round(progress * 100)}%
              </Text>
            </View>
          )}
        </View>

        {tasks.length > 0 && (
          <View className="h-1.5 bg-gray-300 mx-4 rounded-full mb-4 overflow-hidden">
            <View
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
        )}

        {tasks.length > 0 && (
          <View className="flex-row px-4 gap-2.5 mb-4">
            <View className="flex-1 rounded-2xl bg-blue-100 py-3 items-center justify-center">
              <Text className="text-xl font-black text-blue-500">
                {tasks.length}
              </Text>
              <Text className="text-xs text-gray-700 font-medium mt-1 uppercase tracking-0.1">Total</Text>
            </View>

            <View className="flex-1 rounded-2xl bg-yellow-100 py-3 items-center justify-center">
              <Text className="text-xl font-black text-amber-500">
                {tasks.length - completedCount}
              </Text>
              <Text className="text-xs text-gray-700 font-medium mt-1 uppercase tracking-0.1">Pending</Text>
            </View>

            <View className="flex-1 rounded-2xl bg-green-100 py-3 items-center justify-center">
              <Text className="text-xl font-black text-green-500">
                {completedCount}
              </Text>
              <Text className="text-xs text-gray-700 font-medium mt-1 uppercase tracking-0.1">Done</Text>
            </View>
          </View>
        )}

        <View className="flex-row mx-4 mb-4 gap-3 bg-white rounded-2xl p-2 shadow-sm" style={{ elevation: 3 }}>
          <TextInput
            className="flex-1 h-11 px-3.5 text-base text-gray-900"
            placeholder="What needs to be done?"
            placeholderTextColor={neutral.medium}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleAdd}
            returnKeyType="done"
          />
          <TouchableOpacity
            className={`h-11 px-4 rounded-2.5 items-center justify-center ${
              !inputText.trim() ? 'bg-cyan-300 opacity-60' : 'bg-cyan-700'
            }`}
            onPress={handleAdd}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-sm">+ Add</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row px-4 gap-2 mb-4">
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              className={`flex-1 flex-row items-center justify-center py-2.25 px-2 rounded-3xl gap-1.5 ${
                filter === f
                  ? 'bg-cyan-700'
                  : 'bg-white'
              }`}
              style={{ elevation: 1 }}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text
                className={`text-sm font-semibold ${
                  filter === f ? 'text-white' : 'text-gray-600'
                }`}
              >
                {FILTER_LABELS[f]}
              </Text>
              <View
                className={`min-w-5 h-5 rounded-full items-center justify-center px-1 ${
                  filter === f
                    ? 'bg-white/25'
                    : 'bg-gray-200'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    filter === f ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {filterCounts[f]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator
            className="mt-15"
            size="large"
            color={semantic.primary}
          />
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
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 32,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="flex-1 items-center pt-15">
                <Text className="text-5xl mb-4">
                  {filter === 'completed' ? '🏆' : filter === 'pending' ? '✅' : '📋'}
                </Text>
                <Text className="text-lg font-bold text-gray-900 mb-3">No tasks here</Text>
                <Text className="text-sm text-gray-500 text-center px-8 leading-5">
                  {filter === 'all'
                    ? 'Add your first task above to get started.'
                    : `No ${FILTER_LABELS[filter].toLowerCase()} tasks right now.`}
                </Text>
              </View>
            }
          />
        )}
      </KeyboardAvoidingView>

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
