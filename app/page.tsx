'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  FileText,
  Download,
  Printer,
  BookOpen,
  Edit3,
  Layers,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Zap,
  FolderOpen,
  School,
  Info,
  ChevronDown,
  ChevronRight,
  X,
  ExternalLink,
  GraduationCap,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import {
  PRIMARY_GRADES,
  LOWER_SECONDARY_GRADES,
  UPPER_SECONDARY_GRADES,
  getSubjectsForGrade,
} from '@/lib/curriculum';
import { Navbar } from '@/components/Navbar';
import { GeneralInfoForm } from '@/components/GeneralInfoForm';
import { LessonSheetView } from '@/components/LessonSheetView';
import { PromptModal } from '@/components/PromptModal';
import { WorksheetModal } from '@/components/WorksheetModal';
import { PresetModal } from '@/components/PresetModal';
import { PrintPdfModal } from '@/components/PrintPdfModal';
import { UserRoleSwitcherModal } from '@/components/UserRoleSwitcherModal';
import { AdminDashboardModal } from '@/components/AdminDashboardModal';
import { SupabaseConnectModal } from '@/components/SupabaseConnectModal';
import { isSupabaseConnected } from '@/src/supabase/client';
import { SKUN_NGS_PHYSICS_PRESET, COMPREHENSIVE_PRESETS } from '@/lib/presets';
import { LessonPlanData, TeacherInfo, LessonGeneralInfo } from '@/types/lesson-plan';
import { UserProfile, ManagedLessonPlanRecord, PlanStatus } from '@/types/auth';
import {
  getAllUsers,
  saveAllUsers,
  getCurrentUser,
  setCurrentUserId,
  getAllManagedPlans,
  submitPlanForReview,
  reviewPlanStatus,
} from '@/lib/auth-storage';
import { generateStandaloneLessonPlanHTML, downloadFile } from '@/lib/export-html';

