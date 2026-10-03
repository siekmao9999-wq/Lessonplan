// TypeScript Type Definitions for Supabase Database (KrouPlan)
// Generated for public schema with permanent Admin 'សៀក ម៉ៅ'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'suspended';
export type PlanStatus = 'draft' | 'submitted' | 'approved' | 'needs_revision';
export type WorksheetType = 'in_class' | 'homework' | 'quiz' | 'experiment';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_user_id: string | null;
          name: string;
          email: string;
          phone_number: string | null;
          role: UserRole;
          is_permanent_admin: boolean;
          school_name: string;
          subjects: string[];
          grades: string[];
          status: UserStatus;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          name: string;
          email: string;
          phone_number?: string | null;
          role?: UserRole;
          is_permanent_admin?: boolean;
          school_name?: string;
          subjects?: string[];
          grades?: string[];
          status?: UserStatus;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          name?: string;
          email?: string;
          phone_number?: string | null;
          role?: UserRole;
          is_permanent_admin?: boolean;
          school_name?: string;
          subjects?: string[];
          grades?: string[];
          status?: UserStatus;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lesson_plans: {
        Row: {
          id: string;
          teacher_id: string | null;
          teacher_name: string;
          school_name: string;
          phone_number: string | null;
          subject: string;
          grade: string;
          chapter: string;
          lesson_title: string;
          sub_topic: string | null;
          duration: string;
          teaching_method: string;
          teach_date: string;
          objectives_knowledge: string[];
          objectives_skills: string[];
          objectives_attitude: string[];
          materials_teacher: string[];
          materials_student: string[];
          materials_digital: string[];
          step1_admin: Json;
          step2_review: Json;
          step3_new_lesson: Json;
          step4_summary: Json;
          step5_assignment: Json;
          teacher_reflection: string | null;
          evaluation_summary: string | null;
          full_plan_json: Json;
          status: PlanStatus;
          is_public: boolean;
          view_count: number;
          download_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          teacher_id?: string | null;
          teacher_name: string;
          school_name?: string;
          phone_number?: string | null;
          subject: string;
          grade: string;
          chapter: string;
          lesson_title: string;
          sub_topic?: string | null;
          duration?: string;
          teaching_method?: string;
          teach_date?: string;
          objectives_knowledge?: string[];
          objectives_skills?: string[];
          objectives_attitude?: string[];
          materials_teacher?: string[];
          materials_student?: string[];
          materials_digital?: string[];
          step1_admin?: Json;
          step2_review?: Json;
          step3_new_lesson?: Json;
          step4_summary?: Json;
          step5_assignment?: Json;
          teacher_reflection?: string | null;
          evaluation_summary?: string | null;
          full_plan_json: Json;
          status?: PlanStatus;
          is_public?: boolean;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string | null;
          teacher_name?: string;
          school_name?: string;
          phone_number?: string | null;
          subject?: string;
          grade?: string;
          chapter?: string;
          lesson_title?: string;
          sub_topic?: string | null;
          duration?: string;
          teaching_method?: string;
          teach_date?: string;
          objectives_knowledge?: string[];
          objectives_skills?: string[];
          objectives_attitude?: string[];
          materials_teacher?: string[];
          materials_student?: string[];
          materials_digital?: string[];
          step1_admin?: Json;
          step2_review?: Json;
          step3_new_lesson?: Json;
          step4_summary?: Json;
          step5_assignment?: Json;
          teacher_reflection?: string | null;
          evaluation_summary?: string | null;
          full_plan_json?: Json;
          status?: PlanStatus;
          is_public?: boolean;
          view_count?: number;
          download_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      plan_reviews: {
        Row: {
          id: string;
          plan_id: string;
          reviewer_id: string | null;
          reviewer_name: string;
          status: PlanStatus;
          feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          reviewer_id?: string | null;
          reviewer_name?: string;
          status: PlanStatus;
          feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          reviewer_id?: string | null;
          reviewer_name?: string;
          status?: PlanStatus;
          feedback?: string | null;
          created_at?: string;
        };
      };
      worksheets: {
        Row: {
          id: string;
          lesson_plan_id: string | null;
          teacher_id: string | null;
          title: string;
          subject: string;
          grade: string;
          worksheet_type: WorksheetType;
          content_markdown: string;
          has_mathtype: boolean;
          total_points: number;
          time_limit_minutes: number;
          instructions: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_plan_id?: string | null;
          teacher_id?: string | null;
          title: string;
          subject: string;
          grade: string;
          worksheet_type?: WorksheetType;
          content_markdown: string;
          has_mathtype?: boolean;
          total_points?: number;
          time_limit_minutes?: number;
          instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_plan_id?: string | null;
          teacher_id?: string | null;
          title?: string;
          subject?: string;
          grade?: string;
          worksheet_type?: WorksheetType;
          content_markdown?: string;
          has_mathtype?: boolean;
          total_points?: number;
          time_limit_minutes?: number;
          instructions?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      teaching_materials: {
        Row: {
          id: string;
          lesson_plan_id: string | null;
          teacher_id: string | null;
          title: string;
          material_type: string;
          content: string;
          has_mathtype: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lesson_plan_id?: string | null;
          teacher_id?: string | null;
          title: string;
          material_type: string;
          content: string;
          has_mathtype?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lesson_plan_id?: string | null;
          teacher_id?: string | null;
          title?: string;
          material_type?: string;
          content?: string;
          has_mathtype?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      view_school_analytics: {
        Row: {
          total_plans: number;
          total_approved: number;
          total_pending: number;
          total_needs_revision: number;
          total_drafts: number;
          active_teachers_count: number;
          approval_rate_percentage: number;
        };
      };
    };
  };
}
