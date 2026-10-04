import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';
import { LessonPlanData } from '@/types/lesson-plan';
import { ManagedLessonPlanRecord, PlanStatus, UserProfile } from '@/types/auth';

const STORAGE_KEYS = {
  SUPABASE_URL: 'krouplan_supabase_url',
  SUPABASE_ANON_KEY: 'krouplan_supabase_anon_key',
  LAST_SYNC: 'krouplan_supabase_last_sync',
};

// Retrieve configured credentials from environment variables or localStorage
export function getSupabaseCredentials(): { url: string; anonKey: string; isFromEnv: boolean } {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (envUrl && envAnonKey) {
    return { url: envUrl.trim(), anonKey: envAnonKey.trim(), isFromEnv: true };
  }

  if (typeof window !== 'undefined') {
    const localUrl = localStorage.getItem(STORAGE_KEYS.SUPABASE_URL) || '';
    const localAnonKey = localStorage.getItem(STORAGE_KEYS.SUPABASE_ANON_KEY) || '';
    if (localUrl && localAnonKey) {
      return { url: localUrl.trim(), anonKey: localAnonKey.trim(), isFromEnv: false };
    }
  }

  return { url: envUrl.trim(), anonKey: envAnonKey.trim(), isFromEnv: false };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEYS.SUPABASE_ANON_KEY, anonKey.trim());
  } catch {
    // ignore
  }
}

export function clearSupabaseCredentials() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_URL);
    localStorage.removeItem(STORAGE_KEYS.SUPABASE_ANON_KEY);
    localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  } catch {
    // ignore
  }
}

let cachedClient: SupabaseClient<Database> | null = null;
let lastUsedKey = '';

