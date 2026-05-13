export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'completed' | 'pending';
