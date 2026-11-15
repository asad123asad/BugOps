"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { GoalStatus } from "@/lib/supabase";

export async function addGoal(title: string, description?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    title,
    description: description || null,
    status: "active",
  });

  if (error) throw error;
  revalidatePath("/dashboard/config/goals");
}

export async function deleteGoal(goalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/config/goals");
}

export async function addGoalStep(goalId: string, title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("goal_steps").insert({
    goal_id: goalId,
    user_id: user.id,
    title,
    is_completed: false,
  });

  if (error) throw error;
  revalidatePath(`/dashboard/config/goals/${goalId}`);
}

export async function toggleGoalStep(stepId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("goal_steps")
    .update({ is_completed: isCompleted })
    .eq("id", stepId)
    .eq("user_id", user.id);

  if (error) throw error;

  const { data: step } = await supabase
    .from("goal_steps")
    .select("goal_id")
    .eq("id", stepId)
    .single();

  if (step) {
    revalidatePath(`/dashboard/config/goals/${step.goal_id}`);
    revalidatePath("/dashboard/config/goals");
  }
}

export async function deleteGoalStep(stepId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: step } = await supabase
    .from("goal_steps")
    .select("goal_id")
    .eq("id", stepId)
    .eq("user_id", user.id)
    .single();

  const { error } = await supabase
    .from("goal_steps")
    .delete()
    .eq("id", stepId)
    .eq("user_id", user.id);

  if (error) throw error;

  if (step) {
    revalidatePath(`/dashboard/config/goals/${step.goal_id}`);
    revalidatePath("/dashboard/config/goals");
  }
}

export async function updateGoalStatus(goalId: string, status: GoalStatus) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("goals")
    .update({ status })
    .eq("id", goalId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/config/goals");
  revalidatePath(`/dashboard/config/goals/${goalId}`);
}
