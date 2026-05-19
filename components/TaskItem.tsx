import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Task } from '@/types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export function TaskItem({
  task,
  onToggle,
  onDelete,
  onView,
  onEdit,
}: TaskItemProps) {
  return (
    <View className={`flex-row items-center bg-white rounded-2xl mb-2.5 overflow-hidden shadow-md ${task.completed ? 'bg-gray-50' : ''}`}>
      <View
        className={`w-1 self-stretch ${
          task.completed ? 'bg-green-500' : 'bg-orange-500'
        }`}
      />

      <TouchableOpacity
        className={`w-6 h-6 rounded-full border-2 ml-3.5 flex-shrink-0 items-center justify-center ${
          task.completed
            ? 'bg-green-500 border-green-500'
            : 'border-blue-500'
        }`}
        onPress={() => onToggle(task.id)}
        activeOpacity={0.7}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {task.completed && <Text className="text-white text-xs font-bold">✓</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 py-4 px-3"
        onPress={() => onView(task)}
        activeOpacity={0.7}
      >
        <Text
          className={`text-base leading-6 font-medium ${
            task.completed
              ? 'line-through text-gray-500 font-normal'
              : 'text-gray-900'
          }`}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </TouchableOpacity>

      <View className="flex-row items-center gap-1 pr-2.5">
        <TouchableOpacity
          className="w-8.5 h-8.5 rounded-2.5 bg-blue-50 items-center justify-center"
          onPress={() => onView(task)}
          activeOpacity={0.7}
        >
          <Text className="text-base">👁</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-8.5 h-8.5 rounded-2.5 bg-yellow-50 items-center justify-center"
          onPress={() => onEdit(task)}
          activeOpacity={0.7}
        >
          <Text className="text-base">✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-8.5 h-8.5 rounded-2.5 bg-red-50 items-center justify-center"
          onPress={() => onDelete(task.id)}
          activeOpacity={0.7}
        >
          <Text className="text-base">🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
