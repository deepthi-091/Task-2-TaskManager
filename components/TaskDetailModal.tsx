/**
 * TASK DETAIL MODAL COMPONENT
 *
 * Component: components/TaskDetailModal.tsx
 * Purpose: Display task details in view mode or edit task title in edit mode
 *
 * STYLING CONCEPTS USED:
 * - StyleSheet: All styles at bottom, organized by section
 * - Flexbox: flexDirection, justifyContent for various layouts
 * - alignSelf: Drag handle centers itself
 * - Platform: Different padding/keyboard behavior iOS vs Android
 * - gap: Consistent spacing between action buttons
 * - Two modal modes: VIEW and EDIT with different layouts
 *
 * LAYOUT:
 * Modal (transparent overlay)
 *   └─ Sheet (bottom-up slide animation)
 *       ├─ Drag handle (centered, alignSelf)
 *       ├─ VIEW MODE: Status, title, metadata, action buttons
 *       └─ EDIT MODE: Input field, character count, save/cancel buttons
 */

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  PixelRatio,
} from 'react-native';
import { Task } from '@/types/task';
import { neutral } from '@/constants/colors';

type ModalMode = 'view' | 'edit';

interface TaskDetailModalProps {
  task: Task | null;
  mode: ModalMode;
  visible: boolean;
  onClose: () => void;
  onSave: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  onSwitchToEdit: () => void;
}

const fontScale = PixelRatio.getFontScale();

/**
 * Format date to readable format
 * Example: "Mon, Dec 15, 2024, 02:30 PM"
 */
