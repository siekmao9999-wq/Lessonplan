import { UserProfile, ManagedLessonPlanRecord, PlanStatus } from '@/types/auth';
import { LessonPlanData } from '@/types/lesson-plan';
import { SKUN_NGS_PHYSICS_PRESET } from './presets';

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'user-admin-siekmao',
    name: 'សៀក ម៉ៅ',
    role: 'admin',
    isPermanentAdmin: true,
    email: 'siekmao9999@gmail.com',
    phoneNumber: '097 555 4321',
    schoolName: 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
    subjects: ['គ្រប់គ្រងទូទៅ', 'រូបវិទ្យា', 'គណិតវិទ្យា'],
    grades: ['ថ្នាក់ទី១០', 'ថ្នាក់ទី១១', 'ថ្នាក់ទី១២'],
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: 'user-teacher-1',
    name: 'អ្នកគ្រូ គីម សុខា',
    role: 'user',
    email: 'sokha.kim@krouplan.edu.kh',
    phoneNumber: '010 333 444',
    schoolName: 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
    subjects: ['ភាសាខ្មែរ និងអក្សរសាស្ត្រ', 'ប្រវត្តិវិទ្យា'],
    grades: ['ថ្នាក់ទី៧', 'ថ្នាក់ទី៨', 'ថ្នាក់ទី៩'],
    status: 'active',
    createdAt: '2026-02-10',
  },
  {
    id: 'user-teacher-2',
    name: 'លោកគ្រូ ចាន់ ដារ៉ា',
    role: 'user',
    email: 'dara.chan@krouplan.edu.kh',
    phoneNumber: '077 123 456',
    schoolName: 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
    subjects: ['គីមីវិទ្យា', 'ជីវវិទ្យា'],
    grades: ['ថ្នាក់ទី១០', 'ថ្នាក់ទី១២'],
    status: 'active',
    createdAt: '2026-02-20',
  },
  {
    id: 'user-teacher-3',
    name: 'លោកគ្រូ ស៊ុន វិជ្ជា',
    role: 'user',
    email: 'vichea.sun@krouplan.edu.kh',
    phoneNumber: '012 345 678',
    schoolName: 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
    subjects: ['គណិតវិទ្យា', 'ព័ត៌មានវិទ្យា (ICT)'],
    grades: ['ថ្នាក់ទី១០', 'ថ្នាក់ទី១១'],
    status: 'active',
    createdAt: '2026-03-01',
  },
];

const INITIAL_MANAGED_PLANS: ManagedLessonPlanRecord[] = [
  {
    id: 'plan-demo-1',
    teacherId: 'user-teacher-1',
    teacherName: 'អ្នកគ្រូ គីម សុខា',
    schoolName: 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
    subject: 'រូបវិទ្យា (មេកានិច & ទែម៉ូឌីណាមិច)',
    grade: 'ថ្នាក់ទី១០',
    chapter: 'ជំពូកទី៣៖ ទែម៉ូឌីណាមិច',
    lessonTitle: 'មេរៀនទី១៖ សីតុណ្ហភាព និងកម្តៅ',
    subTopic: 'សីតុណ្ហភាព និងការបំប្លែងខ្នាតសីតុណ្ហភាព (Celsius, Fahrenheit, Kelvin)',
    plan: SKUN_NGS_PHYSICS_PRESET,
    status: 'approved',
    submittedAt: '2026-10-01T08:30:00Z',
    reviewedAt: '2026-10-01T14:15:00Z',
    reviewedBy: 'សៀក ម៉ៅ (Admin អចិន្ត្រៃយ៍)',
    feedback: 'កិច្ចតែងការរៀបចំបានល្អណាស់ ស្របតាមស្តង់ដារ NGS និងមានការអនុវត្តសកម្មភាពពិសោធន៍ច្បាស់លាស់។ អនុម័តឱ្យប្រើប្រាស់!',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-01T14:15:00Z',
  },
];

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'krouplan_current_user_id',
  ALL_USERS: 'krouplan_all_users',
  MANAGED_PLANS: 'krouplan_managed_plans',
};

