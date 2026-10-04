'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MessageSquare,
  Users,
  BarChart3,
  School,
  Search,
  Filter,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  ArrowRight,
  UserPlus,
  Trash2,
  Edit2,
  Check,
  Send,
  Database,
} from 'lucide-react';
import { UserProfile, ManagedLessonPlanRecord, PlanStatus, UserRole } from '@/types/auth';
import { LessonPlanData } from '@/types/lesson-plan';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  managedPlans: ManagedLessonPlanRecord[];
  onReviewPlan: (planId: string, status: PlanStatus, feedback?: string) => void;
  onSelectPlanToView: (plan: LessonPlanData) => void;
  onUpdateUsers: (users: UserProfile[]) => void;
  onOpenSupabaseModal?: () => void;
}

export function AdminDashboardModal({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  managedPlans,
  onReviewPlan,
  onSelectPlanToView,
  onUpdateUsers,
  onOpenSupabaseModal,
}: AdminDashboardModalProps) {
  const [activeTab, setActiveTab] = useState<'review' | 'teachers' | 'stats' | 'settings'>('review');
  const [statusFilter, setStatusFilter] = useState<'all' | PlanStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Feedback Dialog State
  const [feedbackPlanId, setFeedbackPlanId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  // New Teacher Modal
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherRole, setNewTeacherRole] = useState<UserRole>('user');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherSubject, setNewTeacherSubject] = useState('រូបវិទ្យា');
  const [newTeacherGrade, setNewTeacherGrade] = useState('ថ្នាក់ទី១០');

  // Filter plans based on status and search query
  const filteredPlans = useMemo(() => {
    return managedPlans.filter((p) => {
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchQuery =
        !searchQuery.trim() ||
        p.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lessonTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.grade.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchQuery;
    });
  }, [managedPlans, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = managedPlans.length;
    const approved = managedPlans.filter((p) => p.status === 'approved').length;
    const pending = managedPlans.filter((p) => p.status === 'submitted').length;
    const needsRevision = managedPlans.filter((p) => p.status === 'needs_revision').length;

    // By subject
    const subjectMap: Record<string, number> = {};
    managedPlans.forEach((p) => {
      const sub = p.subject.split('(')[0].trim();
      subjectMap[sub] = (subjectMap[sub] || 0) + 1;
    });

    // By grade
    const gradeMap: Record<string, number> = {};
    managedPlans.forEach((p) => {
      gradeMap[p.grade] = (gradeMap[p.grade] || 0) + 1;
    });

    return {
      total,
      approved,
      pending,
      needsRevision,
      subjectMap,
      gradeMap,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 100,
    };
  }, [managedPlans]);

  if (!isOpen) return null;

  const handleApprove = (planId: string) => {
    const reviewerTitle = currentUser.isPermanentAdmin
      ? `${currentUser.name} (Admin អចិន្ត្រៃយ៍)`
      : currentUser.name;
    onReviewPlan(
      planId,
      'approved',
      `កិច្ចតែងការត្រូវបានពិនិត្យ និងអនុម័តដោយ ${reviewerTitle}។ ស្របតាមស្តង់ដារ ៥ ជំហានរបស់ MoEYS!`
    );
  };

  const handleOpenFeedback = (plan: ManagedLessonPlanRecord) => {
    setFeedbackPlanId(plan.id);
    setFeedbackText(plan.feedback || 'សូមពិនិត្យបន្ថែមលើ៖ \n១. សកម្មភាពសិស្សក្នុងជំហានទី ៣\n២. ការបញ្ជាក់សម្ភារឧបទេសឱ្យកាន់តែជាក់ស្តែង');
  };

  const handleSubmitFeedback = () => {
    if (feedbackPlanId) {
      onReviewPlan(feedbackPlanId, 'needs_revision', feedbackText);
      setFeedbackPlanId(null);
      setFeedbackText('');
    }
  };

  const handleToggleUserRole = (userId: string) => {
    const target = allUsers.find((u) => u.id === userId);
    if (target?.isPermanentAdmin) {
      return; // Cannot demote permanent admin
    }
    const updated = allUsers.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          role: u.role === 'admin' ? ('user' as UserRole) : ('admin' as UserRole),
        };
      }
      return u;
    });
    onUpdateUsers(updated);
  };

  const handleAddNewTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    const newTeacher: UserProfile = {
      id: `teacher-${Date.now()}`,
      name: newTeacherName.trim(),
      role: newTeacherRole,
      email: `${newTeacherName.replace(/\s+/g, '').toLowerCase()}@krouplan.edu.kh`,
      phoneNumber: newTeacherPhone.trim(),
      schoolName: currentUser.schoolName,
      subjects: [newTeacherSubject.trim()],
      grades: [newTeacherGrade.trim()],
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };

    onUpdateUsers([...allUsers, newTeacher]);
    setNewTeacherName('');
    setNewTeacherPhone('');
    setShowAddTeacher(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-3 text-slate-900 dark:text-slate-100 flex flex-col max-h-[94vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-950 text-white p-4 sm:p-5 px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-moul text-sm sm:text-base text-white">
                  ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល & នាយកសាលា (Admin Dashboard)
                </h3>
                <span className="bg-purple-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  MoEYS Standard
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                {currentUser.schoolName} • នាយកគ្រប់គ្រង៖{' '}
                <strong>
                  {currentUser.name} {currentUser.isPermanentAdmin ? '(Admin អចិន្ត្រៃយ៍)' : ''}
                </strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 sm:px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'review'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>១. ត្រួតពិនិត្យ និងអនុម័ត ({stats.pending})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('teachers')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'teachers'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>២. គ្រប់គ្រងគ្រូបង្រៀន ({allUsers.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'stats'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>៣. ស្ថិតិ & របាយការណ៍</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:block">
              អត្រាអនុម័ត៖ <strong className="text-emerald-600 dark:text-emerald-400">{stats.approvalRate}%</strong> ({stats.approved}/{stats.total})
            </div>

            {onOpenSupabaseModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSupabaseModal();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition shadow-2xs cursor-pointer"
                title="បើកផ្ទាំងភ្ជាប់ Supabase & Vercel"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Supabase Cloud</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* ========================================================
              TAB 1: LESSON PLAN REVIEW & APPROVAL
             ======================================================== */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>ស្ថានភាព៖</span>
                  </span>
                  {(
                    [
                      { id: 'all', label: `ទាំងអស់ (${managedPlans.length})` },
                      { id: 'submitted', label: `🟡 រង់ចាំពិនិត្យ (${stats.pending})` },
                      { id: 'approved', label: `🟢 បានអនុម័ត (${stats.approved})` },
                      { id: 'needs_revision', label: `🔴 ស្នើសុំកែ (${stats.needsRevision})` },
                    ] as const
                  ).map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      onClick={() => setStatusFilter(btn.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                        statusFilter === btn.id
                          ? 'bg-purple-600 text-white border-purple-700'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ស្វែងរកតាមឈ្មោះគ្រូ មុខវិជ្ជា ឬមេរៀន..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Plans List */}
              {filteredPlans.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                  <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2 opacity-50" />
                  <div className="font-bold text-slate-700 dark:text-slate-300">
                    មិនមានកិច្ចតែងការក្នុងស្ថានភាពនេះឡើយ
                  </div>
                  <p className="text-slate-500 text-xs mt-1">
                    នៅពេលលោកគ្រូ-អ្នកគ្រូដាក់ស្នើកិច្ចតែងការ វានឹងបង្ហាញនៅទីនេះដើម្បីឱ្យលោកនាយកត្រួតពិនិត្យ។
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPlans.map((planRecord) => {
                    const isPending = planRecord.status === 'submitted';
                    const isApproved = planRecord.status === 'approved';
                    const isRevision = planRecord.status === 'needs_revision';

                    return (
                      <div
                        key={planRecord.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-xs transition hover:shadow-sm space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {planRecord.lessonTitle}
                              </span>
                              <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[10.5px] font-semibold">
                                {planRecord.chapter}
                              </span>
                              <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded text-[10.5px] font-bold">
                                {planRecord.subject} ({planRecord.grade})
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                              <span>👨‍🏫 គ្រូបង្រៀន៖ <strong>{planRecord.teacherName}</strong></span>
                              <span>📅 ដាក់ស្នើ៖ {planRecord.submittedAt ? new Date(planRecord.submittedAt).toLocaleDateString('km-KH') : 'ថ្មីៗ'}</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div>
                            {isPending && (
                              <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>រង់ចាំការពិនិត្យ (Pending)</span>
                              </span>
                            )}
                            {isApproved && (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>បានអនុម័ត (Approved)</span>
                              </span>
                            )}
                            {isRevision && (
                              <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 px-3 py-1 rounded-full text-xs font-bold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>ត្រូវការកែសម្រួល</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Subtopic */}
                        <div className="text-[11px] text-slate-600 dark:text-slate-300">
                          <strong>ប្រធានបទរង៖</strong> {planRecord.subTopic}
                        </div>

                        {/* Existing Feedback Note */}
                        {planRecord.feedback && (
                          <div className="bg-amber-50/70 dark:bg-amber-950/30 border-l-4 border-amber-500 p-2.5 rounded text-[11px] text-amber-900 dark:text-amber-200">
                            <strong>💬 មតិយោបល់របស់នាយកសាលា ({planRecord.reviewedBy || 'Admin'})៖</strong>
                            <p className="mt-0.5 whitespace-pre-line">{planRecord.feedback}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectPlanToView(planRecord.plan);
                              onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>បើកមើលកិច្ចតែងការលម្អិត</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {/* Request revision button */}
                            <button
                              type="button"
                              onClick={() => handleOpenFeedback(planRecord)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-lg text-xs font-semibold transition cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>ផ្តល់មតិកែលម្អ</span>
                            </button>

                            {/* Approve Button */}
                            <button
                              type="button"
                              onClick={() => handleApprove(planRecord.id)}
                              disabled={isApproved}
                              className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                                isApproved
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 opacity-60 cursor-default'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>{isApproved ? '✓ បានអនុម័តរួចរាល់' : '✓ អនុម័តកិច្ចតែងការ'}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: TEACHERS & ACCOUNTS MANAGEMENT
             ======================================================== */}
          {activeTab === 'teachers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    បញ្ជីគ្រូបង្រៀន និងអ្នកគ្រប់គ្រង ({allUsers.length} នាក់)
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    លោកនាយកអាចកែប្រែតួនាទី (Admin ↔ User) ឬបន្ថែមគ្រូបង្រៀនថ្មីបាន។
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(!showAddTeacher)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-xs cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{showAddTeacher ? 'បិទបែបបទ' : '+ បន្ថែមគ្រូថ្មី'}</span>
                </button>
              </div>

              {/* Add Teacher Form */}
              {showAddTeacher && (
                <form
                  onSubmit={handleAddNewTeacherSubmit}
                  className="bg-purple-50/60 dark:bg-purple-950/30 p-4 rounded-xl border border-purple-200 dark:border-purple-800 space-y-3"
                >
                  <div className="font-bold text-purple-950 dark:text-purple-200 text-xs">
                    ✍️ បញ្ចូលព័ត៌មានគ្រូបង្រៀនថ្មី
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        ឈ្មោះគ្រូ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newTeacherName}
                        onChange={(e) => setNewTeacherName(e.target.value)}
                        placeholder="ឧ. លោកគ្រូ ស៊ុន ពិសិដ្ឋ"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        តួនាទី
                      </label>
                      <select
                        value={newTeacherRole}
                        onChange={(e) => setNewTeacherRole(e.target.value as UserRole)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold"
                      >
                        <option value="user">👨‍🏫 User (គ្រូបង្រៀន)</option>
                        <option value="admin">👑 Admin (នាយក/រដ្ឋបាល)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        លេខទូរស័ព្ទ
                      </label>
                      <input
                        type="text"
                        value={newTeacherPhone}
                        onChange={(e) => setNewTeacherPhone(e.target.value)}
                        placeholder="ឧ. 092 123 456"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        មុខវិជ្ជា
                      </label>
                      <input
                        type="text"
                        value={newTeacherSubject}
                        onChange={(e) => setNewTeacherSubject(e.target.value)}
                        placeholder="ឧ. រូបវិទ្យា"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        កម្រិតថ្នាក់
                      </label>
                      <input
                        type="text"
                        value={newTeacherGrade}
                        onChange={(e) => setNewTeacherGrade(e.target.value)}
                        placeholder="ឧ. ថ្នាក់ទី១០"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-xs shadow-xs"
                      >
                        រក្សាទុកគ្រូថ្មី
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Table of teachers */}
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-3">ឈ្មោះ & តួនាទី</th>
                      <th className="p-3">មុខវិជ្ជា & ថ្នាក់</th>
                      <th className="p-3">ទំនាក់ទំនង</th>
                      <th className="p-3">ស្ថានភាព</th>
                      <th className="p-3 text-right">សកម្មភាព</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allUsers.map((teacher) => {
                      const isAdmin = teacher.role === 'admin';
                      return (
                        <tr key={teacher.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{isAdmin ? '👑' : '👨‍🏫'}</span>
                            <div>
                              <div>{teacher.name}</div>
                              {teacher.isPermanentAdmin ? (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                  👑 Admin អចិន្ត្រៃយ៍
                                </span>
                              ) : (
                                <span
                                  className={`inline-block px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                    isAdmin
                                      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
                                      : 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
                                  }`}
                                >
                                  {isAdmin ? 'Admin (នាយក/រដ្ឋបាល)' : 'User (គ្រូបង្រៀន)'}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">
                            <div>{teacher.subjects.join(', ')}</div>
                            <div className="text-[10.5px] text-slate-400">{teacher.grades.join(', ')}</div>
                          </td>
                          <td className="p-3 text-slate-500">
                            <div>{teacher.phoneNumber || '-'}</div>
                            <div className="text-[10px] text-slate-400">{teacher.email}</div>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              សកម្ម (Active)
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {teacher.isPermanentAdmin ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-2xs">
                                <span>🔒</span>
                                <span>Admin អចិន្ត្រៃយ៍</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleToggleUserRole(teacher.id)}
                                className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                title="ប្តូរតួនាទី Admin ឬ User"
                              >
                                {isAdmin ? 'ប្តូរជា User' : 'តម្លើងជា Admin'}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: STATISTICS & MOEYS ANALYTICS
             ======================================================== */}
          {activeTab === 'stats' && (
            <div className="space-y-4">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                  <span className="text-2xl font-bold text-purple-950 dark:text-purple-200">
                    {stats.total}
                  </span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                    កិច្ចតែងការសរុប
                  </div>
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center">
                  <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-200">
                    {stats.approved}
                  </span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                    បានអនុម័ត ({stats.approvalRate}%)
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                  <span className="text-2xl font-bold text-amber-900 dark:text-amber-200">
                    {stats.pending}
                  </span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                    រង់ចាំការពិនិត្យ
                  </div>
                </div>

                <div className="bg-sky-50 dark:bg-sky-950/40 p-4 rounded-xl border border-sky-200 dark:border-sky-800 text-center">
                  <span className="text-2xl font-bold text-sky-900 dark:text-sky-200">
                    {allUsers.length}
                  </span>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 font-semibold">
                    គ្រូបង្រៀនចុះឈ្មោះ
                  </div>
                </div>
              </div>

              {/* By Subject Distribution */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>ការបែងចែកកិច្ចតែងការតាមមុខវិជ្ជា (Lesson Plans by Subject)</span>
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.subjectMap).map(([subject, count]) => {
                    const percent = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                    return (
                      <div key={subject} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{subject}</span>
                          <span className="text-slate-500">{count} កិច្ចតែងការ ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feedback / Review Dialog Modal */}
        {feedbackPlanId && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>ផ្តល់មតិកែលម្អលើកិច្ចតែងការជូនគ្រូបង្រៀន</span>
                </span>
                <button onClick={() => setFeedbackPlanId(null)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ចំណុចដែលត្រូវកែលម្អ ឬការណែនាំបន្ថែម៖
                </label>
                <textarea
                  rows={5}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="សូមបញ្ជាក់ចំណុចដែលត្រូវបន្ថែម ឬកែសម្រួល..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFeedbackPlanId(null)}
                  className="px-3 py-1.5 rounded-lg border text-slate-600 font-semibold"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  onClick={handleSubmitFeedback}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-xs"
                >
                  ផ្ញើមតិកែលម្អជូនគ្រូ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            សាលារៀន៖ <strong>{currentUser.schoolName}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </div>
    </div>
  );
}
