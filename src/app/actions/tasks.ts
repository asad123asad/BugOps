"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TaskStatus } from "@/lib/supabase";

export async function addTask(
  date: string,
  title: string,
  description?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    description: description || null,
    status: "start",
    date,
  });

  if (error) throw error;
  const [y, m, d] = date.split("-");
  revalidatePath(`/dashboard/day/${y}/${m}/${d}`);
  revalidatePath(`/dashboard/month/${y}/${m}`);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  dateStr: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) throw error;
  const [y, m, d] = dateStr.split("-");
  revalidatePath(`/dashboard/day/${y}/${m}/${d}`);
  revalidatePath(`/dashboard/month/${y}/${m}`);
}

export async function deleteTask(taskId: string, dateStr: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", taskId)
    .eq("user_id", user.id);

  if (error) throw error;
  const [y, m, d] = dateStr.split("-");
  revalidatePath(`/dashboard/day/${y}/${m}/${d}`);
  revalidatePath(`/dashboard/month/${y}/${m}`);
}
