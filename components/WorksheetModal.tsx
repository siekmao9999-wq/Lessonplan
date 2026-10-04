'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Download,
  Printer,
  FileText,
  Check,
  Copy,
  BookOpen,
  FolderOpen,
  Layers,
  HelpCircle,
  RotateCcw,
  Eye,
  Edit3,
  Scissors,
  CheckCircle,
  Plus,
  Bookmark,
  Share2,
  List,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { LessonPlanData } from '@/types/lesson-plan';
import { downloadFile } from '@/lib/export-html';
import { MathText } from '@/components/MathText';
import {
  ALL_GRADES,
  PRIMARY_GRADES,
  LOWER_SECONDARY_GRADES,
  UPPER_SECONDARY_GRADES,
  getSubjectsForGrade,
  getLessonsForGradeAndSubject,
  CurriculumLesson,
} from '@/lib/curriculum';
import { COMPREHENSIVE_PRESETS } from '@/lib/presets';
import {
  TEACHING_MATERIAL_TYPES,
  TARGET_AUDIENCE_OPTIONS,
  ITEM_COUNT_OPTIONS,
  generateFallbackTeachingMaterials,
  generateTeachingMaterialsPrintHtml,
} from '@/lib/teaching-materials-generator';

interface WorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlanData;
  onUpdatePlan?: (updated: LessonPlanData) => void;
  initialTab?: 'worksheet' | 'materials';
}

const WORKSHEET_TYPES = [
  { id: 'think_pair_share', label: 'យុទ្ធវិធីគិត-ផ្គូផ្គង-ចែករំលែក (Think-Pair-Share)' },
  { id: 'group_discussion', label: 'កិច្ចការពិភាក្សាក្រុម និងសហការ (Collaborative Group Work)' },
  { id: 'station_learning', label: 'ការរៀនតាមស្ថានីយ៍វិលជុំ (Station / Carousel Activity)' },
  { id: 'pisa_stem', label: 'លំហាត់អនុវត្តកម្រិត PISA / STEM (Real-World Problem)' },
  { id: 'inquiry_experiment', label: 'សន្លឹកកិច្ចការពិសោធន៍ & សង្កេត (Experiment / Inquiry Sheet)' },
  { id: 'consolidation_review', label: 'សន្លឹកកិច្ចការសង្ខេប & ពង្រឹងចំណេះដឹង (Review & Summary)' },
];

const QUESTION_COUNTS = [
  { value: 2, label: '២ សំណួរ/លំហាត់ (រហ័ស ១០-១៥ នាទី)' },
  { value: 3, label: '៣ សំណួរ/លំហាត់ (ស្តង់ដារ ១៥-២០ នាទី)' },
  { value: 4, label: '៤ សំណួរ/លំហាត់ (ស៊ីជម្រៅ ២០-២៥ នាទី)' },
  { value: 5, label: '៥ សំណួរ/លំហាត់ (ទូលំទូលាយ ៣០ នាទី)' },
];

