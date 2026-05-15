/**
 * TASK MANAGER HOME SCREEN
 *
 * Screen: app/(tabs)/index.tsx
 * Purpose: Display and manage tasks with filtering and statistics
 *
 * STYLING CONCEPTS USED:
 * - StyleSheet: All styles centralized at bottom
 * - Flexbox: flexDirection, justifyContent, alignItems for layout
 * - Responsive: Dimensions for adaptive widths, gap for consistent spacing
 * - Platform: Platform.OS for iOS/Android differences
 * - PixelRatio: For scalable font sizes
 * - Spacing constants: For consistent padding/margin
 *
 * LAYOUT STRUCTURE:
 * SafeAreaView (flex: 1, handles notch/safe areas)
 *   ├─ Header (flexDirection: 'row', space-between)
 *   ├─ Progress bar (visual feedback)
 *   ├─ Stats cards (flexDirection: 'row', flex distribution)
 *   ├─ Add task input (flexDirection: 'row', gap spacing)
 *   ├─ Filter buttons (flexDirection: 'row', space-between)
 *   └─ Task list (FlatList, flex: 1 for remaining space)
 */

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
  PixelRatio,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem } from '@/components/TaskItem';
import { TaskDetailModal } from '@/components/TaskDetailModal';
import { FilterType, Task } from '@/types/task';
import { spacing } from '@/constants/spacing';
import { semantic, neutral } from '@/constants/colors';

type ModalMode = 'view' | 'edit';

const FILTER_LABELS: Record<FilterType, string> = {
  all: 'All',
  pending: 'Pending',
  completed: 'Done',
};