function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TaskDetailModal({
  task,
  mode,
  visible,
  onClose,
  onSave,
  onDelete,
  onToggle,
  onSwitchToEdit,
}: TaskDetailModalProps) {
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (task) setEditText(task.title);
  }, [task]);

  if (!task) return null;

  const handleSave = () => {
    if (!editText.trim()) return;
    onSave(task.id, editText.trim());
    onClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* ═══════════════════════════════════════════════════════════════
          OVERLAY (semi-transparent backdrop)
          Tapping closes modal
          ═══════════════════════════════════════════════════════════════ */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* ═══════════════════════════════════════════════════════════════
          SHEET (bottom modal container)
          Why KeyboardAvoidingView with Platform check?
          - iOS: 'padding' behavior = add space when keyboard appears
          - Android: undefined (doesn't use this, handles differently)
          ═══════════════════════════════════════════════════════════════ */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          {/* ─── DRAG HANDLE ─── */}
          <View style={styles.handle} />

          {/* ═══════════════════════════════════════════════════════════════
              VIEW MODE: Display task details
              ═══════════════════════════════════════════════════════════════ */}
          {mode === 'view' && (
            <>
              {/* Status badge (Completed / Pending) */}
              <View style={styles.viewHeader}>
                <View
                  style={[
                    styles.statusBadge,
                    task.completed
                      ? styles.badgeDone
                      : styles.badgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      task.completed
                        ? styles.statusTextDone
                        : styles.statusTextPending,
                    ]}
                  >
                    {task.completed ? '✓  Completed' : '●  Pending'}
                  </Text>
                </View>
              </View>

              {/* Task title */}
              <Text style={styles.viewTitle}>{task.title}</Text>

              {/* Created date */}
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Action buttons: Toggle, Edit, Delete */}
              <View style={styles.actionRow}>
                {/* Toggle Complete/Pending button */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.toggleBtn]}
                  onPress={() => {
                    onToggle(task.id);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.toggleBtnText}>
                    {task.completed ? 'Mark Pending' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>

                {/* Edit button */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={onSwitchToEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

                {/* Delete button */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={handleDelete}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ═══════════════════════════════════════════════════════════════
              EDIT MODE: Edit task title
              ═══════════════════════════════════════════════════════════════ */}
          {mode === 'edit' && (
            <>
              {/* Title */}
              <Text style={styles.sheetTitle}>Edit Task</Text>

              {/* Input label */}
              <Text style={styles.inputLabel}>Task Title</Text>

              {/* Text input field */}
              <TextInput
                style={styles.editInput}
                value={editText}
                onChangeText={setEditText}
                placeholder="Task title..."
                placeholderTextColor={neutral.medium}
                autoFocus
                multiline
                maxLength={200}
              />

              {/* Character counter */}
              <Text style={styles.charCount}>{editText.length}/200</Text>

              {/* Action buttons: Cancel, Save */}
              <View style={styles.editActionRow}>
                {/* Cancel button */}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                {/* Save button */}
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    styles.saveBtn,
                    !editText.trim() && styles.saveBtnDisabled,
                  ]}
                  onPress={handleSave}
                  disabled={!editText.trim()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /**
   * OVERLAY (semi-transparent background behind modal)
   *
   * Why flex: 1?
   * - Takes full screen height
   * - Creates backdrop for entire screen
   *
   * Why rgba(0,0,0,0.4)?
   * - 40% black transparency
   * - Darkens background but doesn't hide it completely
   * - User can see app behind modal
   */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  /**
   * SHEET WRAPPER (positioning container)
   *
   * Why position: 'absolute'?
   * - Positions modal sheet at specific location
   *
   * Why bottom: 0, left: 0, right: 0?
   * - Stretches sheet to full screen width
   * - Positions at bottom
   * - Creates "bottom sheet" effect
   */
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  /**
   * SHEET (main modal container)
   *
   * Why borderTopLeftRadius/borderTopRightRadius: 24?
   * - Rounded top corners
   * - Bottom corners are square
   * - Modern bottom sheet appearance
   *
   * Why paddingBottom different for iOS/Android?
   * - iOS has home indicator area (needs more padding)
   * - Android doesn't have this (less padding)
   * - Platform-specific styling prevents content overlap
   *
   * Why paddingTop: 12?
   * - Small space before drag handle
   * - Not too much, keeps sheet compact
   */
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },

  /**
   * DRAG HANDLE (visual indicator at top of sheet)
   *
   * Why alignSelf: 'center'?
   * - Centers handle horizontally
   * - Overrides parent alignment
   * - Creates visual center line on sheet
   *
   * Why width: 40, height: 4?
   * - Small pill shape
   * - Visible but subtle
   * - borderRadius: 2 rounds ends
   *
   * Why marginBottom: 20?
   * - Space between handle and content below
   */
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },

  /**
   * SHEET TITLE ("Edit Task" heading)
   *
   * Why fontSize: 20?
   * - Large heading for edit mode
   * - Clear section header
   */
  sheetTitle: {
    fontSize: 20 * fontScale,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 20,
  },

  // ═══════════════════════════════════════════════════════════════
  // VIEW MODE STYLES
  // ═══════════════════════════════════════════════════════════════

  /**
   * VIEW HEADER (container for status badge)
   *
   * Why marginBottom: 16?
   * - Space between badge and task title
   */
  viewHeader: {
    marginBottom: 16,
  },

  /**
   * STATUS BADGE (Completed / Pending indicator)
   *
   * Why alignSelf: 'flex-start'?
   * - Badge only takes as much width as needed
   * - Left-aligns in container
   * - Not stretched full width
   *
   * Why paddingVertical: 5, paddingHorizontal: 12?
   * - Small padding inside badge
   * - Creates pill shape with rounded corners
   *
   * Why borderRadius: 20?
   * - Creates rounded pill shape
   * - Large radius for smooth curves
   */
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeDone: {
    backgroundColor: '#DCFCE7', // Light green
  },
  badgePending: {
    backgroundColor: '#FEF9C3', // Light yellow
  },

  /**
   * STATUS TEXT (inside badge)
   */
  statusText: {
    fontSize: 13 * fontScale,
    fontWeight: '600',
  },
  statusTextDone: {
    color: '#16A34A', // Dark green
  },
  statusTextPending: {
    color: '#CA8A04', // Dark orange
  },

  /**
   * VIEW TITLE (task title in view mode)
   *
   * Why lineHeight: 30?
   * - Extra space between lines
   * - If title is very long, wraps to 2+ lines
   * - Wrapped text stays readable with extra line height
   */
  viewTitle: {
    fontSize: 22 * fontScale,
    fontWeight: '700',
    color: '#11181C',
    lineHeight: 30,
    marginBottom: 20,
  },

  /**
   * META ROW (Created date section)
   *
   * Why flexDirection: 'row'?
   * - Label and value on same line
   *
   * Why justifyContent: 'space-between'?
   * - "Created" label on left, date on right
   * - Fills entire width
   *
   * Why alignItems: 'center'?
   * - Vertically center text
   * - If text wraps, stays aligned
   */
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaLabel: {
    fontSize: 13 * fontScale,
    color: neutral.medium,
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 13 * fontScale,
    color: '#687076',
  },

  /**
   * DIVIDER (horizontal line)
   *
   * Why height: 1?
   * - Thin line, not too prominent
   * - Separates sections
   *
   * Why backgroundColor: light gray?
   * - Visible but subtle
   * - Doesn't distract from content
   */
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 20,
  },

  /**
   * ACTION ROW (view mode buttons: Toggle, Edit, Delete)
   *
   * Why flexDirection: 'row'?
   * - Three buttons in a row
   *
   * Why gap: 10?
   * - Space between buttons
   * - Prevents them from squishing together
   */
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  /**
   * EDIT ACTION ROW (edit mode buttons: Cancel, Save)
   *
   * Why marginTop: 16?
   * - Space between input field and buttons
   */
  editActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },

  /**
   * ACTION BUTTON (base style for all buttons)
   *
   * Why flex: 1?
   * - Each button gets equal width by default
   *
   * Why height: 46?
   * - Tall enough for comfortable tapping
   * - Above Apple's 44pt minimum
   *
   * Why alignItems/justifyContent: 'center'?
   * - Centers text both horizontally and vertically
   */
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /**
   * TOGGLE BUTTON (Mark Complete / Mark Pending)
   *
   * Why flex: 2?
   * - Gets 2x space compared to edit/delete buttons
   * - Primary action gets emphasis
   * - Takes ~40% of width with flex: 1 siblings taking ~30% each
   */
  toggleBtn: {
    flex: 2,
    backgroundColor: '#0a7ea4',
  },
  toggleBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14 * fontScale,
  },

  /**
   * EDIT BUTTON
   */
  editBtn: {
    backgroundColor: '#F3F4F6', // Light gray
  },
  editBtnText: {
    color: '#11181C',
    fontWeight: '600',
    fontSize: 14 * fontScale,
  },

  /**
   * DELETE BUTTON
   */
  deleteBtn: {
    backgroundColor: '#FEE2E2', // Light red
  },
  deleteBtnText: {
    color: '#EF4444', // Red
    fontWeight: '600',
    fontSize: 14 * fontScale,
  },

  // ═══════════════════════════════════════════════════════════════
  // EDIT MODE STYLES
  // ═══════════════════════════════════════════════════════════════

  /**
   * INPUT LABEL ("Task Title" text)
   *
   * Why uppercase + letterSpacing?
   * - Professional appearance
   * - letterSpacing: 0.5 spreads letters slightly
   * - Makes small text more readable
   *
   * Why marginBottom: 8?
   * - Small space before input field
   */
  inputLabel: {
    fontSize: 13 * fontScale,
    fontWeight: '600',
    color: '#687076',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /**
   * EDIT INPUT (text field for editing task)
   *
   * Why minHeight: 80?
   * - Shows 3-4 lines of text
   * - Tall enough to see multi-line input
   *
   * Why textAlignVertical: 'top'?
   * - Text starts at top of field
   * - Not vertically centered
   * - Important for multiline inputs
   *
   * Why borderWidth: 1.5 (not 1)?
   * - Slightly thicker border
   * - More visible focus indicator
   * - Shows it's primary input field
   *
   * Why paddingVertical/Horizontal: 12, 16?
   * - Comfortable padding inside field
   * - Text doesn't touch edges
   */
  editInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16 * fontScale,
    color: '#11181C',
    minHeight: 80,
    textAlignVertical: 'top',
  },

  /**
   * CHARACTER COUNT (e.g., "45/200")
   *
   * Why textAlign: 'right'?
   * - Aligned to right side
   * - Matches input width
   * - User can see it's associated with input
   *
   * Why marginTop: 6?
   * - Small gap between input and counter
   */
  charCount: {
    fontSize: 12 * fontScale,
    color: neutral.medium,
    textAlign: 'right',
    marginTop: 6,
  },

  /**
   * CANCEL BUTTON
   */
  cancelBtn: {
    backgroundColor: '#F3F4F6', // Light gray
  },
  cancelBtnText: {
    color: '#687076',
    fontWeight: '600',
    fontSize: 14 * fontScale,
  },

  /**
   * SAVE BUTTON
   *
   * Why flex: 2?
   * - Gets 2x space compared to cancel button
   * - Primary action gets emphasis
   * - User's attention drawn to save
   */
  saveBtn: {
    flex: 2,
    backgroundColor: '#0a7ea4',
  },

  /**
   * SAVE BUTTON DISABLED
   *
   * Why this style?
   * - Shows button is disabled when input is empty
   * - Lighter color signals "not clickable"
   * - User understands they need to enter text first
   */
  saveBtnDisabled: {
    backgroundColor: '#B0D4E0',
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14 * fontScale,
  },
});
