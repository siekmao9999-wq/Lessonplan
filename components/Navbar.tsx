'use client';

import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  FolderOpen,
  School,
  Sun,
  Moon,
} from 'lucide-react';
import { COMPREHENSIVE_PRESETS, SKUN_NGS_PHYSICS_PRESET } from '@/lib/presets';
import { LessonPlanData } from '@/types/lesson-plan';

interface NavbarProps {
  currentPlan: LessonPlanData;
  onSelectPreset: (plan: LessonPlanData) => void;
  onOpenPresetModal: () => void;
  onDownloadHtml: () => void;
  onPrint: () => void;
  onOpenPromptGuide: () => void;
  isGenerating: boolean;
  onGenerateClick: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export function Navbar({
  currentPlan,
  onSelectPreset,
  onOpenPresetModal,
  onDownloadHtml,
  onPrint,
  onOpenPromptGuide,
  isGenerating,
  onGenerateClick,
  theme = 'light',
  onToggleTheme,
}: NavbarProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyPrompt = () => {
    const promptText = `សូមដើរតួជាគ្រូបង្រៀនកម្រិតវិទ្យាល័យ/អនុវិទ្យាល័យ/បឋមសិក្សាដ៏មានបទពិសោធន៍នៅកម្ពុជា។ សូមជួយរៀបចំកិច្ចតែងការបង្រៀនចំនួន ១ម៉ោងសិក្សា (${currentPlan.generalInfo.duration}) យ៉ាងលម្អិត ដោយផ្អែកលើព័ត៌មានខាងក្រោម៖
១. ព័ត៌មានទូទៅ៖
* មុខវិជ្ជា៖ ${currentPlan.generalInfo.subject}
* ថ្នាក់ទី៖ ${currentPlan.generalInfo.grade}
* ${currentPlan.generalInfo.chapter}
* ${currentPlan.generalInfo.lessonTitle}
* ប្រធានបទរង/ចំណងជើងរង៖ ${currentPlan.generalInfo.subTopic}
* រយៈពេលបង្រៀន៖ ${currentPlan.generalInfo.duration}
* សាលារៀន៖ ${currentPlan.teacherInfo.schoolName}

២. វិធីសាស្ត្រ និងយុទ្ធវិធីបង្រៀនដែលត្រូវប្រើ៖
* វិធីសាស្ត្របង្រៀន៖ ${currentPlan.generalInfo.methodology}
* យុទ្ធវិធីបង្រៀន៖ ${currentPlan.generalInfo.strategy}

៣. រចនាសម្ព័ន្ធកិច្ចតែងការដែលទាមទារ (សរសេរជាទម្រង់ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា)៖
* វត្ថុបំណងមេរៀន (ចំណេះដឹង បំណិន ចរិយាសម្បទា)
* សម្ភារឧបទេស
* ដំណើរការបង្រៀននិងរៀន (មាន៥ជំហាន ជាមួយនឹងការបែងចែកពេលវេលា ជំហានទី៣បញ្ជាក់សកម្មភាពគ្រូនិងសិស្សយ៉ាងច្បាស់)
* ការវាយតម្លៃ

សូមសរសេរកិច្ចតែងការនេះជាភាសាខ្មែរឱ្យបានក្បោះក្បាយ និងត្រឹមត្រូវតាមបច្ចេកទេសគរុកោសល្យ។`;

    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm no-print transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-sky-600 via-sky-700 to-indigo-700 flex items-center justify-center text-white shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-moul text-slate-900 dark:text-white text-sm tracking-wide">
                  គ្រូប្លែន (KrouPlan)
                </span>
                <span className="bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  MoEYS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                កិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន (ថ្នាក់ទី១-១២)
              </p>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={onOpenPresetModal}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-300 dark:border-amber-800 rounded-md transition"
              title="បើកបញ្ជីគំរូទាំងអស់ (ថ្នាក់ទី១ ដល់ ទី១២)"
            >
              <FolderOpen className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>គំរូទាំងអស់ ({COMPREHENSIVE_PRESETS.length})</span>
            </button>

            <select
              aria-label="ជ្រើសរើសគំរូមេរៀនរហ័ស"
              className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 max-w-[280px] truncate"
              onChange={(e) => {
                const selected = COMPREHENSIVE_PRESETS.find((p) => p.id === e.target.value);
                if (selected) onSelectPreset(selected.data);
              }}
              value={currentPlan.id || ''}
            >
              <optgroup label="⭐ វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)">
                {COMPREHENSIVE_PRESETS.filter((p) => p.category === 'skun_ngs').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🎒 បឋមសិក្សា (ថ្នាក់ទី១ ដល់ ទី៦)">
                {COMPREHENSIVE_PRESETS.filter((p) => p.category === 'primary').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="📚 អនុវិទ្យាល័យ (ថ្នាក់ទី៧ ដល់ ទី៩)">
                {COMPREHENSIVE_PRESETS.filter((p) => p.category === 'lower_secondary').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🎓 វិទ្យាល័យ (ថ្នាក់ទី១០ ដល់ ទី១២)">
                {COMPREHENSIVE_PRESETS.filter((p) => p.category === 'upper_secondary').map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Theme Toggle Button */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'ប្តូរទៅពន្លឺ (Light Mode)' : 'ប្តូរទៅងងឹត (Dark Mode)'}
                aria-label="Theme toggle"
                className="p-2 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 transition-transform hover:-rotate-12" />
                )}
              </button>
            )}

            <button
              onClick={onOpenPresetModal}
              className="lg:hidden p-2 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 rounded-md"
              title="ជ្រើសរើសគំរូ"
            >
              <FolderOpen className="w-4 h-4" />
            </button>

            <button
              onClick={handleCopyPrompt}
              title="ចម្លង Prompt គំរូសម្រាប់ Gemini/ChatGPT"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'បានចម្លង!' : 'ចម្លង Prompt'}</span>
            </button>

            <button
              onClick={onOpenPromptGuide}
              title="មើលការណែនាំពី Prompt"
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              onClick={onPrint}
              title="បោះពុម្ព ឬរក្សាទុកជា PDF (A4 MoEYS)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-md transition shadow-xs cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>បោះពុម្ព / PDF</span>
            </button>

            <button
              onClick={onDownloadHtml}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 rounded-md transition"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>HTML</span>
            </button>

            <button
              onClick={onGenerateClick}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-md shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'កំពុងបង្កើត...' : 'បង្កើតដោយ AI'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
