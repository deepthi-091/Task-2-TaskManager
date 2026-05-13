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
} from 'react-native';
import { Task } from '@/types/task';

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
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Mode: VIEW */}
          {mode === 'view' && (
            <>
              <View style={styles.viewHeader}>
                <View style={[styles.statusBadge, task.completed ? styles.badgeDone : styles.badgePending]}>
                  <Text style={[styles.statusText, task.completed ? styles.statusTextDone : styles.statusTextPending]}>
                    {task.completed ? '✓  Completed' : '●  Pending'}
                  </Text>
                </View>
              </View>

              <Text style={styles.viewTitle}>{task.title}</Text>

              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Created</Text>
                <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.toggleBtn]}
                  onPress={() => { onToggle(task.id); onClose(); }}
                  activeOpacity={0.8}
                >
                  <Text style={styles.toggleBtnText}>
                    {task.completed ? 'Mark Pending' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={onSwitchToEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>

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

          {/* Mode: EDIT */}
          {mode === 'edit' && (
            <>
              <Text style={styles.sheetTitle}>Edit Task</Text>

              <Text style={styles.inputLabel}>Task Title</Text>
              <TextInput
                style={styles.editInput}
                value={editText}
                onChangeText={setEditText}
                placeholder="Task title..."
                placeholderTextColor="#9BA1A6"
                autoFocus
                multiline
                maxLength={200}
              />
              <Text style={styles.charCount}>{editText.length}/200</Text>

              <View style={styles.editActionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.saveBtn, !editText.trim() && styles.saveBtnDisabled]}
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 20,
  },

  // VIEW mode
  viewHeader: {
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  badgeDone: {
    backgroundColor: '#DCFCE7',
  },
  badgePending: {
    backgroundColor: '#FEF9C3',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusTextDone: {
    color: '#16A34A',
  },
  statusTextPending: {
    color: '#CA8A04',
  },
  viewTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#11181C',
    lineHeight: 30,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  metaLabel: {
    fontSize: 13,
    color: '#9BA1A6',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 13,
    color: '#687076',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtn: {
    flex: 2,
    backgroundColor: '#0a7ea4',
  },
  toggleBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  editBtn: {
    backgroundColor: '#F3F4F6',
  },
  editBtnText: {
    color: '#11181C',
    fontWeight: '600',
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: '#FEE2E2',
  },
  deleteBtnText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 14,
  },

  // EDIT mode
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#687076',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#0a7ea4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#11181C',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#9BA1A6',
    textAlign: 'right',
    marginTop: 6,
  },
  cancelBtn: {
    backgroundColor: '#F3F4F6',
  },
  cancelBtnText: {
    color: '#687076',
    fontWeight: '600',
    fontSize: 14,
  },
  saveBtn: {
    flex: 2,
    backgroundColor: '#0a7ea4',
  },
  saveBtnDisabled: {
    backgroundColor: '#B0D4E0',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