export function getSupabaseClient(customUrl?: string, customAnonKey?: string): SupabaseClient<Database> | null {
  const creds = customUrl && customAnonKey ? { url: customUrl, anonKey: customAnonKey } : getSupabaseCredentials();

  if (!creds.url || !creds.anonKey) {
    return null;
  }

  const cacheKey = `${creds.url}::${creds.anonKey}`;
  if (cachedClient && lastUsedKey === cacheKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient<Database>(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastUsedKey = cacheKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export function isSupabaseConnected(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey);
}

/**
 * ============================================================================
 * CHUNKED / PAGINATED FETCH UTILITY (> 1,000 ROWS ON SUPABASE FREE TIER)
 * ============================================================================
 * Supabase Free Tier (PostgREST) has a default ceiling of 1,000 rows per request.
 * This helper queries in chunks of 1,000 with `.range(offset, offset + 999)`
 * looping until all records (e.g. 5,000, 10,000+) are fetched without truncation.
 */
export async function fetchAllRowsPaginated<T = any>(
  client: SupabaseClient<Database>,
  tableName: 'lesson_plans' | 'profiles' | 'plan_reviews' | 'worksheets' | 'teaching_materials',
  options: {
    select?: string;
    pageSize?: number;
    orderCol?: string;
    ascending?: boolean;
    filterFn?: (query: any) => any;
    onProgress?: (loaded: number, total?: number) => void;
  } = {}
): Promise<{ data: T[]; total: number; error: any }> {
  const pageSize = options.pageSize || 1000;
  const selectQuery = options.select || '*';
  const orderCol = options.orderCol || 'created_at';
  const ascending = options.ascending ?? false;

  let allData: T[] = [];
  let offset = 0;
  let hasMore = true;
  let totalCount = 0;

  try {
    while (hasMore) {
      let query = client
        .from(tableName)
        .select(selectQuery, { count: offset === 0 ? 'exact' : undefined })
        .order(orderCol as any, { ascending })
        .range(offset, offset + pageSize - 1);

      if (options.filterFn) {
        query = options.filterFn(query);
      }

      const { data, count, error } = await query;

      if (error) {
        return { data: allData, total: totalCount, error };
      }

      if (offset === 0 && count !== null) {
        totalCount = count;
      }

      if (!data || data.length === 0) {
        hasMore = false;
      } else {
        allData = allData.concat(data as unknown as T[]);
        offset += data.length;

        if (options.onProgress) {
          options.onProgress(allData.length, totalCount || undefined);
        }

        // If returned fewer rows than requested pageSize, we've reached the end
        if (data.length < pageSize) {
          hasMore = false;
        }
      }
    }

    return { data: allData, total: totalCount || allData.length, error: null };
  } catch (err) {
    return { data: allData, total: allData.length, error: err };
  }
}

/**
 * Test Supabase connection and verify tables exist
 */
export async function testSupabaseConnection(
  url?: string,
  anonKey?: string
): Promise<{
  success: boolean;
  message: string;
  tableCount?: number;
  profilesCount?: number;
  plansCount?: number;
  hasPermanentAdmin?: boolean;
}> {
  const client = getSupabaseClient(url, anonKey);
  if (!client) {
    return {
      success: false,
      message: 'សូមបញ្ចូល Supabase Project URL និង Anon Key ឱ្យបានត្រឹមត្រូវ។',
    };
  }

  try {
    // 1. Test profiles table
    const { data: profiles, error: profError } = await client
      .from('profiles')
      .select('id, name, role, is_permanent_admin')
      .limit(10);

    if (profError) {
      return {
        success: false,
        message: `មិនអាចទាក់ទងតារាង profiles បានទេ៖ ${profError.message} (សូមពិនិត្យមើលថាបាន Run ឯកសារ schema.sql ក្នុង Supabase SQL Editor រួចហើយឬនៅ)`,
      };
    }

    // 2. Test lesson_plans table
    const { count: plansCount, error: planError } = await client
      .from('lesson_plans')
      .select('id', { count: 'exact', head: true });

    const hasPermanentAdmin = (profiles as any[])?.some(
      (p: any) => p.is_permanent_admin || p.name?.includes('សៀក ម៉ៅ')
    );

    return {
      success: true,
      message: 'ការតភ្ជាប់ទៅកាន់ Supabase ជោគជ័យ ១០០%!',
      profilesCount: profiles?.length || 0,
      plansCount: plansCount || 0,
      hasPermanentAdmin,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `កំហុសក្នុងការតភ្ជាប់៖ ${err?.message || 'Unknown network error'}`,
    };
  }
}

/**
 * Fetch all lesson plans from Supabase using automatic chunked pagination
 * (Guarantees retrieving more than 1,000 rows on Free Tier)
 */
export async function fetchAllPlansFromSupabase(
  onProgress?: (loaded: number, total?: number) => void
): Promise<{ records: ManagedLessonPlanRecord[]; error: any }> {
  const client = getSupabaseClient();
  if (!client) {
    return { records: [], error: new Error('Supabase មិនទាន់ត្រូវបានភ្ជាប់ទេ') };
  }

  const { data, error } = await fetchAllRowsPaginated<any>(client, 'lesson_plans', {
    orderCol: 'created_at',
    ascending: false,
    pageSize: 1000,
    onProgress,
  });

  if (error) {
    return { records: [], error };
  }

  const records: ManagedLessonPlanRecord[] = (data || []).map((row) => {
    const rawPlan = row.full_plan_json as LessonPlanData;
    return {
      id: row.id,
      teacherId: row.teacher_id || 'unknown',
      teacherName: row.teacher_name,
      schoolName: row.school_name,
      subject: row.subject,
      grade: row.grade,
      chapter: row.chapter,
      lessonTitle: row.lesson_title,
      subTopic: row.sub_topic || '',
      plan: rawPlan,
      status: (row.status as PlanStatus) || 'draft',
      submittedAt: row.created_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  });

  return { records, error: null };
}

/**
 * Upload / Sync a lesson plan to Supabase
 */
export async function uploadPlanToSupabase(
  plan: LessonPlanData,
  teacher: UserProfile,
  status: PlanStatus = 'submitted'
): Promise<{ success: boolean; id?: string; error?: any }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: new Error('Supabase មិនទាន់ត្រូវបានភ្ជាប់ទេ') };
  }

  try {
    const payload = {
      teacher_name: teacher.name,
      school_name: plan.teacherInfo.schoolName || teacher.schoolName,
      phone_number: plan.teacherInfo.phoneNumber || teacher.phoneNumber,
      subject: plan.generalInfo.subject,
      grade: plan.generalInfo.grade,
      chapter: plan.generalInfo.chapter,
      lesson_title: plan.generalInfo.lessonTitle,
      sub_topic: plan.generalInfo.subTopic || '',
      duration: plan.generalInfo.duration,
      teaching_method: plan.generalInfo.methodology || plan.generalInfo.strategy || 'វិធីសាស្ត្រ ៥ ជំហាន (MoEYS)',
      teach_date: plan.teacherInfo.date || new Date().toISOString().split('T')[0],
      objectives_knowledge: plan.objectives.knowledge,
      objectives_skills: plan.objectives.skills,
      objectives_attitude: plan.objectives.attitude,
      materials_teacher: plan.materials.teacherMaterials,
      materials_student: plan.materials.studentMaterials,
      materials_digital: [],
      step1_admin: plan.steps.step1 as any,
      step2_review: plan.steps.step2 as any,
      step3_new_lesson: plan.steps.step3 as any,
      step4_summary: plan.steps.step4 as any,
      step5_assignment: plan.steps.step5 as any,
      teacher_reflection: plan.selfReflection || '',
      evaluation_summary: plan.assessment
        ? `រោគវិនិច្ឆ័យ៖ ${plan.assessment.diagnostic} | ស្ថាបនា៖ ${plan.assessment.formative} | សរុប៖ ${plan.assessment.summative}`
        : '',
      full_plan_json: plan as any,
      status: status as any,
    };

    const { data, error } = await client
      .from('lesson_plans')
      .insert(payload as any)
      .select('id')
      .single();

    if (error) {
      return { success: false, error };
    }

    return { success: true, id: (data as any)?.id };
  } catch (err) {
    return { success: false, error: err };
  }
}
