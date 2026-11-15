"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addQuote(content: string, author?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("quotes").insert({
    user_id: user.id,
    content,
    author: author || null,
  });

  if (error) throw error;
  revalidatePath("/dashboard/config/quotes");
}

export async function deleteQuote(quoteId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("quotes")
    .delete()
    .eq("id", quoteId)
    .eq("user_id", user.id);

  if (error) throw error;
  revalidatePath("/dashboard/config/quotes");
}