export default function HomePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem('krouplan_theme') as 'light' | 'dark' | null;
        if (savedTheme) return savedTheme;
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          return 'dark';
        }
      } catch {
        // ignore
      }
    }
    return 'light';
  });

  // Sync dark class on documentElement whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem('krouplan_theme', nextTheme);
    } catch {
      // ignore
    }
  };

  const [plan, setPlan] = useState<LessonPlanData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('krouplan_current_plan');
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return SKUN_NGS_PHYSICS_PRESET;
  });

  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'sheet' | 'form'>('sheet');
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [showWorksheetModal, setShowWorksheetModal] = useState<boolean>(false);
  const [worksheetModalTab, setWorksheetModalTab] = useState<'worksheet' | 'materials'>('worksheet');
  const [showPresetModal, setShowPresetModal] = useState<boolean>(false);
  const [presetModalCategory, setPresetModalCategory] = useState<string>('all');
  const [activeLevelDropdown, setActiveLevelDropdown] = useState<
    'primary' | 'lower_secondary' | 'upper_secondary' | 'skun_ngs' | null
  >(null);
  const [dropdownGradeFilter, setDropdownGradeFilter] = useState<string>('all');
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error' | 'info';
    text: string;
  } | null>(null);

  // Admin and User Authentication / Role Management State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => getCurrentUser());
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => getAllUsers());
  const [managedPlans, setManagedPlans] = useState<ManagedLessonPlanRecord[]>(() => getAllManagedPlans());
  const [showRoleSwitcherModal, setShowRoleSwitcherModal] = useState<boolean>(false);
  const [showAdminDashboardModal, setShowAdminDashboardModal] = useState<boolean>(false);
  const [showSupabaseModal, setShowSupabaseModal] = useState<boolean>(false);

  // Current Lesson Plan Review Record
  const currentPlanRecord = useMemo(() => {
    return (
      managedPlans.find(
        (p) =>
          p.subject === plan.generalInfo.subject &&
          p.grade === plan.generalInfo.grade &&
          p.lessonTitle === plan.generalInfo.lessonTitle
      ) || null
    );
  }, [managedPlans, plan]);

  // Count pending reviews for Admin
  const pendingReviewCount = useMemo(() => {
    return managedPlans.filter((p) => p.status === 'submitted').length;
  }, [managedPlans]);

  // Save to localStorage
  const updatePlan = (newPlan: LessonPlanData) => {
    setPlan(newPlan);
    try {
      localStorage.setItem('krouplan_current_plan', JSON.stringify(newPlan));
    } catch {
      // ignore
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Auth & Role Handlers
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentUserId(user.id);
    if (user.role === 'user') {
      updatePlan({
        ...plan,
        teacherInfo: {
          ...plan.teacherInfo,
          teacherName: user.name,
          schoolName: user.schoolName || plan.teacherInfo.schoolName,
          phoneNumber: user.phoneNumber || plan.teacherInfo.phoneNumber,
        },
      });
    }
    showToast('info', `បានប្តូរទៅកាន់គណនី៖ ${user.name} (${user.role === 'admin' ? 'Admin នាយក' : 'User គ្រូ'})`);
  };

  const handleAddNewUser = (newUserData: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const newUser: UserProfile = {
      ...newUserData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updated = [...allUsers, newUser];
    setAllUsers(updated);
    saveAllUsers(updated);
    handleSelectUser(newUser);
    showToast('success', `បានបង្កើត និងប្តូរទៅកាន់គណនី ${newUser.name} រួចរាល់!`);
  };

  const handleUpdateUsers = (updated: UserProfile[]) => {
    setAllUsers(updated);
    saveAllUsers(updated);
    const found = updated.find((u) => u.id === currentUser.id);
    if (found) setCurrentUser(found);
  };

  const handleSubmitPlanForReview = () => {
    submitPlanForReview(currentUser, plan);
    setManagedPlans(getAllManagedPlans());
    showToast('success', '🎉 បានដាក់ស្នើកិច្ចតែងការទៅកាន់នាយកសាលាដើម្បីត្រួតពិនិត្យ និងអនុម័ត!');
  };

  const handleReviewPlan = (planId: string, status: PlanStatus, feedback?: string) => {
    const reviewerName = currentUser.isPermanentAdmin
      ? `${currentUser.name} (Admin អចិន្ត្រៃយ៍)`
      : currentUser.name;
    reviewPlanStatus(planId, reviewerName, status, feedback);
    setManagedPlans(getAllManagedPlans());
    showToast('success', `✓ បានរក្សាទុកការត្រួតពិនិត្យ (${status === 'approved' ? 'បានអនុម័ត' : 'ស្នើសុំកែសម្រួល'}) រួចរាល់!`);
  };

  const handleUpdateTeacherInfo = (info: Partial<TeacherInfo>) => {
    updatePlan({
      ...plan,
      teacherInfo: { ...plan.teacherInfo, ...info },
    });
  };

  const handleUpdateGeneralInfo = (info: Partial<LessonGeneralInfo>) => {
    updatePlan({
      ...plan,
      generalInfo: { ...plan.generalInfo, ...info },
    });
  };

  // Generate full plan using Gemini API with multi-model failover
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    showToast('info', 'កំពុងបញ្ជូនទិន្នន័យទៅកាន់ AI ដើម្បីរៀបចំកិច្ចតែងការ...');
    try {
      const response = await fetch('/api/generate-lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherInfo: plan.teacherInfo,
          generalInfo: plan.generalInfo,
          customPrompt,
        }),
      });

      const data = await response.json();
      if (data.success && data.lessonPlan) {
        updatePlan(data.lessonPlan);
        setActiveTab('sheet');
        if (data.isFallback) {
          showToast(
            'info',
            'កិច្ចតែងការបង្រៀនត្រូវបានរៀបចំរួចរាល់តាមស្តង់ដារក្រសួងអប់រំ (ម៉ាស៊ីន AI កំពុងផ្ទុកច្រើន 503)'
          );
        } else {
          showToast('success', 'កិច្ចតែងការបង្រៀនត្រូវបានបង្កើតដោយ AI ជោគជ័យ!');
        }
      } else {
        showToast(
          'error',
          data.error || 'ម៉ាស៊ីន AI កំពុងមានអ្នកប្រើប្រាស់ច្រើនបណ្តោះអាសន្ន។ សូមសាកល្បងចុចម្តងទៀត។'
        );
      }
    } catch (err: any) {
      console.warn('AI generate notice:', err?.message || err);
      showToast(
        'error',
        'ម៉ាស៊ីន AI កំពុងមានអ្នកប្រើប្រាស់ច្រើនបណ្តោះអាសន្ន (503)។ សូមសាកល្បងម្តងទៀត ឬជ្រើសរើសគំរូ។'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Enhance section with AI
  const handleEnhanceSection = async (
    sectionName: string,
    currentContent: string
  ): Promise<string | null> => {
    try {
      const response = await fetch('/api/enhance-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName,
          currentContent,
          lessonContext: plan.generalInfo,
        }),
      });
      const data = await response.json();
      if (data.success && data.enhancedText) {
        showToast('success', `ផ្នែក "${sectionName}" ត្រូវបានកែលម្អដោយជោគជ័យ!`);
        return data.enhancedText;
      }
      return null;
    } catch (err: any) {
      console.warn('Enhance section notice:', err?.message || err);
      showToast('error', 'ម៉ាស៊ីន AI កំពុងមានអ្នកប្រើប្រាស់ច្រើនបណ្តោះអាសន្ន។');
      return null;
    }
  };

  // Instant HTML download
  const handleDownloadHtml = () => {
    const html = generateStandaloneLessonPlanHTML(plan);
    const filename = `កិច្ចតែងការ_${plan.generalInfo.subject}_${plan.generalInfo.grade}_${plan.generalInfo.subTopic.slice(0, 20)}.html`;
    downloadFile(html, filename, 'text/html');
    showToast('success', 'បានទាញយកឯកសារជា HTML ដោយជោគជ័យ! លោកគ្រូអ្នកគ្រូអាចបើកមើលបានភ្លាមៗ។');
  };

  const handlePrint = () => {
    if (activeTab !== 'sheet') {
      setActiveTab('sheet');
    }
    setShowPrintModal(true);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} flex flex-col font-khmer transition-colors duration-200`}>
      {/* Navbar */}
      <Navbar
        currentPlan={plan}
        onSelectPreset={(newPreset) => {
          updatePlan(newPreset);
          showToast('success', `បានផ្ទុកគំរូ៖ ${newPreset.generalInfo.subject} ${newPreset.generalInfo.grade} (${newPreset.teacherInfo.schoolName})`);
        }}
        onOpenPresetModal={() => setShowPresetModal(true)}
        onDownloadHtml={handleDownloadHtml}
        onPrint={handlePrint}
        onOpenPromptGuide={() => setShowPromptModal(true)}
        isGenerating={isGenerating}
        onGenerateClick={handleGenerateAI}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        currentUser={currentUser}
        pendingReviewCount={pendingReviewCount}
        currentPlanStatus={currentPlanRecord?.status || 'draft'}
        onOpenRoleSwitcher={() => setShowRoleSwitcherModal(true)}
        onOpenAdminDashboard={() => setShowAdminDashboardModal(true)}
        onSubmitPlanForReview={handleSubmitPlanForReview}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
        isSupabaseConnected={isSupabaseConnected()}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce no-print">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white ${
              toastMessage.type === 'success'
                ? 'bg-emerald-600'
                : toastMessage.type === 'info'
                ? 'bg-sky-600'
                : 'bg-red-600'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : toastMessage.type === 'info' ? (
              <Info className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Quick Level / School Presets Bar */}
      <div className="bg-slate-800 dark:bg-slate-900 text-white py-2 px-4 text-xs border-b border-slate-700 dark:border-slate-800 no-print transition-colors duration-200 relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-amber-300 font-bold flex items-center gap-1.5 shrink-0">
              <School className="w-3.5 h-3.5" />
              <span>សាលា & កម្រិតថ្នាក់គំរូ៖</span>
            </span>

            {/* 1. Skun NGS Button */}
            <button
              type="button"
              onClick={() => {
                if (activeLevelDropdown === 'skun_ngs') {
                  setActiveLevelDropdown(null);
                } else {
                  setActiveLevelDropdown('skun_ngs');
                  setDropdownGradeFilter('all');
                }
              }}
              className={`bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-1 rounded-md transition text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer ${
                activeLevelDropdown === 'skun_ngs' ? 'ring-2 ring-white shadow-md' : ''
              }`}
            >
              <span>⭐ វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  activeLevelDropdown === 'skun_ngs' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* 2. Primary School Button (បឋមសិក្សា ទី១-៦) */}
            <button
              type="button"
              onClick={() => {
                if (activeLevelDropdown === 'primary') {
                  setActiveLevelDropdown(null);
                } else {
                  setActiveLevelDropdown('primary');
                  setDropdownGradeFilter('all');
                }
              }}
              className={`bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-2.5 py-1 rounded-md transition text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer ${
                activeLevelDropdown === 'primary' ? 'ring-2 ring-white bg-emerald-600 shadow-md' : ''
              }`}
            >
              <span>🎒 បឋមសិក្សា (ថ្នាក់ទី១-៦)</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  activeLevelDropdown === 'primary' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* 3. Lower Secondary Button (អនុវិទ្យាល័យ ទី៧-៩) */}
            <button
              type="button"
              onClick={() => {
                if (activeLevelDropdown === 'lower_secondary') {
                  setActiveLevelDropdown(null);
                } else {
                  setActiveLevelDropdown('lower_secondary');
                  setDropdownGradeFilter('all');
                }
              }}
              className={`bg-blue-700 hover:bg-blue-600 text-white font-semibold px-2.5 py-1 rounded-md transition text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer ${
                activeLevelDropdown === 'lower_secondary' ? 'ring-2 ring-white bg-blue-600 shadow-md' : ''
              }`}
            >
              <span>📗 អនុវិទ្យាល័យ (ថ្នាក់ទី៧-៩)</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  activeLevelDropdown === 'lower_secondary' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* 4. Upper Secondary Button (វិទ្យាល័យ ទី១០-១២) */}
            <button
              type="button"
              onClick={() => {
                if (activeLevelDropdown === 'upper_secondary') {
                  setActiveLevelDropdown(null);
                } else {
                  setActiveLevelDropdown('upper_secondary');
                  setDropdownGradeFilter('all');
                }
              }}
              className={`bg-purple-700 hover:bg-purple-600 text-white font-semibold px-2.5 py-1 rounded-md transition text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer ${
                activeLevelDropdown === 'upper_secondary' ? 'ring-2 ring-white bg-purple-600 shadow-md' : ''
              }`}
            >
              <span>🎓 វិទ្យាល័យ (ថ្នាក់ទី១០-១២)</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  activeLevelDropdown === 'upper_secondary' ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => {
              setActiveLevelDropdown(null);
              setPresetModalCategory('all');
              setShowPresetModal(true);
            }}
            className="text-sky-300 hover:text-white font-semibold underline underline-offset-2 shrink-0 text-[11px] cursor-pointer flex items-center gap-1"
          >
            <span>មើលគំរូទាំងអស់ ({COMPREHENSIVE_PRESETS.length})</span>
            <span>&rarr;</span>
          </button>
        </div>

        {/* Floating Dropdown Menu for Active Education Level */}
        {activeLevelDropdown && (
          <>
            {/* Backdrop for closing */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setActiveLevelDropdown(null)}
            />

            {/* Dropdown Container */}
            <div className="max-w-7xl mx-auto relative z-40">
              <div className="absolute top-2 left-0 right-0 sm:right-auto sm:left-4 sm:w-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-sky-500/40 p-3 sm:p-4 text-slate-800 dark:text-slate-100 transition-all animate-in fade-in slide-in-from-top-2 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {activeLevelDropdown === 'primary' && '🎒'}
                      {activeLevelDropdown === 'lower_secondary' && '📗'}
                      {activeLevelDropdown === 'upper_secondary' && '🎓'}
                      {activeLevelDropdown === 'skun_ngs' && '⭐'}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
                        {activeLevelDropdown === 'primary' && 'កម្រិតបឋមសិក្សា (ថ្នាក់ទី១ ដល់ ទី៦)'}
                        {activeLevelDropdown === 'lower_secondary' && 'កម្រិតអនុវិទ្យាល័យ (ថ្នាក់ទី៧ ដល់ ទី៩)'}
                        {activeLevelDropdown === 'upper_secondary' && 'កម្រិតវិទ្យាល័យ (ថ្នាក់ទី១០ ដល់ ទី១២)'}
                        {activeLevelDropdown === 'skun_ngs' && 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី NGS)'}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        ចុចលើគំរូណាមួយដើម្បីផ្ទុកភ្លាមៗ ឬជ្រើសរើសថ្នាក់ជាក់លាក់
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveLevelDropdown(null)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Grade Quick Filter Chips */}
                <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDropdownGradeFilter('all')}
                    className={`px-2 py-0.8 rounded-md font-semibold transition cursor-pointer shrink-0 ${
                      dropdownGradeFilter === 'all'
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    ទាំងអស់
                  </button>

                  {(activeLevelDropdown === 'primary'
                    ? PRIMARY_GRADES
                    : activeLevelDropdown === 'lower_secondary'
                    ? LOWER_SECONDARY_GRADES
                    : activeLevelDropdown === 'upper_secondary'
                    ? UPPER_SECONDARY_GRADES
                    : ['ថ្នាក់ទី១០', 'ថ្នាក់ទី១១', 'ថ្នាក់ទី១២']
                  ).map((g) => {
                    const isSelected = dropdownGradeFilter === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setDropdownGradeFilter(g)}
                        className={`px-2 py-0.8 rounded-md font-semibold transition cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>

                {/* Quick Action: Apply Grade to current form */}
                {dropdownGradeFilter !== 'all' && (
                  <div className="mb-2 p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/50 flex items-center justify-between text-[11px]">
                    <span className="text-sky-900 dark:text-sky-200 font-medium">
                      កំពុងចម្រាញ់៖ <strong>{dropdownGradeFilter}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const subjects = getSubjectsForGrade(dropdownGradeFilter);
                        updatePlan({
                          ...plan,
                          generalInfo: {
                            ...plan.generalInfo,
                            grade: dropdownGradeFilter,
                            subject: subjects[0] || plan.generalInfo.subject,
                          },
                        });
                        setActiveTab('form');
                        setActiveLevelDropdown(null);
                        showToast('success', `បានកំណត់ ${dropdownGradeFilter} ក្នុងទម្រង់កែទិន្នន័យ!`);
                      }}
                      className="bg-sky-600 hover:bg-sky-500 text-white font-bold px-2 py-0.5 rounded text-[10px] transition cursor-pointer"
                    >
                      ⚡ ប្តូរកិច្ចតែងការទៅ {dropdownGradeFilter}
                    </button>
                  </div>
                )}

                {/* Presets List */}
                <div className="max-h-56 overflow-y-auto space-y-1.5 p-0.5 pr-1">
                  {COMPREHENSIVE_PRESETS.filter((p) => {
                    const matchCategory =
                      activeLevelDropdown === 'skun_ngs'
                        ? p.category === 'skun_ngs'
                        : activeLevelDropdown === 'primary'
                        ? p.category === 'primary'
                        : activeLevelDropdown === 'lower_secondary'
                        ? p.category === 'lower_secondary'
                        : p.category === 'upper_secondary' || p.category === 'skun_ngs';
                    const matchGrade =
                      dropdownGradeFilter === 'all' || p.grade === dropdownGradeFilter;
                    return matchCategory && matchGrade;
                  }).map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => {
                        updatePlan(preset.data);
                        showToast('success', `បានផ្ទុកគំរូ៖ ${preset.name}`);
                        setActiveLevelDropdown(null);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 bg-white dark:bg-slate-800/80 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 cursor-pointer transition shadow-2xs group flex items-start justify-between gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              preset.category === 'primary'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : preset.category === 'lower_secondary'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                : preset.category === 'upper_secondary'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}
                          >
                            {preset.grade}
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                            {preset.subject}
                          </span>
                        </div>
                        <h5 className="text-[11px] font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 line-clamp-1">
                          {preset.name.replace(/^.* - /, '')}
                        </h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                          {preset.description}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 shrink-0 mt-2 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))}
                </div>

                {/* Footer Actions */}
                <div className="pt-2.5 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 text-[10px]">
                    ចុចលើគំរូដើម្បីបើក ឬ
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const targetCat =
                        activeLevelDropdown === 'skun_ngs'
                          ? 'skun_ngs'
                          : activeLevelDropdown === 'primary'
                          ? 'primary'
                          : activeLevelDropdown === 'lower_secondary'
                          ? 'lower_secondary'
                          : 'upper_secondary';
                      setActiveLevelDropdown(null);
                      setPresetModalCategory(targetCat);
                      setShowPresetModal(true);
                    }}
                    className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>🔍 បើកផ្ទាំងធំ (Preset Modal)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 no-print">
          {/* Tab Switcher */}
          <div className="inline-flex p-1 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 transition-colors duration-200">
            <button
              onClick={() => setActiveTab('sheet')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'sheet'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>ទិដ្ឋភាពកិច្ចតែងការ (A4 Sheet Preview)</span>
            </button>

            <button
              onClick={() => setActiveTab('form')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'form'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>កែទិន្នន័យ & វិធីសាស្ត្របង្រៀន (Setup Form)</span>
            </button>
          </div>

          {/* Quick Helper Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setWorksheetModalTab('worksheet');
                setShowWorksheetModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>បង្កើតសន្លឹកកិច្ចការសិស្ស</span>
            </button>

            <button
              onClick={() => {
                setWorksheetModalTab('materials');
                setShowWorksheetModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>បង្កើតសម្ភារៈឩទេស</span>
            </button>

            <button
              onClick={() => setShowPromptModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>មើល Prompt គំរូ</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Interactive A4 Sheet View */}
        {activeTab === 'sheet' && (
          <div className="space-y-6">
            <LessonSheetView
              plan={plan}
              onUpdatePlan={updatePlan}
              onEnhanceSection={handleEnhanceSection}
              onOpenPrintModal={() => setShowPrintModal(true)}
              onOpenWorksheetModal={(tab) => {
                setWorksheetModalTab(tab || 'worksheet');
                setShowWorksheetModal(true);
              }}
              currentUser={currentUser}
              planRecord={currentPlanRecord}
              onSubmitForReview={handleSubmitPlanForReview}
              onApprovePlan={(feedback) => {
                if (currentPlanRecord) {
                  handleReviewPlan(currentPlanRecord.id, 'approved', feedback);
                } else {
                  const rec = submitPlanForReview(currentUser, plan);
                  handleReviewPlan(rec.id, 'approved', feedback);
                }
              }}
            />
          </div>
        )}

        {/* Tab 2: General Info & Methodology Form */}
        {activeTab === 'form' && (
          <div className="space-y-6">
            <GeneralInfoForm
              plan={plan}
              onChangeTeacherInfo={handleUpdateTeacherInfo}
              onChangeGeneralInfo={handleUpdateGeneralInfo}
              customPrompt={customPrompt}
              setCustomPrompt={setCustomPrompt}
              onGenerate={handleGenerateAI}
              isGenerating={isGenerating}
              onLoadPreset={(preset) => {
                updatePlan(preset);
                showToast('success', `បានផ្ទុក៖ ${preset.generalInfo.subject} ${preset.generalInfo.grade}`);
              }}
              onOpenPresetModal={() => setShowPresetModal(true)}
            />
          </div>
        )}
      </main>

      {/* Footer (Hidden in print) */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 no-print transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-moul text-slate-800 dark:text-slate-200">គ្រូប្លែន (KrouPlan)</span>
            <span>— គាំទ្រគ្រូបង្រៀនកម្ពុជាគ្រប់កម្រិតសិក្សា (បឋមសិក្សា អនុវិទ្យាល័យ និងវិទ្យាល័យ)</span>
          </div>
          <div>ស្តង់ដារ ៥ ជំហាន ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS)</div>
        </div>
      </footer>

      {/* Modals */}
      <PrintPdfModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        plan={plan}
      />

      <PresetModal
        isOpen={showPresetModal}
        initialCategory={presetModalCategory}
        onClose={() => setShowPresetModal(false)}
        onSelectPreset={(newPreset) => {
          updatePlan(newPreset);
          showToast('success', `បានផ្ទុកគំរូ៖ ${newPreset.generalInfo.subject} ${newPreset.generalInfo.grade}`);
        }}
        currentPlanId={plan.id}
      />

      <PromptModal
        isOpen={showPromptModal}
        onClose={() => setShowPromptModal(false)}
        plan={plan}
      />

      <WorksheetModal
        isOpen={showWorksheetModal}
        onClose={() => setShowWorksheetModal(false)}
        plan={plan}
        onUpdatePlan={updatePlan}
        initialTab={worksheetModalTab}
      />

      {/* User Role Switcher Modal */}
      <UserRoleSwitcherModal
        isOpen={showRoleSwitcherModal}
        onClose={() => setShowRoleSwitcherModal(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        onAddNewUser={handleAddNewUser}
      />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal
        isOpen={showAdminDashboardModal}
        onClose={() => setShowAdminDashboardModal(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        managedPlans={managedPlans}
        onReviewPlan={handleReviewPlan}
        onSelectPlanToView={(viewPlan) => {
          updatePlan(viewPlan);
          showToast('info', `បានបើកកិច្ចតែងការ៖ ${viewPlan.generalInfo.lessonTitle}`);
        }}
        onUpdateUsers={handleUpdateUsers}
        onOpenSupabaseModal={() => setShowSupabaseModal(true)}
      />

      {/* Supabase Connection & Vercel Modal */}
      <SupabaseConnectModal
        isOpen={showSupabaseModal}
        onClose={() => setShowSupabaseModal(false)}
        currentPlan={plan}
        currentUser={currentUser}
        onSyncPlansToLocal={(syncedPlans) => {
          setManagedPlans(syncedPlans);
          showToast('success', `🎉 បាន Sync កិច្ចតែងការសរុប ${syncedPlans.length} ពី Supabase ជោគជ័យ!`);
        }}
      />
    </div>
  );
}
