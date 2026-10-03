'use client';

import React from 'react';
import {
  Sparkles,
  School,
  User,
  Book,
  Clock,
  Lightbulb,
  Layers,
  FileCheck,
  RotateCcw,
  Zap,
  FolderOpen,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { LessonPlanData, TeacherInfo, LessonGeneralInfo } from '@/types/lesson-plan';
import { SKUN_NGS_PHYSICS_PRESET } from '@/lib/presets';
import {
  ALL_GRADES,
  PRIMARY_GRADES,
  LOWER_SECONDARY_GRADES,
  UPPER_SECONDARY_GRADES,
  getSubjectsForGrade,
  getLessonsForGradeAndSubject,
  MOEYS_SCHOOL_PRESETS,
} from '@/lib/curriculum';

interface GeneralInfoFormProps {
  plan: LessonPlanData;
  onChangeTeacherInfo: (info: Partial<TeacherInfo>) => void;
  onChangeGeneralInfo: (info: Partial<LessonGeneralInfo>) => void;
  customPrompt: string;
  setCustomPrompt: (val: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onLoadPreset: (data: LessonPlanData) => void;
  onOpenPresetModal: () => void;
}

const COMMON_DURATIONS = [
  '៤០ នាទី (បឋមសិក្សា)',
  '៤៥ នាទី (១ ម៉ោងសិក្សា)',
  '៥០ នាទី',
  '៩០ នាទី (២ ម៉ោងសិក្សាជាប់គ្នា)',
  '១០០ នាទី',
];

const COMMON_METHODS = [
  'វិធីសាស្ត្របង្រៀនតាមបែបសហការ (Collaborative Learning)',
  'វិធីសាស្ត្របង្រៀនតាមបែបសិស្សមជ្ឈមណ្ឌល (Student-Centered Learning)',
  'វិធីសាស្ត្របង្រៀនតាមបែបពិសោធន៍ និងរិះរក (Inquiry-Based Learning)',
  'វិធីសាស្ត្របង្រៀនផ្អែកលើការដោះស្រាយបញ្ហា (Problem-Based Learning)',
  'វិធីសាស្ត្របង្រៀនផ្អែកលើគម្រោង (Project-Based Learning / STEM)',
  'វិធីសាស្ត្របង្រៀនតាមបែបស្ថាបនានិយម (Constructivism)',
  'វិធីសាស្ត្របង្រៀនអំណានដំបូងតាមបែបសូរសំឡេង (Early Phonics Approach)',
  'វិធីសាស្ត្របង្រៀនគណិតវិទ្យាតាមបែប CPA (Concrete-Pictorial-Abstract)',
  'វិធីសាស្ត្របង្រៀនត្រិះរិះពិចារណា (Critical Thinking)',
];

const COMMON_STRATEGIES = [
  'យុទ្ធវិធីបង្រៀនតាមបែបពិព័រណ៍វិចិត្រសាល (Gallery Walk)',
  'យុទ្ធវិធីគិត-ផ្គូផ្គង-ចែករំលែក (Think-Pair-Share)',
  'យុទ្ធវិធីបំណែករូបផ្គុំ (Jigsaw Strategy)',
  'យុទ្ធវិធី "ខ្ញុំធ្វើ - យើងធ្វើ - អ្នកធ្វើ" (I Do, We Do, You Do)',
  'យុទ្ធវិធីតារាង KWL (ដឹង-ចង់ដឹង-បានរៀន)',
  'យុទ្ធវិធីកន្ត្រកគំនិតបំផុស (Brainstorming / Concept Mapping)',
  'យុទ្ធវិធីបង្វិលស្ថានីយសិក្សា (Station Rotation)',
  'យុទ្ធវិធីដើរតួ និងការបង្កើតគំរូជាក់ស្តែង (Role Play / Simulation)',
  'យុទ្ធវិធីសំណួររហ័ស និងប័ណ្ណឆ្លើយ (Exit Ticket / Flashcards)',
];

export function GeneralInfoForm({
  plan,
  onChangeTeacherInfo,
  onChangeGeneralInfo,
  customPrompt,
  setCustomPrompt,
  onGenerate,
  isGenerating,
  onLoadPreset,
  onOpenPresetModal,
}: GeneralInfoFormProps) {
  const { teacherInfo, generalInfo } = plan;

  // Determine current education level for badge
  let currentLevel = 'វិទ្យាល័យ (ថ្នាក់ទី១០-១២)';
  if (PRIMARY_GRADES.includes(generalInfo.grade)) {
    currentLevel = 'បឋមសិក្សា (ថ្នាក់ទី១-៦)';
  } else if (LOWER_SECONDARY_GRADES.includes(generalInfo.grade)) {
    currentLevel = 'អនុវិទ្យាល័យ (ថ្នាក់ទី៧-៩)';
  }

  // Get matching curriculum subjects for current grade
  const availableSubjects = getSubjectsForGrade(generalInfo.grade);

  // Get matching curriculum lessons for current grade and subject
  const availableLessons = getLessonsForGradeAndSubject(generalInfo.grade, generalInfo.subject);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-sky-800 via-sky-900 to-indigo-950 p-5 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា
              </span>
              <span className="bg-white/20 text-white text-[11px] font-medium px-2 py-0.5 rounded-full">
                {currentLevel}
              </span>
            </div>
            <h2 className="text-lg font-bold">ទម្រង់បង្កើតកិច្ចតែងការបង្រៀន (ថ្នាក់ទី១ ដល់ ទី១២)</h2>
            <p className="text-xs text-sky-100/80 mt-0.5">
              ជ្រើសរើសកម្រិតថ្នាក់ មុខវិជ្ជា និងវិធីសាស្ត្របង្រៀន រួចចុច &quot;បង្កើតដោយ AI&quot;
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onLoadPreset(SKUN_NGS_PHYSICS_PRESET)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>គំរូ វិទ្យាល័យ ហ៊ុន សែន ស្គន់</span>
            </button>
            <button
              type="button"
              onClick={onOpenPresetModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium backdrop-blur-xs transition border border-white/20"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>មើលគំរូទាំងអស់</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Section 1: Teacher & School Info */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <School className="w-4 h-4 text-sky-600" />
              <span>ព័ត៌មានសាលារៀន និងគ្រូបង្រៀន (Header Information)</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <span>សាលាគំរូ៖</span>
              <select
                aria-label="ជ្រើសរើសសាលារៀនគំរូ"
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded px-2 py-0.5 text-[11px] focus:outline-none"
                onChange={(e) => {
                  if (e.target.value) {
                    onChangeTeacherInfo({ schoolName: e.target.value });
                  }
                }}
                value=""
              >
                <option value="" disabled>ជ្រើសរើសសាលា</option>
                {MOEYS_SCHOOL_PRESETS.map((sch) => (
                  <option key={sch} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ឈ្មោះសាលារៀន <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={teacherInfo.schoolName}
                onChange={(e) => onChangeTeacherInfo({ schoolName: e.target.value })}
                placeholder="ឧ. វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ឈ្មោះគ្រូបង្រៀន <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={teacherInfo.teacherName}
                onChange={(e) => onChangeTeacherInfo({ teacherName: e.target.value })}
                placeholder="ឧ. សោម រៀង"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                លេខទូរស័ព្ទ (ស្រេចចិត្ត)
              </label>
              <input
                type="text"
                value={teacherInfo.phoneNumber || ''}
                onChange={(e) => onChangeTeacherInfo({ phoneNumber: e.target.value })}
                placeholder="ឧ. 012 345 678"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ប្រធានក្រុមបច្ចេកទេស
              </label>
              <input
                type="text"
                value={teacherInfo.headOfTechnicalTeam || ''}
                onChange={(e) => onChangeTeacherInfo({ headOfTechnicalTeam: e.target.value })}
                placeholder="ឧ. អ៊ុក វណ្ណារ៉ា"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                នាយក / នាយិកាសាលា
              </label>
              <input
                type="text"
                value={teacherInfo.principalName || ''}
                onChange={(e) => onChangeTeacherInfo({ principalName: e.target.value })}
                placeholder="ឧ. នាយកសាលា"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                កាលបរិច្ឆេទបង្រៀន
              </label>
              <input
                type="text"
                value={teacherInfo.date}
                onChange={(e) => onChangeTeacherInfo({ date: e.target.value })}
                placeholder="ឧ. ថ្ងៃទី ០១ ខែ តុលា ឆ្នាំ ២០២៦"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Lesson Identification & Curriculum Alignment */}
        <div>
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
              <Book className="w-4 h-4 text-sky-600" />
              <span>ព័ត៌មានលម្អិតនៃមេរៀន និងកម្មវិធីសិក្សាជាតិ (MoEYS Curriculum)</span>
            </div>
          {/* Grade Quick-Picker Bar across all 12 grades */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
            <div className="text-[11px] font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>ជ្រើសរើសថ្នាក់ទីរហ័ស (ថ្នាក់ទី១ ដល់ ទី១២)៖</span>
              <span className="text-sky-700 font-semibold">{currentLevel}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              {/* Primary Grades 1 to 6 */}
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <span>🎒 បឋមសិក្សា (១-៦)</span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {PRIMARY_GRADES.map((g) => {
                    const isSelected = generalInfo.grade === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          const subjects = getSubjectsForGrade(g);
                          onChangeGeneralInfo({
                            grade: g,
                            subject: subjects[0] || generalInfo.subject,
                          });
                        }}
                        className={`py-1 text-center rounded text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={g}
                      >
                        {g.replace('ថ្នាក់ទី', 'ទី')}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lower Secondary Grades 7 to 9 */}
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <span>📚 អនុវិទ្យាល័យ (៧-៩)</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {LOWER_SECONDARY_GRADES.map((g) => {
                    const isSelected = generalInfo.grade === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          const subjects = getSubjectsForGrade(g);
                          onChangeGeneralInfo({
                            grade: g,
                            subject: subjects[0] || generalInfo.subject,
                          });
                        }}
                        className={`py-1 text-center rounded text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={g}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upper Secondary Grades 10 to 12 */}
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-indigo-800 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <span>🎓 វិទ្យាល័យ (១០-១២)</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {UPPER_SECONDARY_GRADES.map((g) => {
                    const isSelected = generalInfo.grade === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          const subjects = getSubjectsForGrade(g);
                          onChangeGeneralInfo({
                            grade: g,
                            subject: subjects[0] || generalInfo.subject,
                          });
                        }}
                        className={`py-1 text-center rounded text-[11px] font-semibold transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                        }`}
                        title={g}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Grade Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                កម្រិតថ្នាក់ទី <span className="text-red-500">*</span>
              </label>
              <select
                aria-label="កម្រិតថ្នាក់ទី"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-semibold"
                value={generalInfo.grade}
                onChange={(e) => {
                  const newGrade = e.target.value;
                  const subjects = getSubjectsForGrade(newGrade);
                  onChangeGeneralInfo({
                    grade: newGrade,
                    subject: subjects[0] || generalInfo.subject,
                  });
                }}
              >
                <optgroup label="🎒 កម្រិតបឋមសិក្សា (ថ្នាក់ទី១ ដល់ ទី៦)">
                  {PRIMARY_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📚 កម្រិតអនុវិទ្យាល័យ (ថ្នាក់ទី៧ ដល់ ទី៩)">
                  {LOWER_SECONDARY_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="🎓 កម្រិតវិទ្យាល័យ (ថ្នាក់ទី១០ ដល់ ទី១២)">
                  {UPPER_SECONDARY_GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Subject Selection (Curriculum-aligned) */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                មុខវិជ្ជា/ឯកទេស <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={generalInfo.subject}
                  onChange={(e) => onChangeGeneralInfo({ subject: e.target.value })}
                  placeholder="ឧ. រូបវិទ្យា"
                  className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
                <select
                  aria-label="ជ្រើសរើសមុខវិជ្ជាតាមកម្មវិធីសិក្សា"
                  className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 text-slate-700 max-w-[120px] truncate"
                  onChange={(e) => {
                    if (e.target.value) onChangeGeneralInfo({ subject: e.target.value });
                  }}
                  value=""
                >
                  <option value="" disabled>ជ្រើសរើស</option>
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                រយៈពេលបង្រៀន
              </label>
              <select
                aria-label="រយៈពេលបង្រៀន"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                value={generalInfo.duration}
                onChange={(e) => onChangeGeneralInfo({ duration: e.target.value })}
              >
                {COMMON_DURATIONS.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Lesson Selector from official curriculum */}
            {availableLessons.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-3 bg-sky-50/80 border border-sky-200 rounded-xl p-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 mb-2">
                  <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-700" />
                    <span>ជ្រើសរើសមេរៀនផ្លូវការក្នុងកម្មវិធីសិក្សាជាតិ ({availableLessons.length} មេរៀន)៖</span>
                  </span>
                  <span className="text-[10.5px] text-sky-700 font-medium">
                    ចុចលើមេរៀនណាមួយដើម្បីបំពេញជំពូក និងប្រធានបទដោយស្វ័យប្រវត្តិ
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {availableLessons.map((l) => {
                    const isSelected = generalInfo.lessonTitle === l.lessonTitle;
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => {
                          onChangeGeneralInfo({
                            chapter: l.chapter,
                            lessonTitle: l.lessonTitle,
                            subTopic: l.subTopic,
                          });
                        }}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer border ${
                          isSelected
                            ? 'bg-sky-600 text-white border-sky-700 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-100 hover:text-sky-900'
                        }`}
                        title={`${l.chapter}: ${l.subTopic}`}
                      >
                        {l.lessonTitle}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ជំពូកទី (Chapter)
              </label>
              <input
                type="text"
                value={generalInfo.chapter}
                onChange={(e) => onChangeGeneralInfo({ chapter: e.target.value })}
                placeholder="ឧ. ជំពូកទី៣៖ ទែម៉ូឌីណាមិច"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                មេរៀនទី (Lesson Title) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={generalInfo.lessonTitle}
                onChange={(e) => onChangeGeneralInfo({ lessonTitle: e.target.value })}
                placeholder="ឧ. មេរៀនទី១៖ សីតុណ្ហភាព និងកម្តៅ"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                ប្រធានបទរង / ចំណងជើងរង (Subtopic) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={generalInfo.subTopic}
                onChange={(e) => onChangeGeneralInfo({ subTopic: e.target.value })}
                placeholder="ឧ. សីតុណ្ហភាព និងការបំប្លែងខ្នាតសីតុណ្ហភាព (Celsius, Fahrenheit, Kelvin)"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Methodology and Strategies */}
        <div>
          <div className="flex items-center gap-2 mb-3 text-slate-800 font-semibold text-sm border-b border-slate-100 pb-2">
            <Lightbulb className="w-4 h-4 text-sky-600" />
            <span>វិធីសាស្ត្រ និងយុទ្ធវិធីបង្រៀន (Teaching Methodology & Strategies)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                វិធីសាស្ត្របង្រៀន (Teaching Method)
              </label>
              <select
                aria-label="វិធីសាស្ត្របង្រៀន"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
                value={generalInfo.methodology}
                onChange={(e) => onChangeGeneralInfo({ methodology: e.target.value })}
              >
                {COMMON_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={generalInfo.methodology}
                onChange={(e) => onChangeGeneralInfo({ methodology: e.target.value })}
                placeholder="ឬសរសេរវិធីសាស្ត្រដោយផ្ទាល់..."
                className="w-full text-xs rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                យុទ្ធវិធីបង្រៀន (Strategy / Technique)
              </label>
              <select
                aria-label="យុទ្ធវិធីបង្រៀន"
                className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
                value={generalInfo.strategy}
                onChange={(e) => onChangeGeneralInfo({ strategy: e.target.value })}
              >
                {COMMON_STRATEGIES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={generalInfo.strategy}
                onChange={(e) => onChangeGeneralInfo({ strategy: e.target.value })}
                placeholder="ឬសរសេរយុទ្ធវិធីដោយផ្ទាល់..."
                className="w-full text-xs rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Additional Notes / Prompt Customization */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            ការណែនាំបន្ថែមសម្រាប់ AI (Additional Instructions)
          </label>
          <textarea
            rows={2}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="ឧទាហរណ៍៖ សូមផ្តោតខ្លាំងលើការបំប្លែងខ្នាត Kelvin និងការបិទ sticky notes វាយតម្លៃ... ឬ បន្ថែមសំណួរបំផុសគំនិតសម្រាប់សិស្សបឋម..."
            className="w-full text-xs rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            💡 AI នឹងរៀបចំដំណើរការបង្រៀន ៥ ជំហាន ស្របតាមកម្មវិធីសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា
          </p>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white rounded-lg font-semibold text-xs shadow-md transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'កំពុងរៀបចំកិច្ចតែងការដោយ AI...' : 'បង្កើតកិច្ចតែងការឥឡូវនេះ (Generate)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
