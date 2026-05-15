/**
 * TASK ITEM COMPONENT
 *
 * Component: components/TaskItem.tsx
 * Purpose: Display a single task item in the task list
 *
 * STYLING CONCEPTS USED:
 * - StyleSheet: All styles at bottom
 * - Flexbox: flexDirection, alignItems, flex for layout
 * - flexShrink: Prevents checkbox from compressing
 * - gap: Consistent spacing between action buttons
 * - alignSelf: Accent bar stretches to full height
 * - Conditional styles: Different looks for completed/pending
 *
 * LAYOUT:
 * Container (flexDirection: 'row')
 *   ├─ Accent bar (4px, full height)
 *   ├─ Checkbox (24x24, square)
 *   ├─ Title area (flex: 1, takes remaining space)
 *   └─ Action buttons (3 small icons)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PixelRatio } from 'react-native';
import { Task } from '@/types/task';
import { spacing } from '@/constants/spacing';
import { semantic, neutral } from '@/constants/colors';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

const fontScale = PixelRatio.getFontScale();

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onView,
  onEdit,
}: TaskItemProps) {
  return (
    <View style={[styles.container, task.completed && styles.containerDone]}>
      {/* ═══════════════════════════════════════════════════════════════
          LEFT ACCENT BAR
          Why alignSelf: 'stretch'?
          - Stretches to full container height
          - Shows task status (orange = pending, green = done)
          - Visual indicator without text
          ═══════════════════════════════════════════════════════════════ */}
      <View
        style={[
          styles.accentBar,
          task.completed ? styles.accentDone : styles.accentPending,
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════════
          CHECKBOX
          Why width/height equal (24)?
          - Creates square base for circle
          - borderRadius: 12 (half) = circle

          Why flexShrink: 0?
          - Prevents checkbox from shrinking if title overflows
          - Keeps checkbox fixed at 24x24
          - Without this, long titles could squeeze checkbox

          Why hitSlop?
          - Expands touch area 8px on all sides
          - Easier to tap without missing
          - Important on small phones
          ═══════════════════════════════════════════════════════════════ */}
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxDone]}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* ═══════════════════════════════════════════════════════════════
          TITLE AREA
          Why flex: 1?
          - Takes all remaining space after checkbox and actions
          - Title can be any length without breaking layout

          Why paddingVertical: 16?
          - Tall touch target for tapping to view details
          - Apple recommends 44pt minimum, we use 40-50 total
          - Visual breathing room

          Why paddingHorizontal: 12?
          - Space between checkbox and text
          - Text doesn't touch edges

          Why numberOfLines: 2?
          - Shows up to 2 lines of text
          - Longer tasks still visible, not truncated to "..."
          ═══════════════════════════════════════════════════════════════ */}
      <TouchableOpacity
        style={styles.titleArea}
        onPress={() => onView(task)}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </TouchableOpacity>

      {/* ═══════════════════════════════════════════════════════════════
          ACTION BUTTONS
          Why flexDirection: 'row'?
          - Three buttons sit side by side

          Why gap: 4?
          - Very small spacing between buttons
          - Keeps them compact (right side of screen)

          Why alignItems: 'center'?
          - Buttons vertically centered in row
          - Lines up with title area height

          Why paddingRight?
          - Space between last button and screen edge
          ═══════════════════════════════════════════════════════════════ */}
      <View style={styles.actions}>
        {/* VIEW BUTTON */}
        <TouchableOpacity
          style={[styles.iconBtn, styles.viewBtn]}
          onPress={() => onView(task)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewIcon}>👁</Text>
        </TouchableOpacity>

        {/* EDIT BUTTON */}
        <TouchableOpacity
          style={[styles.iconBtn, styles.editBtn]}
          onPress={() => onEdit(task)}
          activeOpacity={0.7}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>

        {/* DELETE BUTTON */}
        <TouchableOpacity
          style={[styles.iconBtn, styles.deleteBtn]}
          onPress={() => onDelete(task.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /**
   * CONTAINER
   *
   * Why flexDirection: 'row'?
   * - Checkbox, title, and actions on same line
   *
   * Why alignItems: 'center'?
   * - Vertically center all items
   * - Checkbox aligns with title middle
   *
   * Why overflow: 'hidden'?
   * - Ensures accent bar doesn't exceed border radius
   * - Creates smooth rounded corners
   *
   * Why shadow properties?
   * - Creates subtle elevation
   * - Card appears raised above background
   * - iOS: shadow*, Android: elevation
   *
   * Why marginBottom: 10?
   * - Space between items in list
   * - List container adds additional padding
   */
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: neutral.white,
    borderRadius: 14,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    // iOS shadow effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    // Android elevation effect
    elevation: 3,
  },
  containerDone: {
    backgroundColor: '#FAFAFA', // Very light gray for completed tasks
  },

  /**
   * ACCENT BAR (left side colored bar)
   *
   * Why width: 4?
   * - Thin accent, not too prominent
   * - 4px visible but not thick
   *
   * Why alignSelf: 'stretch'?
   * - Bar stretches to full container height
   * - Creates clean visual separation
   * - Without this, bar would only be as tall as text
   */
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  accentPending: {
    backgroundColor: semantic.warning, // Orange for pending
  },
  accentDone: {
    backgroundColor: semantic.success, // Green for done
  },

  /**
   * CHECKBOX
   *
   * Why width: 24, height: 24?
   * - Square base for circle
   * - 24x24 dp = comfortable touch target (Apple recommends 44pt minimum)
   * - With padding from container, total touch area is larger
   *
   * Why borderRadius: 12?
   * - Exactly half of width (24/2 = 12)
   * - Creates perfect circle
   *
   * Why marginLeft: 14?
   * - Space between accent bar and checkbox
   * - Comfortable horizontal gap
   *
   * Why flexShrink: 0?
   * - IMPORTANT: Prevents checkbox from shrinking
   * - Without this, very long titles could squeeze checkbox
   * - Keeps checkbox always 24x24
   * - In flex layouts, flex children shrink by default
   */
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: semantic.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.lg,
    flexShrink: 0, // ← Prevents squishing
  },
  checkboxDone: {
    backgroundColor: semantic.success,
    borderColor: semantic.success,
  },
  checkmark: {
    color: neutral.white,
    fontSize: 12 * fontScale,
    fontWeight: '800',
  },

  /**
   * TITLE AREA
   *
   * Why flex: 1?
   * - Takes all remaining space
   * - Pushes action buttons to right edge
   * - Works with flexShrink: 0 on checkbox
   *
   * Why paddingVertical: 16?
   * - Creates comfortable touch area
   * - Total height: 24 (checkbox) + 16+16 (padding) = 56px (above 44pt min)
   * - Visual breathing room
   *
   * Why paddingHorizontal: 12?
   * - Space from checkbox to text
   * - Text doesn't touch edges
   */
  titleArea: {
    flex: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },

  /**
   * TITLE TEXT
   *
   * Why fontSize: 15?
   * - Body text size, readable
   * - Not too large, not too small
   *
   * Why lineHeight: 22?
   * - Extra spacing between lines
   * - If title wraps to 2 lines, they're not cramped
   * - Makes multi-line tasks readable
   *
   * Why fontWeight: 500?
   * - Medium weight, not bold
   * - Emphasizes title without being too heavy
   */
  title: {
    fontSize: 15 * fontScale,
    color: neutral.dark,
    lineHeight: 22,
    fontWeight: '500',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: neutral.medium,
    fontWeight: '400', // Lighter for completed
  },

  /**
   * ACTION BUTTONS CONTAINER
   *
   * Why flexDirection: 'row'?
   * - Three buttons sit horizontally
   *
   * Why gap: 4?
   * - Very small space between buttons
   * - Keeps them compact on right side
   *
   * Why paddingRight: 10?
   * - Space from last button to screen edge
   * - Prevents buttons from touching screen edge
   */
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: spacing.sm,
    gap: spacing.xs,
  },

  /**
   * ICON BUTTON (base style for all 3 buttons)
   *
   * Why width: 34, height: 34?
   * - Square base for rounded rectangle
   * - 34x34 dp = comfortable touch target
   * - Slightly larger than text to provide comfortable padding
   *
   * Why borderRadius: 10?
   * - Rounded corners
   * - Not fully circular (not borderRadius: 17)
   * - Creates modern pill-button look
   *
   * Why alignItems/justifyContent: 'center'?
   * - Centers emoji inside button
   * - Works with any icon size
   */
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * VIEW BUTTON
   * Light blue background
   * Eye emoji icon
   */
  viewBtn: {
    backgroundColor: '#EFF6FF', // Light blue
  },
  viewIcon: {
    fontSize: 15,
  },

  /**
   * EDIT BUTTON
   * Light yellow background
   * Pencil emoji icon
   */
  editBtn: {
    backgroundColor: '#FFFBEB', // Light yellow
  },
  editIcon: {
    fontSize: 15,
  },

  /**
   * DELETE BUTTON
   * Light red background
   * Trash emoji icon
   */
  deleteBtn: {
    backgroundColor: '#FEF2F2', // Light red
  },
  deleteIcon: {
    fontSize: 15,
  },
});
