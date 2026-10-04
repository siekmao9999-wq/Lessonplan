'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Zap,
  Layers,
  ArrowRight,
  Shield,
  DownloadCloud,
  UploadCloud,
  Server,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection,
  fetchAllPlansFromSupabase,
  uploadPlanToSupabase,
} from '@/src/supabase/client';
import { LessonPlanData } from '@/types/lesson-plan';
import { UserProfile, ManagedLessonPlanRecord } from '@/types/auth';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: LessonPlanData;
  currentUser: UserProfile;
  onSyncPlansToLocal?: (plans: ManagedLessonPlanRecord[]) => void;
}

export function SupabaseConnectModal({
  isOpen,
  onClose,
  currentPlan,
  currentUser,
  onSyncPlansToLocal,
}: SupabaseConnectModalProps) {
  const [activeTab, setActiveTab] = useState<'connect' | 'pagination' | 'vercel'>('connect');

  // Credentials State
  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getSupabaseCredentials().url;
    }
    return '';
  });
  const [supabaseAnonKey, setSupabaseAnonKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return getSupabaseCredentials().anonKey;
    }
    return '';
  });
  const [isFromEnv, setIsFromEnv] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return getSupabaseCredentials().isFromEnv;
    }
    return false;
  });

  // Testing & Status State
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    plansCount?: number;
    profilesCount?: number;
    hasPermanentAdmin?: boolean;
  } | null>(null);

  // Syncing State (> 1000 rows pagination)
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ loaded: number; total?: number } | null>(null);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string | null>(null);

  // Upload Single Plan State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Copy Feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testSupabaseConnection(supabaseUrl, supabaseAnonKey);
    setTestResult(res);
    setIsTesting(false);
  };

  const handleSaveConnection = () => {
    if (!supabaseUrl.trim() || !supabaseAnonKey.trim()) {
      alert('សូមបញ្ចូល Supabase Project URL និង Anon Key ឱ្យបានពេញលេញ!');
      return;
    }
    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    handleTestConnection();
  };

  const handleClearConnection = () => {
    if (confirm('តើអ្នកពិតជាចង់ផ្តាច់ និងលុបការកំណត់ Supabase ចេញពី Browser នេះមែនទេ?')) {
      clearSupabaseCredentials();
      setSupabaseUrl('');
      setSupabaseAnonKey('');
      setTestResult(null);
      setIsFromEnv(false);
    }
  };

  // Automated Pagination (> 1,000 Rows) Sync
  const handleSyncPlans = async () => {
    setIsSyncing(true);
    setSyncProgress({ loaded: 0 });
    setSyncSuccessMsg(null);

    const { records, error } = await fetchAllPlansFromSupabase((loaded, total) => {
      setSyncProgress({ loaded, total });
    });

    setIsSyncing(false);

    if (error) {
      alert(`កំហុសក្នុងការទាញយកទិន្នន័យ៖ ${error.message || 'Unknown error'}`);
    } else {
      setSyncSuccessMsg(`🎉 បានទាញយកកិច្ចតែងការសរុប ${records.length} ដោយជោគជ័យ (គាំទ្រការទាញលើសពី ១០០០ ជួរលើ Free Tier)!`);
      if (onSyncPlansToLocal && records.length > 0) {
        onSyncPlansToLocal(records);
      }
    }
  };

  // Upload current plan to Supabase
  const handleUploadCurrentPlan = async () => {
    setIsUploading(true);
    setUploadSuccessMsg(null);

    const res = await uploadPlanToSupabase(currentPlan, currentUser, 'submitted');
    setIsUploading(false);

    if (res.success) {
      setUploadSuccessMsg(`✓ បានរក្សាទុកកិច្ចតែងការ «${currentPlan.generalInfo.lessonTitle}» ទៅកាន់ Supabase រួចរាល់! (ID: ${res.id})`);
    } else {
      alert(`កំហុសក្នុងការបញ្ចូលទៅ Supabase៖ ${res.error?.message || 'Unknown error'}`);
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const vercelEnvSnippet = `# SUPABASE ENVIRONMENT VARIABLES សម្រាប់ VERCEL
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim() || 'https://your-project.supabase.co'}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey.trim() || 'your-anon-public-key'}
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 text-slate-900 dark:text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-moul text-sm sm:text-base text-white">
                  ភ្ជាប់ជាមួយ Supabase Database & Vercel
                </h3>
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  PostgreSQL Cloud
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                រៀបចំការតភ្ជាប់ទិន្នន័យពពក, ទាញយកលើសពី ១០០០ ជួរលើ Free Tier និងដាក់ពង្រាយទៅ Vercel
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
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 sm:px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('connect')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'connect'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>១. កំណត់ការតភ្ជាប់ (Credentials)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pagination')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'pagination'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>២. លក្ខខណ្ឌទាញលើសពី ១០០០ ជួរ (Free Tier)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vercel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'vercel'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>៣. យក URL ទៅដាក់ក្នុង Vercel</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs flex-1">
          {/* ========================================================
              TAB 1: CREDENTIALS & CONNECTION TEST
             ======================================================== */}
          {activeTab === 'connect' && (
            <div className="space-y-4">
              {/* Notice card */}
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/30 flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">
                    ប្រព័ន្ធទិន្នន័យ Supabase Cloud ជាមួយ Admin អចិន្ត្រៃយ៍ «សៀក ម៉ៅ»
                  </h4>
                  <p className="text-[11px] text-emerald-900 dark:text-emerald-300 leading-relaxed">
                    លោកគ្រូអ្នកគ្រូអាចភ្ជាប់ទៅកាន់គម្រោង Supabase ផ្ទាល់ខ្លួន ដោយគ្រាន់តែចម្លង <strong>Project URL</strong> និង <strong>anon public key</strong> ពី Supabase Project Settings (API) មកដាក់ទីនេះ។ ប្រព័ន្ធនឹងរក្សាទុកដោយស្វ័យប្រវត្តិក្នង Browser ឬដំណើរការតាម Environment Variables លើ Vercel។
                  </p>
                </div>
              </div>

              {isFromEnv && (
                <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-900 dark:text-blue-300 text-[11px] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>
                    ការតភ្ជាប់កំពុងដំណើរការតាមរយៈ <strong>Environment Variables (NEXT_PUBLIC_SUPABASE_URL)</strong> ដោយស្វ័យប្រវត្តិ។
                  </span>
                </div>
              )}

              {/* Input Form */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Supabase Project URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                    placeholder="https://xyzprojectid.supabase.co"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    រកឃើញនៅ Supabase: Project Settings ➔ API ➔ Project URL
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Supabase Anon Public Key (API Key) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={supabaseAnonKey}
                    onChange={(e) => setSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-xs font-mono text-slate-900 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    រកឃើញនៅ Supabase: Project Settings ➔ API ➔ Project API Keys (anon public)
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestConnection}
                      disabled={isTesting || !supabaseUrl || !supabaseAnonKey}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                      <span>{isTesting ? 'កំពុងតេស្តការតភ្ជាប់...' : 'ពិនិត្យការតភ្ជាប់ (Test Connection)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveConnection}
                      disabled={!supabaseUrl || !supabaseAnonKey}
                      className="inline-flex items-center gap-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg font-bold text-xs transition cursor-pointer"
                    >
                      <span>រក្សាទុក (Save)</span>
                    </button>
                  </div>

                  {supabaseUrl && (
                    <button
                      type="button"
                      onClick={handleClearConnection}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 text-xs font-semibold underline"
                    >
                      ផ្តាច់ការតភ្ជាប់ (Disconnect)
                    </button>
                  )}
                </div>
              </div>

              {/* Test Results Output */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl border animate-in fade-in duration-150 ${
                    testResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-950 dark:text-emerald-200'
                      : 'bg-red-50 dark:bg-red-950/40 border-red-400 text-red-950 dark:text-red-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {testResult.success ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <div className="font-bold text-xs">{testResult.message}</div>
                      {testResult.success && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 pt-2 border-t border-emerald-300 dark:border-emerald-800 text-[11px]">
                          <div>
                            <strong>គណនីគ្រូ (Profiles)៖</strong> {testResult.profilesCount ?? 0}
                          </div>
                          <div>
                            <strong>កិច្ចតែងការ (Plans)៖</strong> {testResult.plansCount ?? 0}
                          </div>
                          <div>
                            <strong>Admin អចិន្ត្រៃយ៍ «សៀក ម៉ៅ»៖</strong>{' '}
                            <span className="text-emerald-700 dark:text-emerald-300 font-bold">✓ មានស្រាប់</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Upload current plan */}
              <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                    បញ្ជូនកិច្ចតែងការបច្ចុប្បន្នទៅ Supabase
                  </h5>
                  <p className="text-[11px] text-slate-500">
                    «{currentPlan.generalInfo.lessonTitle}» ({currentPlan.generalInfo.subject})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleUploadCurrentPlan}
                  disabled={isUploading || !supabaseUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <UploadCloud className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce' : ''}`} />
                  <span>{isUploading ? 'កំពុងបញ្ជូន...' : 'បញ្ជូនទៅ Supabase ឥឡូវ'}</span>
                </button>
              </div>

              {uploadSuccessMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 rounded-lg text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: PAGINATION ENGINE (> 1,000 ROWS ON FREE TIER)
             ======================================================== */}
          {activeTab === 'pagination' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/80 bg-teal-50/70 dark:bg-teal-950/30 space-y-2">
                <div className="flex items-center gap-2 text-teal-950 dark:text-teal-200 font-bold text-xs">
                  <Layers className="w-4 h-4 text-teal-600" />
                  <span>យន្តការទាញយកលើសពី ១,០០០ ជួរលើ Supabase Free Tier (Chunked Pagination Engine)</span>
                </div>
                <p className="text-[11px] text-teal-900 dark:text-teal-300 leading-relaxed">
                  គម្រោង Free របស់ Supabase (PostgREST API) មានកំណត់ត្រឹម <strong>១,០០០ ជួរ (max-rows: 1000)</strong> ក្នុងមួយ Query។ ប្រព័ន្ធ KrouPlan ត្រូវបានបំពាក់ដោយក្បួនដោះស្រាយ <strong>Automated Range Loop</strong> ដោយប្រើប្រាស់ <code>.range(offset, offset + 999)</code> ជាកង់ស្វ័យប្រវត្ត រហូតដល់ទាញយកគ្រប់ចំនួនជួរទាំងអស់ (២,០០០ ដល់ ១០,០០០+ កិច្ចតែងការ) ដោយគ្មានការបាត់បង់ទិន្នន័យឡើយ។
                </p>
              </div>

              {/* Architecture Explanation Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h5 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  ⚡ របៀបដែលកូដដំណើរការស្វ័យប្រវត្តិ៖
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-emerald-600 block mb-1">ជំហានទី ១ (Chunk 1)</span>
                    <code>.range(0, 999)</code>
                    <p className="text-slate-500 mt-1">ទាញយកជួរទី ១ ដល់ ១,០០០ ពី Supabase</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-teal-600 block mb-1">ជំហានទី ២ (Chunk 2)</span>
                    <code>.range(1000, 1999)</code>
                    <p className="text-slate-500 mt-1">បន្តទាញយកជួរទី ១,០០១ ដល់ ២,០០០</p>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-indigo-600 block mb-1">ជំហានទី ៣ (បញ្ចប់)</span>
                    <code>fetchAllRowsPaginated()</code>
                    <p className="text-slate-500 mt-1">ច្របាច់បញ្ចូលទិន្នន័យទាំងអស់ជាអារេតែមួយ</p>
                  </div>
                </div>

                {/* Live Sync Action */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs">
                      ទាញយកកិច្ចតែងការទាំងអស់មកកាន់កម្មវិធី (Sync from Supabase)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ទាញទិន្នន័យរាប់ពាន់ជួរមកបង្ហាញក្នុងប្រព័ន្ធភ្លាមៗ
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSyncPlans}
                    disabled={isSyncing || !supabaseUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <DownloadCloud className={`w-3.5 h-3.5 ${isSyncing ? 'animate-bounce' : ''}`} />
                    <span>{isSyncing ? 'កំពុងទាញយក...' : 'ទាញយកទិន្នន័យឥឡូវ (> 1000 Rows Sync)'}</span>
                  </button>
                </div>

                {/* Progress Indicator */}
                {isSyncing && syncProgress && (
                  <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-300 dark:border-slate-700 space-y-2 animate-in fade-in">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <span>កំពុងទាញយកកិច្ចតែងការ...</span>
                      <span>{syncProgress.loaded} {syncProgress.total ? `/ ${syncProgress.total}` : ''} ជួរ</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{
                          width: syncProgress.total
                            ? `${Math.min(100, Math.round((syncProgress.loaded / syncProgress.total) * 100))}%`
                            : '80%',
                        }}
                      />
                    </div>
                  </div>
                )}

                {syncSuccessMsg && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 rounded-lg text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{syncSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: VERCEL DEPLOYMENT & ENVIRONMENT SETUP
             ======================================================== */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-sky-200 dark:border-sky-800/80 bg-sky-50/70 dark:bg-sky-950/30 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-950 dark:text-sky-200 font-bold text-xs">
                  <Server className="w-4 h-4 text-sky-600" />
                  <span>របៀបយក URL របស់ Supabase ទៅដាក់ក្នុង Vercel (Step-by-Step Guide)</span>
                </div>
                <p className="text-[11px] text-sky-900 dark:text-sky-300 leading-relaxed">
                  ដើម្បីឱ្យគេហទំព័រដែលដាក់ពង្រាយលើ <strong>Vercel</strong> អាចទាក់ទងទិន្នន័យ Supabase បានជាអចិន្ត្រៃយ៍ លោកគ្រូអ្នកគ្រូគ្រាន់តែចម្លង Environment Variables ទាំងពីរនេះទៅដាក់ក្នុងផ្ទាំង Vercel Project Settings។
                </p>
              </div>

              {/* Step by step guide */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white text-xs">
                      ចូលទៅកាន់ Vercel Dashboard
                    </strong>
                    <p className="text-slate-500 text-[11px]">
                      បើកគេហទំព័រ <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline font-semibold">vercel.com</a> រួចចុចចូលគម្រោង KrouPlan របស់អ្នក។
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white text-xs">
                      បើក Settings ➔ Environment Variables
                    </strong>
                    <p className="text-slate-500 text-[11px]">
                      នៅរបារខាងលើនៃគម្រោង ចុចលើផ្ទាំង <strong>Settings</strong> រួចជ្រើសរើសម៉ឺនុយ <strong>Environment Variables</strong> នៅខាងឆ្វេង។
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 dark:text-white text-xs">
                        បញ្ចូលអថេរខាងក្រោម (ចម្លងតាមប៊ូតុង Copy)៖
                      </strong>
                      <button
                        type="button"
                        onClick={() => handleCopyText(vercelEnvSnippet, 'all')}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold transition cursor-pointer"
                      >
                        {copiedKey === 'all' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'all' ? 'បានចម្លង ✓' : 'ចម្លងទាំងអស់ (Copy All)'}</span>
                      </button>
                    </div>

                    <div className="relative bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] overflow-x-auto">
                      <pre>{vercelEnvSnippet}</pre>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div className="space-y-1">
                    <strong className="text-slate-900 dark:text-white text-xs">
                      ចុច Save រួច Redeploy
                    </strong>
                    <p className="text-slate-500 text-[11px]">
                      ចុចប៊ូតុង <strong>Save</strong> ក្នុង Vercel បន្ទាប់មកចុច <strong>Redeploy</strong> ដើម្បីឱ្យ Vercel ចាប់យក Key និងភ្ជាប់ទៅ Supabase យ៉ាងរលូន។
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>អ្នកគ្រប់គ្រងអចិន្ត្រៃយ៍៖ <strong>សៀក ម៉ៅ</strong></span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            បិទផ្ទាំង (Close)
          </button>
        </div>
      </div>
    </div>
  );
}
