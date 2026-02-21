export type TaskStatus = "start" | "in_progress" | "done";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  date: string;
  created_at: string;
}