export function getAllUsers(): UserProfile[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    let users: UserProfile[] = raw ? JSON.parse(raw) : DEFAULT_USERS;

    // Enforce that 'សៀក ម៉ៅ' is always present and strictly permanent Admin
    const siekMaoIdx = users.findIndex(
      (u) => u.name.includes('សៀក ម៉ៅ') || u.email === 'siekmao9999@gmail.com' || u.isPermanentAdmin
    );

    if (siekMaoIdx >= 0) {
      users[siekMaoIdx] = {
        ...users[siekMaoIdx],
        name: 'សៀក ម៉ៅ',
        role: 'admin',
        isPermanentAdmin: true,
        email: 'siekmao9999@gmail.com',
      };
    } else {
      users.unshift({
        id: 'user-admin-siekmao',
        name: 'សៀក ម៉ៅ',
        role: 'admin',
        isPermanentAdmin: true,
        email: 'siekmao9999@gmail.com',
        phoneNumber: '097 555 4321',
        schoolName: 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
        subjects: ['គ្រប់គ្រងទូទៅ', 'រូបវិទ្យា', 'គណិតវិទ្យា'],
        grades: ['ថ្នាក់ទី១០', 'ថ្នាក់ទី១១', 'ថ្នាក់ទី១២'],
        status: 'active',
        createdAt: '2026-01-01',
      });
    }

    // Remove any legacy duplicate admins if applicable, ensure permanent admin is at top
    users.sort((a, b) => (b.isPermanentAdmin ? 1 : 0) - (a.isPermanentAdmin ? 1 : 0));
    return users;
  } catch {
    // fallback
  }
  return DEFAULT_USERS;
}

export function saveAllUsers(users: UserProfile[]) {
  if (typeof window === 'undefined') return;
  try {
    // Guarantee that 'សៀក ម៉ៅ' is never demoted
    const protectedUsers = users.map((u) => {
      if (u.name.includes('សៀក ម៉ៅ') || u.email === 'siekmao9999@gmail.com' || u.isPermanentAdmin) {
        return {
          ...u,
          name: 'សៀក ម៉ៅ',
          role: 'admin' as const,
          isPermanentAdmin: true,
        };
      }
      return u;
    });
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(protectedUsers));
  } catch {
    // ignore
  }
}

export function getCurrentUser(): UserProfile {
  const users = getAllUsers();
  if (typeof window === 'undefined') return users[0];
  try {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (currentId) {
      const found = users.find((u) => u.id === currentId);
      if (found) return found;
    }
  } catch {
    // fallback
  }
  // Default to permanent Admin "សៀក ម៉ៅ"
  const permanentAdmin = users.find((u) => u.isPermanentAdmin);
  return permanentAdmin || users[0];
}

export function setCurrentUserId(userId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  } catch {
    // ignore
  }
}

export function getAllManagedPlans(): ManagedLessonPlanRecord[] {
  if (typeof window === 'undefined') return INITIAL_MANAGED_PLANS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MANAGED_PLANS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return INITIAL_MANAGED_PLANS;
}

export function saveAllManagedPlans(plans: ManagedLessonPlanRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.MANAGED_PLANS, JSON.stringify(plans));
  } catch {
    // ignore
  }
}

export function submitPlanForReview(
  teacher: UserProfile,
  plan: LessonPlanData
): ManagedLessonPlanRecord {
  const plans = getAllManagedPlans();
  const existingIdx = plans.findIndex(
    (p) =>
      p.teacherId === teacher.id &&
      p.subject === plan.generalInfo.subject &&
      p.grade === plan.generalInfo.grade &&
      p.lessonTitle === plan.generalInfo.lessonTitle
  );

  const now = new Date().toISOString();
  let record: ManagedLessonPlanRecord;

  if (existingIdx >= 0) {
    record = {
      ...plans[existingIdx],
      teacherName: teacher.name,
      schoolName: plan.teacherInfo.schoolName || teacher.schoolName,
      chapter: plan.generalInfo.chapter,
      subTopic: plan.generalInfo.subTopic,
      plan,
      status: 'submitted',
      submittedAt: now,
      updatedAt: now,
    };
    plans[existingIdx] = record;
  } else {
    record = {
      id: `plan-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      schoolName: plan.teacherInfo.schoolName || teacher.schoolName,
      subject: plan.generalInfo.subject,
      grade: plan.generalInfo.grade,
      chapter: plan.generalInfo.chapter,
      lessonTitle: plan.generalInfo.lessonTitle,
      subTopic: plan.generalInfo.subTopic,
      plan,
      status: 'submitted',
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
    };
    plans.unshift(record);
  }

  saveAllManagedPlans(plans);
  return record;
}

export function reviewPlanStatus(
  planId: string,
  reviewerName: string,
  status: PlanStatus,
  feedback?: string
): ManagedLessonPlanRecord | null {
  const plans = getAllManagedPlans();
  const idx = plans.findIndex((p) => p.id === planId);
  if (idx < 0) return null;

  const now = new Date().toISOString();
  const updated: ManagedLessonPlanRecord = {
    ...plans[idx],
    status,
    reviewedAt: now,
    reviewedBy: reviewerName,
    feedback: feedback || plans[idx].feedback,
    updatedAt: now,
  };

  plans[idx] = updated;
  saveAllManagedPlans(plans);
  return updated;
}
