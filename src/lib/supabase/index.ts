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

export interface Quote {
  id: string;
  user_id: string;
  content: string;
  author: string | null;
  created_at: string;
}

export interface DailyRoutine {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  time_slot: string | null;
  sort_order: number;
  created_at: string;
}

export type GoalStatus = "active" | "completed" | "paused";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  status: GoalStatus;
  created_at: string;
}

export interface GoalStep {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  sort_order: number;
  created_at: string;
}
