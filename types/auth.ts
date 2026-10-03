import { LessonPlanData } from './lesson-plan';

export type UserRole = 'admin' | 'user';

export type PlanStatus = 'draft' | 'submitted' | 'approved' | 'needs_revision';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  isPermanentAdmin?: boolean;
  email: string;
  phoneNumber?: string;
  schoolName: string;
  subjects: string[];
  grades: string[];
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface ManagedLessonPlanRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  schoolName: string;
  subject: string;
  grade: string;
  chapter: string;
  lessonTitle: string;
  subTopic: string;
  plan: LessonPlanData;
  status: PlanStatus;
  submittedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}
