"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addRoutineItem(
  title: string,
  description?: string,
  timeSlot?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("daily_routines").insert({
    user_id: user.id,
    title,
    description: description || null,
    time_slot: timeSlot || null,
  });

  if (error) throw error;
  revalidatePath("/dashboard/config/routine");
}

export async function deleteRoutineItem(routineId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("daily_routines")
    .delete()
    .eq("id", routineId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/config/routine");
}

export async function applyRoutineToDate(dateStr: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: routines } = await supabase
    .from("daily_routines")
    .select("title, description, time_slot")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  if (!routines || routines.length === 0) return;

  const { data: existing } = await supabase
    .from("tasks")
    .select("title")
    .eq("user_id", user.id)
    .eq("date", dateStr);

  const existingTitles = new Set((existing ?? []).map((t) => t.title));

  const toInsert = routines
    .filter((r) => !existingTitles.has(r.title))
    .map((r) => ({
      user_id: user.id,
      title: r.title,
      description: r.description ?? null,
      status: "start",
      date: dateStr,
    }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("tasks").insert(toInsert);
    if (error) throw error;
  }

  const [y, m, d] = dateStr.split("-");
  revalidatePath(`/dashboard/day/${y}/${m}/${d}`);
  revalidatePath(`/dashboard/month/${y}/${m}`);
}
