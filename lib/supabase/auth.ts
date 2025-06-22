import { createClient } from "./server";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error: error ?? new Error("Unauthorized") };
  }

  return { user, supabase };
}
