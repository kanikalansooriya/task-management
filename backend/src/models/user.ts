export interface User {
  id: number;
  email: string;
  password: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate: string;
  userId: number;
}
