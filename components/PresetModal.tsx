'use client';

import React, { useState } from 'react';
import { X, Search, Sparkles, School, BookOpen, GraduationCap, ChevronRight, Filter } from 'lucide-react';
import { COMPREHENSIVE_PRESETS, PresetItem } from '@/lib/presets';
import {
  PRIMARY_GRADES,
  LOWER_SECONDARY_GRADES,
  UPPER_SECONDARY_GRADES,
} from '@/lib/curriculum';
import { LessonPlanData } from '@/types/lesson-plan';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (plan: LessonPlanData) => void;
  currentPlanId?: string;
  initialCategory?: string;
}

export function PresetModal({
  isOpen,
  onClose,
  onSelectPreset,
  currentPlanId,
  initialCategory = 'all',
}: PresetModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubjectKeyword, setSelectedSubjectKeyword] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [prevCategory, setPrevCategory] = useState<string>(initialCategory);
  if (initialCategory !== prevCategory) {
    setPrevCategory(initialCategory);
    setActiveCategory(initialCategory || 'all');
    setSelectedGrade('all');
  }

  if (!isOpen) return null;

  // Filter logic
  const filteredPresets = COMPREHENSIVE_PRESETS.filter((preset) => {
    const matchesCategory =
      activeCategory === 'all' || preset.category === activeCategory;
    const matchesGrade =
      selectedGrade === 'all' || preset.grade === selectedGrade;
    const matchesSubject =
      selectedSubjectKeyword === 'all' ||
      preset.subject.toLowerCase().includes(selectedSubjectKeyword.toLowerCase()) ||
      preset.name.toLowerCase().includes(selectedSubjectKeyword.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesGrade && matchesSubject && matchesSearch;
  });

  // Available grade pills based on active category
  let gradePills: string[] = [];
  if (activeCategory === 'primary') {
    gradePills = PRIMARY_GRADES;
  } else if (activeCategory === 'lower_secondary') {
    gradePills = LOWER_SECONDARY_GRADES;
  } else if (activeCategory === 'upper_secondary' || activeCategory === 'skun_ngs') {
    gradePills = UPPER_SECONDARY_GRADES;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-800 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <School className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ជ្រើសរើសគំរូកិច្ចតែងការបង្រៀន</h3>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ថ្នាក់ទី១ ដល់ ទី១២
                </span>
              </div>
              <p className="text-xs text-sky-100/80">
                វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី), បឋមសិក្សា (១-៦), អនុវិទ្យាល័យ (៧-៩), វិទ្យាល័យ (១០-១២)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'all'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ទាំងអស់ ({COMPREHENSIVE_PRESETS.length})
            </button>
            <button
              onClick={() => {
                setActiveCategory('skun_ngs');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition flex items-center gap-1.5 ${
                activeCategory === 'skun_ngs'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-50'
              }`}
            >
              <span>⭐ វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)</span>
            </button>
            <button
              onClick={() => {
                setActiveCategory('primary');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'primary'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🎒 បឋមសិក្សា (ថ្នាក់ទី១ ដល់ ទី៦)
            </button>
            <button
              onClick={() => {
                setActiveCategory('lower_secondary');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'lower_secondary'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              📚 អនុវិទ្យាល័យ (ថ្នាក់ទី៧ ដល់ ទី៩)
            </button>
            <button
              onClick={() => {
                setActiveCategory('upper_secondary');
                setSelectedGrade('all');
              }}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                activeCategory === 'upper_secondary'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              🎓 វិទ្យាល័យ (ថ្នាក់ទី១០ ដល់ ទី១២)
            </button>
          </div>

          {/* Sub-Grade Pills (if level selected) */}
          {gradePills.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] pt-1">
              <span className="text-slate-500 font-semibold mr-1">រើសថ្នាក់៖</span>
              <button
                onClick={() => setSelectedGrade('all')}
                className={`px-2.5 py-1 rounded-md transition ${
                  selectedGrade === 'all'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                គ្រប់ថ្នាក់
              </button>
              {gradePills.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`px-2.5 py-1 rounded-md transition ${
                    selectedGrade === g
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {/* Quick Specialty / Subject Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] pt-1">
            <span className="text-slate-500 font-semibold mr-1 whitespace-nowrap">រើសឯកទេស៖</span>
            {[
              { id: 'all', label: 'ទាំងអស់' },
              { id: 'គណិត', label: 'គណិត' },
              { id: 'ខ្មែរ', label: 'ខ្មែរ' },
              { id: 'សីលធម៌', label: 'សីលធម៌-ពលរដ្ឋ' },
              { id: 'ភូមិវិទ្យា', label: 'ភូមិវិទ្យា' },
              { id: 'អង់គ្លេស', label: 'អង់គ្លេស' },
              { id: 'គីមី', label: 'គីមីវិទ្យា' },
              { id: 'កីឡា', label: 'កីឡា' },
              { id: 'គេហវិទ្យា', label: 'គេហវិទ្យា' },
              { id: 'ផែនដី', label: 'ផែនដីវិទ្យា' },
              { id: 'រូបវិទ្យា', label: 'រូបវិទ្យា' },
              { id: 'ជីវវិទ្យា', label: 'ជីវវិទ្យា' },
              { id: 'ប្រវត្តិ', label: 'ប្រវត្តិវិទ្យា' },
              { id: 'ព័ត៌មានវិទ្យា', label: 'ICT' },
            ].map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubjectKeyword(sub.id === 'all' ? 'all' : sub.id)}
                className={`px-2 py-0.5 rounded-md whitespace-nowrap transition ${
                  (selectedSubjectKeyword === sub.id) || (sub.id === 'all' && selectedSubjectKeyword === 'all')
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមមុខវិជ្ជា (រូបវិទ្យា, គីមី, ជីវវិទ្យា, ភាសាខ្មែរ...), ថ្នាក់ទី, ឬពាក្យគន្លឹះ..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Presets List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {filteredPresets.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              មិនមានគំរូដែលត្រូវនឹងការស្វែងរកទេ។ សូមសាកល្បងផ្លាស់ប្តូរពាក្យគន្លឹះ។
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredPresets.map((preset) => {
                const isSelected = currentPlanId === preset.data.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectPreset(preset.data);
                      onClose();
                    }}
                    className={`cursor-pointer p-4 rounded-xl border text-left transition flex flex-col justify-between hover:shadow-md ${
                      isSelected
                        ? 'border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:border-sky-300 bg-white'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-800 bg-sky-100/90 px-2 py-0.5 rounded-md">
                          {preset.subject}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {preset.grade}
                        </span>
                      </div>

                      {/* Title & School */}
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 mb-1">
                        {preset.name}
                      </h4>
                      <p className="text-[11px] font-medium text-slate-600 mb-2 flex items-center gap-1">
                        <School className="w-3 h-3 text-slate-400" />
                        <span>{preset.school}</span>
                      </p>

                      {/* Description */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {/* Footer Row */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">
                        {preset.data.generalInfo.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sky-600 font-bold group-hover:translate-x-0.5 transition">
                        <span>ផ្ទុកគំរូនេះ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">
            រកឃើញ {filteredPresets.length} គំរូ (នៃចំនួនសរុប {COMPREHENSIVE_PRESETS.length} គំរូ)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
}
