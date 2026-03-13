import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | undefined;

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return null;

  return { url, anonKey };
}

export function createSupabaseBrowserClient() {
  if (browserClient) return browserClient;

  const env = getSupabaseEnv();
  if (!env) return null;

  const { url, anonKey } = env;
  browserClient = createBrowserClient(url, anonKey);

  return browserClient;
}