export function WorksheetModal({
  isOpen,
  onClose,
  plan,
  onUpdatePlan,
  initialTab = 'worksheet',
}: WorksheetModalProps) {
  const { generalInfo, teacherInfo } = plan;

  // Active Main Modal Tab: 'worksheet' (សន្លឹកកិច្ចការសិស្ស) OR 'materials' (បង្កើតសម្ភារៈឩទេស)
  const [activeTab, setActiveTab] = useState<'worksheet' | 'materials'>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState<'worksheet' | 'materials'>(initialTab);
  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  // Pre-calculate initial lessons
  const initialGrade = generalInfo.grade || 'ថ្នាក់ទី១០';
  const initialSubject = generalInfo.subject || 'រូបវិទ្យា (មេកានិច & ទែម៉ូឌីណាមិច)';
  const initialLessons = getLessonsForGradeAndSubject(initialGrade, initialSubject);
  const defaultLesson = initialLessons[0];

  // Form State for Subject & Lesson Selection
  const [selectedGrade, setSelectedGrade] = useState<string>(initialGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(defaultLesson?.id || '');
  const [chapter, setChapter] = useState<string>(generalInfo.chapter || defaultLesson?.chapter || '');
  const [lessonTitle, setLessonTitle] = useState<string>(generalInfo.lessonTitle || defaultLesson?.lessonTitle || '');
  const [subTopic, setSubTopic] = useState<string>(generalInfo.subTopic || defaultLesson?.subTopic || '');

  // 1. Worksheet Specific State
  const [worksheetType, setWorksheetType] = useState<string>(
    generalInfo.strategy
      ? `យុទ្ធវិធី ${generalInfo.strategy}`
      : 'យុទ្ធវិធីគិត-ផ្គូផ្គង-ចែករំលែក (Think-Pair-Share)'
  );
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [worksheetContent, setWorksheetContent] = useState<string>('');
  const [isLoadingWorksheet, setIsLoadingWorksheet] = useState(false);
  const [worksheetViewMode, setWorksheetViewMode] = useState<'preview' | 'edit'>('preview');

  // 2. Teaching Materials (សម្ភារៈឩទេស) Specific State
  const [materialType, setMaterialType] = useState<string>('flashcards');
  const [targetAudience, setTargetAudience] = useState<string>('group_work');
  const [materialItemCount, setMaterialItemCount] = useState<number>(4);
  const [materialsContent, setMaterialsContent] = useState<string>('');
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [materialsViewMode, setMaterialsViewMode] = useState<'preview' | 'edit'>('preview');

  // General Notification Feedback
  const [copied, setCopied] = useState(false);
  const [savedToPlanNotice, setSavedToPlanNotice] = useState(false);

  // Available subjects for the current grade
  const availableSubjects = useMemo(() => getSubjectsForGrade(selectedGrade), [selectedGrade]);

  // Available lessons from official curriculum for the current grade & subject
  const availableLessons = useMemo(
    () => getLessonsForGradeAndSubject(selectedGrade, selectedSubject),
    [selectedGrade, selectedSubject]
  );

  // Lesson Search and Display state
  const [lessonSearch, setLessonSearch] = useState('');
  const [showAllLessons, setShowAllLessons] = useState(false);

  // Filter lessons based on search query
  const filteredLessons = useMemo(() => {
    if (!lessonSearch.trim()) return availableLessons;
    const q = lessonSearch.toLowerCase();
    return availableLessons.filter(
      (l) =>
        l.lessonTitle.toLowerCase().includes(q) ||
        l.chapter.toLowerCase().includes(q) ||
        l.subTopic.toLowerCase().includes(q) ||
        (l.keyConcepts && l.keyConcepts.some((c) => c.toLowerCase().includes(q)))
    );
  }, [availableLessons, lessonSearch]);

  // Current lesson object with metadata and suggested materials
  const currentLesson = useMemo(
    () => availableLessons.find((l) => l.id === selectedLessonId),
    [availableLessons, selectedLessonId]
  );

  // Handle grade change
  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade);
    const subjectsForNewGrade = getSubjectsForGrade(newGrade);
    const newSubject = subjectsForNewGrade[0] || 'ភាសាខ្មែរ';
    setSelectedSubject(newSubject);

    const lessons = getLessonsForGradeAndSubject(newGrade, newSubject);
    if (lessons.length > 0) {
      setSelectedLessonId(lessons[0].id);
      setChapter(lessons[0].chapter);
      setLessonTitle(lessons[0].lessonTitle);
      setSubTopic(lessons[0].subTopic);
    } else {
      setSelectedLessonId('');
    }
  };

  // Handle subject change
  const handleSubjectChange = (newSubject: string) => {
    setSelectedSubject(newSubject);
    const lessons = getLessonsForGradeAndSubject(selectedGrade, newSubject);
    if (lessons.length > 0) {
      setSelectedLessonId(lessons[0].id);
      setChapter(lessons[0].chapter);
      setLessonTitle(lessons[0].lessonTitle);
      setSubTopic(lessons[0].subTopic);
    } else {
      setSelectedLessonId('');
    }
  };

  // Handle lesson selection from dropdown
  const handleLessonChange = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    if (lessonId === 'custom') {
      return;
    }
    const found = availableLessons.find((l) => l.id === lessonId);
    if (found) {
      setChapter(found.chapter);
      setLessonTitle(found.lessonTitle);
      setSubTopic(found.subTopic);
    }
  };

  // Quick preset loader
  const handleSelectPreset = (presetId: string) => {
    const found = COMPREHENSIVE_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedGrade(found.data.generalInfo.grade);
      setSelectedSubject(found.data.generalInfo.subject);
      setChapter(found.data.generalInfo.chapter);
      setLessonTitle(found.data.generalInfo.lessonTitle);
      setSubTopic(found.data.generalInfo.subTopic);
      if (found.data.generalInfo.strategy) {
        setWorksheetType(`យុទ្ធវិធី ${found.data.generalInfo.strategy}`);
      }
      setSelectedLessonId('preset_' + found.id);
    }
  };

  if (!isOpen) return null;

  // 1. Generate Worksheet Handler
  const generateWorksheet = async () => {
    setIsLoadingWorksheet(true);
    try {
      const res = await fetch('/api/enhance-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: 'សន្លឹកកិច្ចការសិស្ស (Student Worksheet)',
          currentContent: `សកម្មភាពក្រុមសម្រាប់${worksheetType} ចំនួន ${questionCount} សំណួរ`,
          instruction: `សូមរៀបចំជា "សន្លឹកកិច្ចការសិស្ស (Student Activity Worksheet)" ចំនួន ១ សន្លឹក ឱ្យមានស្តង់ដារគរុកោសល្យខ្ពស់ និងស្របតាមកម្រិតថ្នាក់ជាក់ស្តែង៖
ព័ត៌មានមេរៀន៖
- មុខវិជ្ជា៖ ${selectedSubject}
- កម្រិតថ្នាក់៖ ${selectedGrade}
- ជំពូក៖ ${chapter}
- មេរៀន៖ ${lessonTitle}
- ប្រធានបទរង៖ ${subTopic}
- ប្រភេទសកម្មភាព៖ ${worksheetType}
- ចំនួនសំណួរ/លំហាត់៖ ${questionCount} សំណួរ

ទម្រង់ដែលត្រូវរៀបចំ៖
១. ក្បាលសន្លឹកកិច្ចការផ្លូវការ (មានឈ្មោះសាលា៖ ${teacherInfo.schoolName}, មុខវិជ្ជា, ថ្នាក់, ឈ្មោះក្រុម, សមាជិកក្រុម, កាលបរិច្ឆេទ, ពិន្ទុ /១០)
២. វត្ថុបំណងសកម្មភាព និងសេចក្តីណែនាំក្នុងការអនុវត្តយ៉ាងច្បាស់លាស់
៣. បញ្ជីសំណួរ/លំហាត់ចំនួន ${questionCount} ដោយមានកម្រិតលំបាកលំអានសមស្រប (មានចន្លោះចម្លើយ ឬតារាងសម្រាប់សិស្សសរសេរ)
៤. សំណួរឆ្លុះបញ្ចាំង (Reflection Question) ចុងក្រោយមួយសម្រាប់ឱ្យសិស្សសង្ខេបចំណេះដឹងដែលទទួលបាន

សូមបញ្ចេញខ្លឹមសារសន្លឹកកិច្ចការទាំងស្រុងជាភាសាខ្មែរ ដោយរៀបចំក្បាល និងផ្នែកនីមួយៗឱ្យមានរបៀបរៀបរយស្អាត។`,
          lessonContext: {
            subject: selectedSubject,
            grade: selectedGrade,
            chapter,
            lessonTitle,
            subTopic,
            strategy: worksheetType,
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.enhancedText) {
        setWorksheetContent(data.enhancedText);
        setWorksheetViewMode('preview');
      } else {
        throw new Error('Fallback needed');
      }
    } catch {
      // High-quality immediate pedagogical fallback
      const fallback = `=== សន្លឹកកិច្ចការសិស្ស (Student Activity Worksheet) ===
សាលារៀន៖ ${teacherInfo.schoolName}
មុខវិជ្ជា៖ ${selectedSubject} | កម្រិតថ្នាក់៖ ${selectedGrade}
មេរៀន៖ ${lessonTitle || 'មេរៀនតាមកម្មវិធីសិក្សា'} | ជំពូក៖ ${chapter || 'ជំពូកគ្រឹះ'}
ប្រធានបទស្នូល៖ ${subTopic || 'ចំណេះដឹង និងការអនុវត្តជាក់ស្តែង'}
យុទ្ធវិធីអនុវត្ត៖ ${worksheetType}

[ព័ត៌មានក្រុម និងការវាយតម្លៃ]
• ឈ្មោះក្រុម/សិស្ស៖ ....................................................   កាលបរិច្ឆេទ៖ ${teacherInfo.date || 'ថ្ងៃទី.....ខែ.....ឆ្នាំ២០២៦'}
• សមាជិកក្រុម៖ ១..................................... ២..................................... ៣..................................... ៤.....................................
• ពិន្ទុវាយតម្លៃរួម៖ ......./១០ ពិន្ទុ

---------------------------------------------------------------------------------
🎯 វត្ថុបំណង និងសេចក្តីណែនាំក្នុងការអនុវត្ត៖
១. អានសំណួរនីមួយៗឲ្យបានយល់ច្បាស់ ពិភាក្សាជាមួយសមាជិកក្រុម និងសរសេរចម្លើយឲ្យបានក្បោះក្បាយ។
២. គ្រប់សមាជិកទាំងអស់ត្រូវមានចំណែកចូលរួម និងត្រៀមឡើងធ្វើបទបង្ហាញជូនមិត្តរួមថ្នាក់។

---------------------------------------------------------------------------------
📝 បញ្ជីសំណួរ និងលំហាត់អនុវត្ត (${questionCount} សំណួរ)៖

សំណួរទី ១ (កម្រិតយល់ដឹងគ្រឹះ - ២ ពិន្ទុ)៖
ចូរឲ្យនិយមន័យ និងពន្យល់ពីសារៈសំខាន់នៃ ${subTopic || lessonTitle} ក្នុងមុខវិជ្ជា ${selectedSubject}។
ចម្លើយក្រុម៖
..........................................................................................................................................
..........................................................................................................................................

សំណួរទី ២ (កម្រិតអនុវត្ត និងគណនា - ៣ ពិន្ទុ)៖
ផ្អែកលើរូបមន្ត ឬគោលការណ៍ដែលបានរៀន ចូរដោះស្រាយបញ្ហា/លំហាត់ជាក់ស្តែង និងបង្ហាញជំហានគណនាឲ្យបានច្បាស់លាស់។
ចម្លើយក្រុម៖
..........................................................................................................................................
..........................................................................................................................................
..........................................................................................................................................

សំណួរទី ៣ (កម្រិតវិភាគ និងស្ថានភាពជាក់ស្តែង PISA/STEM - ៣ ពិន្ទុ)៖
ប្រសិនបើមានស្ថានភាពជាក់ស្តែងកើតឡើងក្នុងសហគមន៍ ឬជីវភាពប្រចាំថ្ងៃ តើក្រុមរបស់អ្នកនឹងប្រើប្រាស់ចំណេះដឹងពីមេរៀននេះដើម្បីដោះស្រាយបញ្ហាដោយរបៀបណា?
ចម្លើយក្រុម៖
..........................................................................................................................................
..........................................................................................................................................

---------------------------------------------------------------------------------
✨ សំណួរឆ្លុះបញ្ចាំង (Reflection Question - ២ ពិន្ទុ)៖
តើអ្វីជាចំណុចសំខាន់បំផុតដែលក្រុមរបស់អ្នកបានរៀនសូត្រពីសកម្មភាពនេះ? ហើយតើក្រុមរបស់អ្នកបានសហការគ្នាយ៉ាងដូចម្តេច?
ចម្លើយក្រុម៖
..........................................................................................................................................
..........................................................................................................................................`;
      setWorksheetContent(fallback);
      setWorksheetViewMode('preview');
    } finally {
      setIsLoadingWorksheet(false);
    }
  };

  // 2. Generate Teaching Materials (សម្ភារៈឩទេស) Handler
  const generateTeachingMaterials = async () => {
    setIsLoadingMaterials(true);
    const currentTypeObj = TEACHING_MATERIAL_TYPES.find((t) => t.id === materialType) || TEACHING_MATERIAL_TYPES[0];

    try {
      const res = await fetch('/api/enhance-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: `សម្ភារឧបទេសបង្រៀន (Teaching Aids - ${currentTypeObj.label})`,
          currentContent: `រៀបចំសម្ភារឧបទេសប្រភេទ ${currentTypeObj.label} សម្រាប់ ${targetAudience} ចំនួន ${materialItemCount} ធាតុ`,
          instruction: `សូមដើរតួជាអ្នកជំនាញគរុកោសល្យខ្មែរនៃក្រសួងអប់រំ យុវជន និងកីឡា រៀបចំ "សម្ភារឧបទេសបង្រៀន (Teaching Aids & Instructional Materials)" ជាក់ស្តែង៖
ព័ត៌មានមេរៀន៖
- មុខវិជ្ជា៖ ${selectedSubject} (${selectedGrade})
- ជំពូក៖ ${chapter}
- មេរៀន៖ ${lessonTitle}
- ប្រធានបទរង៖ ${subTopic}
- ប្រភេទសម្ភារៈឩទេស៖ ${currentTypeObj.label}
- គោលដៅប្រើប្រាស់៖ ${targetAudience}
- ចំនួនប័ណ្ណ/ធាតុ៖ ${materialItemCount} ធាតុ

ទម្រង់ដែលត្រូវបញ្ចេញ៖
${
  materialType === 'flashcards'
    ? `សូមបញ្ចេញជាសំណុំប័ណ្ណ Flashcards មានបន្ទាត់ដាច់ៗ "✂️ ------------------------------------ ✂️" សម្រាប់កាត់ចេញ ក្នុងកាតនីមួយៗមាន៖ 【ប័ណ្ណទី...】, កម្រិត, [សំណួរ/ពាក្យគន្លឹះ], [ចម្លើយពន្យល់], [ចំណុចគន្លឹះចងចាំ]`
    : materialType === 'concept_poster'
    ? `សូមបញ្ចេញជាផ្ទាំងសង្ខេបច្បាស់ៗមានប្រអប់៖ និយមន័យគន្លឹះ (Core Concept), រូបមន្តគន្លឹះ (Formulas & Laws), ជំហានដោះស្រាយ (Step-by-Step), កំហុសសិស្សឧស្សាហ៍ច្រឡំ (Misconceptions), និងការអនុវត្តជីវិតជាក់ស្តែង (Real-World Application)`
    : materialType === 'group_task_cards'
    ? `សូមបញ្ចេញជា ៤ ប័ណ្ណភារកិច្ចក្រុម៖ 【ប័ណ្ណក្រុមទី១៖ ក្រុមអ្នកស្រាវជ្រាវ】, 【ប័ណ្ណក្រុមទី២៖ ក្រុមអ្នកគណនា】, 【ប័ណ្ណក្រុមទី៣៖ ក្រុមអ្នកអនុវត្តពិសោធន៍】, 【ប័ណ្ណក្រុមទី៤៖ ក្រុមអ្នកឆ្លុះបញ្ចាំង PISA】`
    : materialType === 'lab_guide'
    ? `សូមបញ្ចេញជាការណែនាំពិសោធន៍៖ បញ្ជីឧបករណ៍ផ្លូវការ & សម្ភារកែច្នៃងាយរកក្នុងមូលដ្ឋាន, វិធានសុវត្ថិភាព, ជំហានពិសោធន៍មួយៗ, តារាងកត់ត្រាទិន្នន័យសិស្ស, សំណួរពិភាក្សាក្រោយពិសោធន៍`
    : materialType === 'rubric_sheet'
    ? `សូមបញ្ចេញជាតារាងរូប៊្រិក ៤ កម្រិត (ល្អប្រសើរ, ល្អ, មធ្យម, ត្រូវកែលម្អ) លើ ៤ ទិដ្ឋភាព៖ ចំណេះដឹង, បំណិន, ការងារជាក្រុម, និងការធ្វើបទបង្ហាញ`
    : `សូមបញ្ចេញជាសន្លឹកជំនួយស្មារតីសង្ខេប (Cheat Sheet)៖ កម្រងរូបមន្តមាស, លេខពិសេសត្រូវចាំ, គន្លឹះដោះស្រាយលំហាត់លឿន`
}

សូមបញ្ចេញខ្លឹមសារទាំងស្រុងជាភាសាខ្មែរ ដោយរៀបចំក្បាល និងផ្នែកនីមួយៗឱ្យមានរបៀបរៀបរយស្អាត ងាយស្រួលបោះពុម្ព។`,
          lessonContext: {
            subject: selectedSubject,
            grade: selectedGrade,
            chapter,
            lessonTitle,
            subTopic,
            materialType,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.enhancedText) {
        setMaterialsContent(data.enhancedText);
        setMaterialsViewMode('preview');
      } else {
        throw new Error('Use fallback');
      }
    } catch {
      // Immediate rich fallback
      const fallback = generateFallbackTeachingMaterials(
        materialType,
        selectedSubject,
        selectedGrade,
        chapter,
        lessonTitle,
        subTopic,
        targetAudience,
        materialItemCount,
        teacherInfo.schoolName
      );
      setMaterialsContent(fallback);
      setMaterialsViewMode('preview');
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  // Copy handler
  const handleCopyText = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Add generated teaching materials directly to active lesson plan
  const handleSaveMaterialsToPlan = () => {
    if (!materialsContent || !onUpdatePlan) return;
    const currentTeacher = [...plan.materials.teacherMaterials];
    const currentStudent = [...plan.materials.studentMaterials];

    const currentTypeObj = TEACHING_MATERIAL_TYPES.find((t) => t.id === materialType);
    const summaryItem = `${currentTypeObj?.label || 'សម្ភារឧបទេស'}៖ ${subTopic || lessonTitle} (${selectedSubject} ${selectedGrade})`;

    if (!currentTeacher.includes(summaryItem)) {
      currentTeacher.push(summaryItem);
    }
    if (!currentStudent.includes(`សន្លឹកជំនួយស្មារតី / ប័ណ្ណសកម្មភាព៖ ${lessonTitle}`)) {
      currentStudent.push(`សន្លឹកជំនួយស្មារតី / ប័ណ្ណសកម្មភាព៖ ${lessonTitle}`);
    }

    onUpdatePlan({
      ...plan,
      materials: {
        ...plan.materials,
        teacherMaterials: currentTeacher,
        studentMaterials: currentStudent,
      },
    });

    setSavedToPlanNotice(true);
    setTimeout(() => setSavedToPlanNotice(false), 3000);
  };

  // Print Worksheet HTML
  const generateWorksheetPrintHtml = () => {
    return `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <title>សន្លឹកកិច្ចការសិស្ស - ${selectedSubject} ${selectedGrade}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&family=Siemreap&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Kantumruy Pro', 'Siemreap', sans-serif; padding: 25px 35px; font-size: 13px; line-height: 1.6; max-width: 850px; margin: 0 auto; color: #0f172a; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px; }
    .kingdom { font-family: 'Moul', cursive; font-size: 13px; margin-bottom: 2px; }
    .school { font-weight: bold; font-size: 14px; margin-top: 4px; }
    .title { font-family: 'Moul', cursive; font-size: 17px; margin: 10px 0 4px 0; color: #1e3a8a; }
    .sub-title { font-size: 12px; font-weight: 600; color: #475569; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px; font-size: 12px; border: 1.5px solid #cbd5e1; padding: 10px 14px; border-radius: 8px; background: #f8fafc; }
    .score-box { border: 1.5px solid #0f172a; padding: 4px 12px; font-weight: bold; display: inline-block; border-radius: 6px; }
    .content { white-space: pre-line; line-height: 1.7; font-size: 13px; }
    .no-print { margin-bottom: 16px; display: flex; gap: 8px; }
    .btn { padding: 8px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; border: none; font-size: 12px; }
    .btn-print { background: #0284c7; color: white; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      @page { size: A4 portrait; margin: 1.2cm; }
    }
  </style>
</head>
<body>
  <div class="no-print">
    <button onclick="window.print()" class="btn btn-print">🖨️ បោះពុម្ពសន្លឹកកិច្ចការ (Print / Save as PDF)</button>
  </div>
  <div class="header">
    <div class="kingdom">ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
    <div class="school">${teacherInfo.schoolName}</div>
    <div class="title">សន្លឹកកិច្ចការសិស្ស (Student Worksheet)</div>
    <div class="sub-title">មុខវិជ្ជា៖ ${selectedSubject} | កម្រិតថ្នាក់៖ ${selectedGrade} | ${lessonTitle || subTopic}</div>
  </div>
  <div class="meta-grid">
    <div><strong>ឈ្មោះក្រុម/សិស្ស៖</strong> ....................................................</div>
    <div style="text-align: right;"><strong>កាលបរិច្ឆេទ៖</strong> ${teacherInfo.date || 'ថ្ងៃទី.....ខែ.....ឆ្នាំ២០២៦'}</div>
    <div><strong>សមាជិកក្រុម៖</strong> ....................................................</div>
    <div style="text-align: right;">
      <span class="score-box">ពិន្ទុវាយតម្លៃ៖ ......./១០</span>
    </div>
  </div>
  <div class="content">${worksheetContent || 'សូមចុច "បង្កើតសន្លឹកកិច្ចការដោយ AI" ជាមុនសិន។'}</div>
</body>
</html>`;
  };

  const handlePrintWorksheet = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const html = generateWorksheetPrintHtml();
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  const handleDownloadWorksheetHtml = () => {
    const html = generateWorksheetPrintHtml();
    downloadFile(
      html,
      `សន្លឹកកិច្ចការ_${selectedSubject.slice(0, 10)}_${selectedGrade}_${(subTopic || 'មេរៀន').slice(0, 15)}.html`,
      'text/html'
    );
  };

  const handleDownloadWorksheetWord = () => {
    const formattedBody = (worksheetContent || '')
      .replace(/\$\$(.*?)\$\$/g, '<div style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-size: 11pt; text-align: center; margin: 4pt 0;">$1</div>')
      .replace(/\$(.*?)\$/g, '<span style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-size: 11pt; font-style: italic;">$1</span>')
      .replace(/²/g, '<sup style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-weight: bold;">2</sup>')
      .replace(/³/g, '<sup style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-weight: bold;">3</sup>')
      .replace(/Δ/g, '<span style="font-family: \'Times New Roman\', \'Cambria Math\', serif;">&Delta;</span>')
      .replace(/π/g, '<span style="font-family: \'Times New Roman\', \'Cambria Math\', serif;">&pi;</span>')
      .replace(/\n/g, '<br/>');

    const wordContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>សន្លឹកកិច្ចការសិស្ស</title>
    <style>
      body { font-family: 'Khmer OS Siemreap', 'Kantumruy Pro', Arial, sans-serif; font-size: 11pt; line-height: 1.6; }
      .math, .mathtype { font-family: 'Times New Roman', 'Cambria Math', serif; font-style: italic; }
    </style>
    </head>
    <body>
    <div style="text-align: center; font-weight: bold; font-size: 14pt;">សន្លឹកកិច្ចការសិស្ស (Student Worksheet)</div>
    <div style="text-align: center; font-size: 11pt;">មុខវិជ្ជា៖ ${selectedSubject} | កម្រិតថ្នាក់៖ ${selectedGrade}</div>
    <hr/>
    ${formattedBody}
    </body></html>`;
    downloadFile(
      wordContent,
      `សន្លឹកកិច្ចការ_${selectedSubject.slice(0, 10)}_${selectedGrade}.doc`,
      'application/msword'
    );
  };

  // Print Teaching Materials HTML
  const handlePrintMaterials = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    const currentTypeObj = TEACHING_MATERIAL_TYPES.find((t) => t.id === materialType);
    const html = generateTeachingMaterialsPrintHtml(
      currentTypeObj?.label || 'សម្ភារឧបទេស',
      selectedSubject,
      selectedGrade,
      lessonTitle,
      subTopic,
      materialsContent,
      teacherInfo.schoolName
    );
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  const handleDownloadMaterialsHtml = () => {
    const currentTypeObj = TEACHING_MATERIAL_TYPES.find((t) => t.id === materialType);
    const html = generateTeachingMaterialsPrintHtml(
      currentTypeObj?.label || 'សម្ភារឧបទេស',
      selectedSubject,
      selectedGrade,
      lessonTitle,
      subTopic,
      materialsContent,
      teacherInfo.schoolName
    );
    downloadFile(
      html,
      `សម្ភារឧបទេស_${materialType}_${selectedSubject.slice(0, 10)}_${selectedGrade}.html`,
      'text/html'
    );
  };

  const handleDownloadMaterialsWord = () => {
    const currentTypeObj = TEACHING_MATERIAL_TYPES.find((t) => t.id === materialType);
    const formattedBody = (materialsContent || '')
      .replace(/\$\$(.*?)\$\$/g, '<div style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-size: 11pt; text-align: center; margin: 4pt 0;">$1</div>')
      .replace(/\$(.*?)\$/g, '<span style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-size: 11pt; font-style: italic;">$1</span>')
      .replace(/²/g, '<sup style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-weight: bold;">2</sup>')
      .replace(/³/g, '<sup style="font-family: \'Times New Roman\', \'Cambria Math\', serif; font-weight: bold;">3</sup>')
      .replace(/Δ/g, '<span style="font-family: \'Times New Roman\', \'Cambria Math\', serif;">&Delta;</span>')
      .replace(/π/g, '<span style="font-family: \'Times New Roman\', \'Cambria Math\', serif;">&pi;</span>')
      .replace(/\n/g, '<br/>');

    const wordContent = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>សម្ភារឧបទេសបង្រៀន</title>
    <style>
      body { font-family: 'Khmer OS Siemreap', 'Kantumruy Pro', Arial, sans-serif; font-size: 11pt; line-height: 1.6; }
      .math, .mathtype { font-family: 'Times New Roman', 'Cambria Math', serif; font-style: italic; }
    </style>
    </head>
    <body>
    <div style="text-align: center; font-weight: bold; font-size: 14pt;">សម្ភារឧបទេសបង្រៀន (Teaching Aids - ${currentTypeObj?.label || ''})</div>
    <div style="text-align: center; font-size: 11pt;">មុខវិជ្ជា៖ ${selectedSubject} | កម្រិតថ្នាក់៖ ${selectedGrade} | ${lessonTitle}</div>
    <hr/>
    ${formattedBody}
    </body></html>`;
    downloadFile(
      wordContent,
      `សម្ភារឧបទេស_${materialType}_${selectedSubject.slice(0, 10)}_${selectedGrade}.doc`,
      'application/msword'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh] my-2 sm:my-4 animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-moul text-xs sm:text-sm tracking-wide text-white flex items-center gap-2">
                <span>ឧបករណ៍ជំនួយគរុកោសល្យគ្រូបង្រៀន (Teacher Pedagogical Suite)</span>
              </h3>
              <p className="text-[11px] text-indigo-200 mt-0.5">
                ជ្រើសរើសមុខវិជ្ជា រើសមេរៀនតាមកម្មវិធីសិក្សាជាតិ និងបង្កើតសន្លឹកកិច្ចការ ឬសម្ភារឧបទេស
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="បិទ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Tab Bar: Worksheet vs Teaching Aids */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-2 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
          <div className="inline-flex p-1 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveTab('worksheet')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'worksheet'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>១. បង្កើតសន្លឹកកិច្ចការសិស្ស (Student Worksheet)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'materials'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>២. បង្កើតសម្ភារៈឩទេស (Teaching Aids Generator)</span>
            </button>
          </div>

          {/* Quick preset selector and MathType font indicator */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="hidden sm:inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 px-2.5 py-1 rounded-md text-[10.5px] font-serif font-medium">
              <span>📐 Font គណិតវិទ្យា៖</span>
              <strong className="italic font-bold">MathType</strong>
              <span className="text-[10px] text-slate-500">(Times New Roman & Cambria Math)</span>
            </span>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden lg:inline">
                គំរូមេរៀនរហ័ស៖
              </span>
              <select
                aria-label="ជ្រើសរើសគំរូមេរៀនរហ័ស"
                onChange={(e) => {
                  if (e.target.value) handleSelectPreset(e.target.value);
                }}
                className="text-[11px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md px-2 py-1 max-w-[180px] truncate focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">-- រើសគំរូមេរៀនរហ័ស --</option>
                {COMPREHENSIVE_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* ========================================================
              UNIFIED SECTION: SUBJECT & LESSON SELECTOR
             ======================================================== */}
          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>ជ្រើសរើសកម្រិតថ្នាក់ មុខវិជ្ជា និងមេរៀន (Curriculum Lesson Selector)</span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  រកឃើញ <strong className="text-indigo-600 dark:text-indigo-400">{availableLessons.length}</strong> មេរៀនផ្លូវការក្នុងកម្មវិធីសិក្សា
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllLessons((prev) => !prev)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-lg text-[11px] font-bold transition cursor-pointer"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>{showAllLessons ? 'បិទមើលគ្រប់មេរៀន' : 'មើលគ្រប់មេរៀនទាំងអស់'}</span>
                  {showAllLessons ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* 3 Main Selectors: Grade, Subject, Lesson Dropdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* 1. Grade */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  🎓 កម្រិតថ្នាក់ (Grade)
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => handleGradeChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  <optgroup label="🎒 បឋមសិក្សា">
                    {PRIMARY_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="📚 អនុវិទ្យាល័យ">
                    {LOWER_SECONDARY_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="🎓 វិទ្យាល័យ">
                    {UPPER_SECONDARY_GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* 2. Subject */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  📚 មុខវិជ្ជា (Subject)
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium"
                >
                  {availableSubjects.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Official Lesson Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  📖 ជ្រើសរើសមេរៀនផ្លូវការ (Curriculum Lesson)
                </label>
                <select
                  aria-label="ជ្រើសរើសមេរៀនតាមកម្មវិធីសិក្សាជាតិ"
                  value={selectedLessonId}
                  onChange={(e) => handleLessonChange(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-indigo-300 dark:border-indigo-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold text-indigo-950 dark:text-indigo-200 truncate"
                >
                  <option value="">-- រើសមេរៀនតាមកម្មវិធីសិក្សាជាតិ ({availableLessons.length} មេរៀន) --</option>
                  {Array.from(new Set(availableLessons.map((l) => l.chapter))).map((ch) => (
                    <optgroup key={ch} label={ch}>
                      {availableLessons
                        .filter((l) => l.chapter === ch)
                        .map((les) => (
                          <option key={les.id} value={les.id}>
                            {les.lessonTitle} ({les.subTopic.slice(0, 45)}...)
                          </option>
                        ))}
                    </optgroup>
                  ))}
                  <option value="custom">✍️ បញ្ចូលជំពូក & មេរៀនដោយខ្លួនឯង...</option>
                </select>
              </div>
            </div>

            {/* Quick Lesson Selection Chips & Search Filter */}
            {availableLessons.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-500" />
                    <span>មេរៀនរហ័ស ({availableLessons.length})៖</span>
                  </span>
                  {availableLessons.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => handleLessonChange(l.id)}
                      className={`px-2.5 py-1 rounded-md text-[11px] transition cursor-pointer border ${
                        selectedLessonId === l.id
                          ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-xs'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={`${l.chapter} - ${l.lessonTitle}: ${l.subTopic}`}
                    >
                      {l.lessonTitle.length > 32 ? l.lessonTitle.slice(0, 32) + '...' : l.lessonTitle}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Full Visual Lesson Browser (Expandable Cards) */}
            {showAllLessons && (
              <div className="bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-3 space-y-2.5 shadow-xs animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      📚 បញ្ជីមេរៀនទាំងអស់ក្នុងមុខវិជ្ជា {selectedSubject} ({selectedGrade})
                    </span>
                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      ស្តង់ដារក្រសួងអប់រំ MoEYS
                    </span>
                  </div>
                  {/* Search bar inside browser */}
                  <div className="relative min-w-[200px] max-w-[280px]">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={lessonSearch}
                      onChange={(e) => setLessonSearch(e.target.value)}
                      placeholder="ស្វែងរកមេរៀន ឬជំពូក..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {lessonSearch && (
                      <button
                        type="button"
                        onClick={() => setLessonSearch('')}
                        className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Lesson cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {filteredLessons.map((l) => {
                    const isSelected = selectedLessonId === l.id;
                    return (
                      <div
                        key={l.id}
                        onClick={() => handleLessonChange(l.id)}
                        className={`p-3 rounded-lg border transition cursor-pointer text-left ${
                          isSelected
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-400'
                            : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100/80 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1.5 mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {l.chapter}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-0.5">
                              <CheckCircle className="w-3 h-3" />
                              <span>បានរើស</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight mb-1">
                          {l.lessonTitle}
                        </h4>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                          {l.subTopic}
                        </p>
                        {l.suggestedMaterials && l.suggestedMaterials.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            <span className="text-[10px] text-slate-500 font-medium">សម្ភារៈឧបទេស៖</span>
                            {l.suggestedMaterials.slice(0, 3).map((mat, idx) => (
                              <span
                                key={idx}
                                className="text-[9.5px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400"
                              >
                                {mat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Currently Selected Lesson Details Banner */}
            {currentLesson && (
              <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-lg p-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="text-[11px] space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-950 dark:text-indigo-200">
                      🎯 មេរៀនដែលបានជ្រើសរើស៖ {currentLesson.lessonTitle}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">({currentLesson.chapter})</span>
                  </div>
                  {currentLesson.suggestedMaterials && currentLesson.suggestedMaterials.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap text-[10.5px] text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">សម្ភារៈឧបទេសណែនាំ៖</span>
                      {currentLesson.suggestedMaterials.map((mat, i) => (
                        <span key={i} className="bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-indigo-100 dark:border-indigo-900 text-indigo-900 dark:text-indigo-200">
                          {mat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Editable Chapter, Lesson Title & SubTopic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ជំពូក (Chapter)
                </label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="ឧ. ជំពូកទី៣៖ ទែម៉ូឌីណាមិច"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ចំណងជើងមេរៀន (Lesson Title)
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  placeholder="ឧ. មេរៀនទី១៖ សីតុណ្ហភាព និងកម្តៅ"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ប្រធានបទរង ឬខ្លឹមសារស្នូល (Subtopic)
                </label>
                <input
                  type="text"
                  value={subTopic}
                  onChange={(e) => setSubTopic(e.target.value)}
                  placeholder="ឧ. ការបំប្លែងខ្នាតសីតុណ្ហភាព (Celsius, Fahrenheit, Kelvin)"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ========================================================
              TAB 1: STUDENT WORKSHEET GENERATOR
             ======================================================== */}
          {activeTab === 'worksheet' && (
            <div className="space-y-4">
              {/* Worksheet Specific Options */}
              <div className="bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5 text-xs">
                    <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>ជម្រើសទម្រង់សន្លឹកកិច្ចការសិស្ស</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      💡 យុទ្ធវិធី / ប្រភេទសន្លឹកកិច្ចការ
                    </label>
                    <select
                      value={worksheetType}
                      onChange={(e) => setWorksheetType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium"
                    >
                      {WORKSHEET_TYPES.map((t) => (
                        <option key={t.id} value={t.label}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      📝 ចំនួនសំណួរ / លំហាត់
                    </label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none font-medium"
                    >
                      {QUESTION_COUNTS.map((q) => (
                        <option key={q.value} value={q.value}>
                          {q.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Trigger Button */}
                <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    ✨ រៀបចំជាសន្លឹកកិច្ចការមានក្បាលសាលា សំណួរ និងកន្លែងសរសេរចម្លើយស្អាត
                  </span>
                  <button
                    type="button"
                    onClick={generateWorksheet}
                    disabled={isLoadingWorksheet}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg font-bold shadow-xs text-xs inline-flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className={`w-4 h-4 ${isLoadingWorksheet ? 'animate-spin' : ''}`} />
                    <span>
                      {isLoadingWorksheet
                        ? 'កំពុងបង្កើតសន្លឹកកិច្ចការ...'
                        : worksheetContent
                        ? 'បង្កើតសន្លឹកកិច្ចការឡើងវិញ'
                        : 'បង្កើតសន្លឹកកិច្ចការដោយ AI ឥឡូវនេះ'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingWorksheet && (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold text-sm">
                    កំពុងរៀបចំសន្លឹកកិច្ចការសិស្សតាមស្តង់ដារក្រសួង...
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    {selectedSubject} ({selectedGrade}) — {subTopic || lessonTitle}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!worksheetContent && !isLoadingWorksheet && (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 text-sm">
                    មិនទាន់បានបង្កើតសន្លឹកកិច្ចការ
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-3 text-xs leading-relaxed">
                    សូមជ្រើសរើសមុខវិជ្ជា និងមេរៀនខាងលើ រួចចុចប៊ូតុង{' '}
                    <strong>«បង្កើតសន្លឹកកិច្ចការដោយ AI ឥឡូវនេះ»</strong>
                  </p>
                </div>
              )}

              {/* Generated Content Box */}
              {worksheetContent && !isLoadingWorksheet && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setWorksheetViewMode('preview')}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                          worksheetViewMode === 'preview'
                            ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ទិដ្ឋភាពសន្លឹកកិច្ចការ (Preview)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWorksheetViewMode('edit')}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                          worksheetViewMode === 'edit'
                            ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>កែសម្រួលអត្ថបទ (Edit)</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleCopyText(worksheetContent)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition font-medium cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'បានចម្លង!' : 'ចម្លងអត្ថបទ'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrintWorksheet}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 rounded-md transition font-bold cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>បោះពុម្ព / PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadWorksheetWord}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-md transition font-bold cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Word (.doc)</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadWorksheetHtml}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-md transition font-bold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>HTML</span>
                      </button>
                    </div>
                  </div>

                  {worksheetViewMode === 'preview' && (
                    <div className="bg-white rounded-xl border border-slate-300 p-5 sm:p-7 shadow-xs text-slate-900 space-y-4 max-h-[460px] overflow-y-auto">
                      <div className="text-center border-b-2 border-slate-900 pb-3">
                        <div className="font-moul text-xs text-slate-900">
                          ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ
                        </div>
                        <div className="font-bold text-xs mt-1 text-slate-800">
                          {teacherInfo.schoolName}
                        </div>
                        <div className="font-moul text-sm text-indigo-900 mt-2">
                          សន្លឹកកិច្ចការសិស្ស (Student Worksheet)
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          មុខវិជ្ជា៖ <strong>{selectedSubject}</strong> | កម្រិតថ្នាក់៖{' '}
                          <strong>{selectedGrade}</strong> | {lessonTitle || subTopic}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs">
                        <div>
                          <strong>ឈ្មោះក្រុម/សិស្ស៖</strong> ....................................................
                        </div>
                        <div className="sm:text-right">
                          <strong>កាលបរិច្ឆេទ៖</strong> {teacherInfo.date || 'ថ្ងៃទី.....ខែ.....ឆ្នាំ២០២៦'}
                        </div>
                        <div>
                          <strong>សមាជិកក្រុម៖</strong> ....................................................
                        </div>
                        <div className="sm:text-right">
                          <span className="border border-slate-900 px-2 py-0.5 font-bold rounded">
                            ពិន្ទុវាយតម្លៃ៖ ......./១០
                          </span>
                        </div>
                      </div>

                      <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800 pt-2 font-khmer">
                        <MathText text={worksheetContent} />
                      </div>
                    </div>
                  )}

                  {worksheetViewMode === 'edit' && (
                    <div>
                      <textarea
                        value={worksheetContent}
                        onChange={(e) => setWorksheetContent(e.target.value)}
                        rows={16}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-4 font-khmer text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-100"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                        💡 លោកគ្រូអ្នកគ្រូអាចកែប្រែ ឬបន្ថែមសំណួរផ្ទាល់ក្នុងប្រអប់ខាងលើនេះបាន។
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              TAB 2: TEACHING AIDS GENERATOR (បង្កើតសម្ភារៈឩទេស)
             ======================================================== */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              {/* Teaching Material Options */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-xl p-3.5 sm:p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5 text-xs">
                    <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>ជ្រើសរើសប្រភេទសម្ភារៈឩទេស និងគោលដៅប្រើប្រាស់</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Material Type */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      🎨 ប្រភេទសម្ភារឧបទេស (Teaching Aid Type)
                    </label>
                    <select
                      value={materialType}
                      onChange={(e) => setMaterialType(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-semibold text-emerald-950 dark:text-emerald-200"
                    >
                      {TEACHING_MATERIAL_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      🎯 គោលដៅប្រើប្រាស់
                    </label>
                    <select
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg p-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-medium"
                    >
                      {TARGET_AUDIENCE_OPTIONS.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sub Description */}
                <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-900/60 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-start gap-2">
                  <Scissors className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    {TEACHING_MATERIAL_TYPES.find((t) => t.id === materialType)?.description}
                  </span>
                </div>

                {/* Trigger Button */}
                <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      ចំនួនធាតុ/ប័ណ្ណ៖
                    </span>
                    <select
                      value={materialItemCount}
                      onChange={(e) => setMaterialItemCount(Number(e.target.value))}
                      className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md px-2 py-1 text-[11px]"
                    >
                      {ITEM_COUNT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={generateTeachingMaterials}
                    disabled={isLoadingMaterials}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg font-bold shadow-xs text-xs inline-flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className={`w-4 h-4 ${isLoadingMaterials ? 'animate-spin' : ''}`} />
                    <span>
                      {isLoadingMaterials
                        ? 'កំពុងរៀបចំសម្ភារឧបទេស...'
                        : materialsContent
                        ? 'បង្កើតសម្ភារឧបទេសឡើងវិញ'
                        : 'បង្កើតសម្ភារៈឩទេសដោយ AI ឥឡូវនេះ'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Loading State */}
              {isLoadingMaterials && (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <div className="text-slate-800 dark:text-slate-200 font-bold text-sm">
                    កំពុងរៀបចំសម្ភារឧបទេសបង្រៀន...
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    {TEACHING_MATERIAL_TYPES.find((t) => t.id === materialType)?.label} — {subTopic || lessonTitle}
                  </p>
                </div>
              )}

              {/* Empty State */}
              {!materialsContent && !isLoadingMaterials && (
                <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 text-sm">
                    មិនទាន់បានបង្កើតសម្ភារឧបទេស
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-3 text-xs leading-relaxed">
                    ជ្រើសរើសប្រភេទសម្ភារៈឩទេស (Flashcards, ផ្ទាំងគំនូរបំព្រួញ, ប័ណ្ណក្រុម, ឬការណែនាំពិសោធន៍) រួចចុច{' '}
                    <strong>«បង្កើតសម្ភារៈឩទេសដោយ AI ឥឡូវនេះ»</strong>
                  </p>
                </div>
              )}

              {/* Generated Materials Content */}
              {materialsContent && !isLoadingMaterials && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => setMaterialsViewMode('preview')}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                          materialsViewMode === 'preview'
                            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>ទិដ្ឋភាពសម្ភារ (Preview)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMaterialsViewMode('edit')}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                          materialsViewMode === 'edit'
                            ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>កែសម្រួលអត្ថបទ (Edit)</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {onUpdatePlan && (
                        <button
                          type="button"
                          onClick={handleSaveMaterialsToPlan}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-md transition font-semibold cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{savedToPlanNotice ? '✓ បានបញ្ចូលទៅក្នុងកិច្ចតែងការ' : 'បញ្ចូលទៅកិច្ចតែងការ'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleCopyText(materialsContent)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition font-medium cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'បានចម្លង!' : 'ចម្លង'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePrintMaterials}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800 rounded-md transition font-bold cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>បោះពុម្ព / PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadMaterialsWord}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-md transition font-bold cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Word</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDownloadMaterialsHtml}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 rounded-md transition font-bold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>HTML</span>
                      </button>
                    </div>
                  </div>

                  {materialsViewMode === 'preview' && (
                    <div className="bg-white rounded-xl border border-slate-300 p-5 sm:p-7 shadow-xs text-slate-900 space-y-4 max-h-[460px] overflow-y-auto">
                      <div className="text-center border-b-2 border-slate-900 pb-3">
                        <div className="font-moul text-xs text-slate-900">
                          ព្រះរាជាណាចក្រកម្ពុជា ជាតិ សាសនា ព្រះមហាក្សត្រ
                        </div>
                        <div className="font-bold text-xs mt-1 text-slate-800">
                          {teacherInfo.schoolName}
                        </div>
                        <div className="font-moul text-sm text-emerald-800 mt-2">
                          សម្ភារឧបទេសបង្រៀន (Teaching Aids & Materials)
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                          មុខវិជ្ជា៖ <strong>{selectedSubject}</strong> | កម្រិតថ្នាក់៖{' '}
                          <strong>{selectedGrade}</strong> | {lessonTitle || subTopic}
                        </div>
                      </div>

                      <div className="whitespace-pre-line text-xs leading-relaxed text-slate-800 pt-1 font-khmer">
                        <MathText text={materialsContent} />
                      </div>
                    </div>
                  )}

                  {materialsViewMode === 'edit' && (
                    <div>
                      <textarea
                        value={materialsContent}
                        onChange={(e) => setMaterialsContent(e.target.value)}
                        rows={16}
                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-4 font-khmer text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-800 dark:text-slate-100"
                      />
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                        💡 លោកគ្រូអ្នកគ្រូអាចកែសម្រួលខ្លឹមសារសម្ភារឧបទេសបានតាមតម្រូវការជាក់ស្តែង។
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition cursor-pointer"
          >
            បិទ
          </button>

          <div className="flex items-center gap-2">
            {activeTab === 'worksheet' && worksheetContent && (
              <>
                <button
                  type="button"
                  onClick={handlePrintWorksheet}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>បោះពុម្ព / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadWorksheetHtml}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ទាញយក HTML</span>
                </button>
              </>
            )}

            {activeTab === 'materials' && materialsContent && (
              <>
                <button
                  type="button"
                  onClick={handlePrintMaterials}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>បោះពុម្ព / Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMaterialsHtml}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ទាញយក HTML</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