// PixelRatio for font scaling
const fontScale = PixelRatio.getFontScale();

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

  // Filter logic
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
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ═══════════════════════════════════════════════════════════════
            HEADER SECTION
            Why flexDirection: 'row' + space-between?
            - Two elements: title (left) and progress circle (right)
            - space-between pushes them to opposite ends
            - Responsive padding based on screen size
            ═══════════════════════════════════════════════════════════════ */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>My Tasks</Text>
            <Text style={styles.headerSub}>
              {completedCount} of {tasks.length} completed
            </Text>
          </View>

          {/* Progress circle - only show if there are tasks */}
          {tasks.length > 0 && (
            <View style={styles.progressCircleWrap}>
              <Text style={styles.progressPercent}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
          )}
        </View>

        {/* ═══════════════════════════════════════════════════════════════
            PROGRESS BAR
            Why no flexDirection?
            - Single element, doesn't need flex layout
            - Width uses percentage for responsive sizing
            - Overflow hidden prevents fill from going outside border radius
            ═══════════════════════════════════════════════════════════════ */}
        {tasks.length > 0 && (
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress * 100}%` as any },
              ]}
            />
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STATS ROW
            Why flexDirection: 'row' + gap?
            - Three stat cards should sit horizontally
            - gap: 10 provides even spacing (instead of margin)
            - flex: 1 on each card makes them equal width
            - alignItems: 'center' centers text vertically in each card
            ═════════════════════════════════════════════════════════════════ */}
        {tasks.length > 0 && (
          <View style={styles.statsRow}>
            {/* Total tasks card */}
            <View style={[styles.statCard, styles.statCardTotal]}>
              <Text style={[styles.statNumber, styles.statNumberTotal]}>
                {tasks.length}
              </Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>

            {/* Pending tasks card */}
            <View style={[styles.statCard, styles.statCardPending]}>
              <Text style={[styles.statNumber, styles.statNumberPending]}>
                {tasks.length - completedCount}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            {/* Completed tasks card */}
            <View style={[styles.statCard, styles.statCardDone]}>
              <Text style={[styles.statNumber, styles.statNumberDone]}>
                {completedCount}
              </Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
          </View>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            ADD TASK INPUT
            Why flexDirection: 'row' + gap?
            - TextInput and button should be side-by-side
            - gap: 10 consistent spacing between them
            - flex: 1 on input makes it take remaining space
            - Fixed width on button with paddingHorizontal
            Why shadow + elevation?
            - iOS uses shadow properties
            - Android uses elevation property
            - Platform-specific styling (see styles object)
            ═══════════════════════════════════════════════════════════════ */}
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor={neutral.medium}
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

        {/* ═══════════════════════════════════════════════════════════════
            FILTER TABS
            Why flexDirection: 'row' + justifyContent: 'space-between'?
            - Three filter buttons spread evenly across width
            - space-between distributes equally
            - gap ensures minimum spacing
            - flex: 1 on each button makes them proportional
            Why nested flexDirection in filterBtn?
            - Each button has text + badge
            - flexDirection: 'row' keeps them on same line
            - gap: 6 spaces text and badge
            ═══════════════════════════════════════════════════════════════ */}
        <View style={styles.filterRow}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              onPress={() => setFilter(f)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.filterText, filter === f && styles.filterTextActive]}
              >
                {FILTER_LABELS[f]}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  filter === f && styles.filterBadgeActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    filter === f && styles.filterBadgeTextActive,
                  ]}
                >
                  {filterCounts[f]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ═══════════════════════════════════════════════════════════════
            TASK LIST
            Why flex: 1 on FlatList contentContainerStyle?
            - FlatList needs flex parent to take remaining space
            - flexGrow: 1 on contentContainerStyle lets list expand
            - When empty, empty component centers with padding
            Why showsVerticalScrollIndicator: false?
            - Cleaner look without scroll indicator
            ═══════════════════════════════════════════════════════════════ */}
        {loading ? (
          <ActivityIndicator
            style={styles.loader}
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

      {/* ═══════════════════════════════════════════════════════════════
          MODAL FOR TASK DETAILS/EDITING
          ═══════════════════════════════════════════════════════════════ */}
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
  /**
   * CONTAINER STYLES
   *
   * safeArea: flex: 1 takes full height, padding handled by SafeAreaView
   * keyboardView: flex: 1 takes full height, KeyboardAvoidingView adapts for keyboard
   */
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  keyboardView: {
    flex: 1,
  },

  /**
   * HEADER STYLES
   *
   * Why flexDirection: 'row'?
   * - Two elements side by side (title on left, progress on right)
   *
   * Why justifyContent: 'space-between'?
   * - Pushes title to left, progress circle to right
   * - Fills entire header width
   *
   * Why alignItems: 'center'?
   * - Vertically centers all items in header
   * - Makes progress circle align with title height
   *
   * Why paddingHorizontal: spacing.xl?
   * - Consistent side padding (16px) on all screens
   * - Uses spacing constant for maintainability
   *
   * Why paddingTop and paddingBottom separate?
   * - More breathing room above title
   * - Less space below (transitions to progress bar)
   */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
  },
  headerTitle: {
    // PixelRatio scaling: fontSize * fontScale
    // Ensures readable size on devices with different DPI
    fontSize: 30 * fontScale,
    fontWeight: '800',
    color: neutral.dark,
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14 * fontScale,
    color: neutral.mediumDark,
    marginTop: spacing.xs,
  },

  /**
   * PROGRESS CIRCLE (shows percentage completed)
   *
   * Why width/height equal values?
   * - Creates perfect circle (not oval)
   *
   * Why borderRadius: 28 (half of width)?
   * - borderRadius = size/2 = circle
   *
   * Why flexShrink: 0?
   * - Prevents circle from shrinking if other content grows
   * - Keeps it fixed size
   */
  progressCircleWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: semantic.primary,
    alignItems: 'center',
    justifyContent: 'center',
    // flexShrink: 0,  // Prevent shrinking if text overflows
  },
  progressPercent: {
    color: neutral.white,
    fontSize: 14 * fontScale,
    fontWeight: '700',
  },

  /**
   * PROGRESS BAR (visual representation of completion)
   *
   * Why height: 6?
   * - Thin but visible bar
   * - Not too prominent
   *
   * Why overflow: 'hidden'?
   * - Ensures fill doesn't exceed border radius
   * - Creates smooth rounded corners
   *
   * Why marginHorizontal matches header?
   * - Aligns with header padding for visual consistency
   */
  progressBarTrack: {
    height: 6,
    backgroundColor: neutral.mediumLight,
    marginHorizontal: spacing.xl,
    borderRadius: 3,
    marginBottom: spacing.xl,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: semantic.success,
    borderRadius: 3,
  },

  /**
   * STATS ROW (Total, Pending, Done)
   *
   * Why flexDirection: 'row'?
   * - Three stat cards sit horizontally
   *
   * Why gap: 10?
   * - Even spacing between cards
   * - 10px chosen for visual breathing room
   *
   * Why marginBottom: spacing.xl?
   * - Space before next section (input area)
   */
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },

  /**
   * STAT CARD (container for each stat)
   *
   * Why flex: 1?
   * - Each card takes equal width (1/3 of space)
   * - Cards always same size regardless of number
   *
   * Why alignItems: 'center'?
   * - Centers number and label horizontally
   *
   * Why justifyContent: 'center'?
   * - Centers vertically in card
   *
   * Why paddingVertical?
   * - Creates height for card
   * - Centers content vertically
   */
  statCard: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardTotal: {
    backgroundColor: '#EFF6FF', // Light blue
  },
  statCardPending: {
    backgroundColor: '#FFFBEB', // Light yellow
  },
  statCardDone: {
    backgroundColor: '#F0FDF4', // Light green
  },

  /**
   * STAT NUMBER (the big number: 5, 2, 3)
   *
   * Why fontSize: 22?
   * - Large enough to stand out
   * - Not so large it dominates card
   */
  statNumber: {
    fontSize: 22 * fontScale,
    fontWeight: '800',
  },
  statNumberTotal: {
    color: '#3B82F6', // Blue
  },
  statNumberPending: {
    color: '#F59E0B', // Orange/amber
  },
  statNumberDone: {
    color: semantic.success, // Green
  },

  /**
   * STAT LABEL (the text: "Total", "Pending", "Done")
   *
   * Why fontSize: 11?
   * - Small label below number
   * - Not competing for attention
   *
   * Why uppercase + letterSpacing?
   * - Professional look
   * - letterSpacing makes text slightly wider (more readable at small size)
   *
   * Why marginTop?
   * - Space between number and label
   */
  statLabel: {
    fontSize: 11 * fontScale,
    color: neutral.mediumDark,
    fontWeight: '500',
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  /**
   * INPUT CARD (add task input field)
   *
   * Why flexDirection: 'row'?
   * - TextInput and button side by side
   *
   * Why gap: 10?
   * - Consistent space between input and button
   *
   * Why marginHorizontal, marginBottom?
   * - Padding on sides, space before filter buttons
   *
   * Why shadow properties?
   * - iOS: shadowColor, shadowOffset, shadowOpacity, shadowRadius
   * - Android: elevation
   * - Together: card appears lifted off screen
   */
  inputCard: {
    flexDirection: 'row',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    gap: spacing.md,
    backgroundColor: neutral.white,
    borderRadius: 14,
    padding: spacing.sm,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    // Android elevation (higher number = higher elevation)
    elevation: 3,
  },

  /**
   * TEXT INPUT
   *
   * Why flex: 1?
   * - Takes remaining space after button
   * - Grows/shrinks with screen width
   *
   * Why height: 44?
   * - Large enough for comfortable typing
   * - Apple's recommended minimum touch target (44pt)
   *
   * Why paddingHorizontal: 14?
   * - Space between text and edges
   * - Prevents text touching border
   */
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: spacing.md,
    fontSize: 15 * fontScale,
    color: neutral.dark,
  },

  /**
   * ADD BUTTON
   *
   * Why height: 44?
   * - Matches input height
   * - Large touch target
   *
   * Why paddingHorizontal?
   * - Fixed width determined by padding
   * - Button size adapts to text width
   *
   * Why flexDirection not specified?
   * - Defaults to 'column'
   * - alignItems/justifyContent centers text inside
   */
  addBtn: {
    height: 44,
    paddingHorizontal: spacing.lg,
    backgroundColor: semantic.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDisabled: {
    backgroundColor: '#B0D4E0', // Disabled light blue
    opacity: 0.6,
  },
  addBtnText: {
    color: neutral.white,
    fontWeight: '700',
    fontSize: 14 * fontScale,
  },

  /**
   * FILTER ROW (All / Pending / Done buttons)
   *
   * Why flexDirection: 'row'?
   * - Three buttons sit horizontally
   *
   * Why gap: 8?
   * - Small spacing between buttons
   * - Less than inputCard gap for tighter layout
   *
   * Why justifyContent: 'space-between' would overflow?
   * - gap works better with flex: 1 children
   * - Ensures even spacing
   */
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.xs,
    marginBottom: spacing.xl,
  },

  /**
   * FILTER BUTTON
   *
   * Why flex: 1?
   * - All three buttons get equal width
   * - Grows/shrinks with screen
   *
   * Why flexDirection: 'row'?
   * - Button text and badge sit side by side
   *
   * Why gap: 6?
   * - Space between text and count badge
   *
   * Why elevation: 1 (not 3)?
   * - Subtle shadow (less prominent than input card)
   * - Shows it's interactive but not primary action
   *
   * Why justifyContent: 'center'?
   * - Centers text + badge horizontally
   */
  filterBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
    backgroundColor: neutral.white,
    gap: 6,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    // Android elevation
    elevation: 1,
  },
  filterBtnActive: {
    backgroundColor: semantic.primary,
  },
  filterText: {
    fontSize: 13 * fontScale,
    fontWeight: '600',
    color: neutral.mediumDark,
  },
  filterTextActive: {
    color: neutral.white,
  },

  /**
   * FILTER BADGE (count circle on each button)
   *
   * Why minWidth: 20?
   * - Ensures circle looks circular
   * - Never too wide
   *
   * Why height: 20?
   * - Square base for borderRadius: 10 (half) = circle
   *
   * Why alignItems/justifyContent: 'center'?
   * - Centers number inside circle
   */
  filterBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: neutral.lighter,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)', // Transparent white on primary
  },
  filterBadgeText: {
    fontSize: 11 * fontScale,
    fontWeight: '700',
    color: neutral.mediumDark,
  },
  filterBadgeTextActive: {
    color: neutral.white,
  },

  /**
   * TASK LIST
   *
   * Why paddingHorizontal: spacing.xl?
   * - Aligns with header and other sections
   *
   * Why paddingBottom: 32?
   * - Extra space at bottom so last item isn't cut off
   * - User can scroll task away from keyboard
   *
   * Why flexGrow: 1?
   * - Allows content to expand
   * - Works with FlatList to fill remaining space
   */
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 32,
    flexGrow: 1,
  },

  /**
   * LOADER (spinning indicator while loading)
   *
   * Why marginTop: 60?
   * - Positions spinner in middle-upper area
   * - Not too close to top
   */
  loader: {
    marginTop: 60,
  },

  /**
   * EMPTY STATE (when no tasks in current filter)
   *
   * Why flex: 1?
   * - Takes all available space
   *
   * Why alignItems: 'center'?
   * - Centers emoji and text horizontally
   *
   * Why paddingTop: 60?
   * - Positions empty state in middle of screen
   * - Not at very top
   */
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: 18 * fontScale,
    fontWeight: '700',
    color: neutral.dark,
    marginBottom: spacing.md,
  },
  emptySubtitle: {
    fontSize: 14 * fontScale,
    color: neutral.medium,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});
