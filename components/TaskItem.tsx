import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onDelete, onView, onEdit }: TaskItemProps) {
  return (
    <View style={[styles.container, task.completed && styles.containerDone]}>
      {/* Left accent bar */}
      <View style={[styles.accentBar, task.completed ? styles.accentDone : styles.accentPending]} />

      {/* Checkbox */}
      <TouchableOpacity
        style={[styles.checkbox, task.completed && styles.checkboxDone]}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {task.completed && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {/* Title — tapping opens view modal */}
      <TouchableOpacity style={styles.titleArea} onPress={() => onView(task)} activeOpacity={0.7}>
        <Text style={[styles.title, task.completed && styles.titleDone]} numberOfLines={2}>
          {task.title}
        </Text>
      </TouchableOpacity>

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.iconBtn, styles.viewBtn]}
          onPress={() => onView(task)}
          activeOpacity={0.7}
        >
          <Text style={styles.viewIcon}>👁</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, styles.editBtn]}
          onPress={() => onEdit(task)}
          activeOpacity={0.7}
        >
          <Text style={styles.editIcon}>✏️</Text>
        </TouchableOpacity>

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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  containerDone: {
    backgroundColor: '#FAFAFA',
  },
  accentBar: {
    width: 4,
    alignSelf: 'stretch',
  },
  accentPending: {
    backgroundColor: '#F59E0B',
  },
  accentDone: {
    backgroundColor: '#10B981',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0a7ea4',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
    flexShrink: 0,
  },
  checkboxDone: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  titleArea: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 15,
    color: '#11181C',
    lineHeight: 22,
    fontWeight: '500',
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: '#9BA1A6',
    fontWeight: '400',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    gap: 4,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBtn: {
    backgroundColor: '#EFF6FF',
  },
  viewIcon: {
    fontSize: 15,
  },
  editBtn: {
    backgroundColor: '#FFFBEB',
  },
  editIcon: {
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#FEF2F2',
  },
  deleteIcon: {
    fontSize: 15,
  },
});
