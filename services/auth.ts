import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

type Client = SupabaseClient<Database>;

export async function signUp(
  supabase: Client,
  email: string,
  password: string,
  username: string
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: username },
    },
  });
  return { data, error };
}

export async function signIn(supabase: Client, email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut(supabase: Client) {
  const { error } = await supabase.auth.signOut();
  return { error };
}
