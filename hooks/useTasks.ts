import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

const STORAGE_KEY = '@taskmanager_tasks';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Task Manager mounted — loading tasks from storage');
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTasks(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  const persistTasks = async (updated: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  };

  const addTask = useCallback((title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => {
      const updated = [...prev, newTask];
      persistTasks(updated);
      return updated;
    });
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
      persistTasks(updated);
      return updated;
    });
  }, []);

  const editTask = useCallback((id: string, newTitle: string) => {
    setTasks(prev => {
      const updated = prev.map(t =>
        t.id === id ? { ...t, title: newTitle.trim() } : t
      );
      persistTasks(updated);
      return updated;
    });
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => {
      const updated = prev.filter(t => t.id !== id);
      persistTasks(updated);
      return updated;
    });
  }, []);

  return { tasks, loading, addTask, toggleTask, editTask, deleteTask };
}
