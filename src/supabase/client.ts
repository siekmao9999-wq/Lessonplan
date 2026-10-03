// Supabase Client Helper for KrouPlan
// ឯកសារជំនួយសម្រាប់ភ្ជាប់ទៅកាន់ Supabase Database

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
};

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
