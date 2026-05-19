import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
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
        <View className="flex-1 bg-black/40" />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="absolute bottom-0 left-0 right-0"
      >
        <View className={`bg-white rounded-t-2xl px-6 pt-3 ${Platform.OS === 'ios' ? 'pb-9' : 'pb-6'}`}>
          <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-5" />

          {mode === 'view' && (
            <>
              <View className="mb-4">
                <View
                  className={`self-start py-1.25 px-3 rounded-full ${
                    task.completed
                      ? 'bg-green-100'
                      : 'bg-yellow-100'
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      task.completed
                        ? 'text-green-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {task.completed ? '✓  Completed' : '●  Pending'}
                  </Text>
                </View>
              </View>

              <Text className="text-2xl font-bold text-gray-900 leading-loose mb-5">{task.title}</Text>

              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-xs text-gray-500 font-medium">Created</Text>
                <Text className="text-xs text-gray-600">{formatDate(task.createdAt)}</Text>
              </View>

              <View className="h-px bg-gray-100 mb-5" />

              <View className="flex-row gap-2.5">
                <TouchableOpacity
                  className="flex-2 h-11.5 rounded-2xl bg-cyan-700 items-center justify-center"
                  onPress={() => {
                    onToggle(task.id);
                    onClose();
                  }}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-sm">
                    {task.completed ? 'Mark Pending' : 'Mark Complete'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-11.5 rounded-2xl bg-gray-100 items-center justify-center"
                  onPress={onSwitchToEdit}
                  activeOpacity={0.8}
                >
                  <Text className="text-gray-900 font-semibold text-sm">Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-1 h-11.5 rounded-2xl bg-red-100 items-center justify-center"
                  onPress={handleDelete}
                  activeOpacity={0.8}
                >
                  <Text className="text-red-500 font-semibold text-sm">Delete</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {mode === 'edit' && (
            <>
              <Text className="text-xl font-bold text-gray-900 mb-5">Edit Task</Text>

              <Text className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Task Title</Text>

              <TextInput
                className="bg-gray-50 border-2 border-cyan-700 rounded-2xl px-4 py-3 text-base text-gray-900 min-h-20"
                value={editText}
                onChangeText={setEditText}
                placeholder="Task title..."
                placeholderTextColor={neutral.medium}
                autoFocus
                multiline
                maxLength={200}
              />

              <Text className="text-xs text-gray-500 text-right mt-1.5">{editText.length}/200</Text>

              <View className="flex-row gap-2.5 mt-4">
                <TouchableOpacity
                  className="flex-1 h-11.5 rounded-2xl bg-gray-100 items-center justify-center"
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text className="text-gray-600 font-semibold text-sm">Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className={`flex-2 h-11.5 rounded-2xl items-center justify-center ${
                    !editText.trim()
                      ? 'bg-cyan-300 opacity-60'
                      : 'bg-cyan-700'
                  }`}
                  onPress={handleSave}
                  disabled={!editText.trim()}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-sm">Save Changes</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
