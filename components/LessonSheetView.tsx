'use client';

import React, { useState, useRef } from 'react';
import {
  Download,
  Printer,
  FileText,
  Copy,
  Check,
  Edit3,
  Eye,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Image as ImageIcon,
  Award,
  Star,
  X,
  ExternalLink,
  Zap,
  Upload,
  UploadCloud,
  FolderUp,
  ImagePlus,
  Wand2,
  Layers,
  Link as LinkIcon,
  Info,
  Loader2,
} from 'lucide-react';
import { LessonPlanData, Step3Activity, Step3Exercise } from '@/types/lesson-plan';
import { generateStandaloneLessonPlanHTML, generateStandaloneWordDoc, downloadFile } from '@/lib/export-html';
import { getStepIllustrations, AVAILABLE_DIAGRAMS_CATALOG } from '@/lib/step-illustrations';
import { MathText, MathToolbar } from '@/components/MathText';
import { PrintPdfModal } from '@/components/PrintPdfModal';

interface LessonSheetViewProps {
  plan: LessonPlanData;
  onUpdatePlan: (updated: LessonPlanData) => void;
  onEnhanceSection?: (sectionName: string, currentContent: string) => Promise<string | null>;
  onOpenPrintModal?: () => void;
  onOpenWorksheetModal?: (tab?: 'worksheet' | 'materials') => void;
}

export function LessonSheetView({
  plan,
  onUpdatePlan,
  onEnhanceSection,
  onOpenPrintModal,
  onOpenWorksheetModal,
}: LessonSheetViewProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [copied, setCopied] = useState(false);
  const [enhancingKey, setEnhancingKey] = useState<string | null>(null);
  const [imageModalStep, setImageModalStep] = useState<string | null>(null);
  const [imageModalTab, setImageModalTab] = useState<'upload' | 'ai' | 'catalog' | 'url'>('upload');
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const [tempImageCaption, setTempImageCaption] = useState<string>('');
  const [isGeneratingAiDiagram, setIsGeneratingAiDiagram] = useState<boolean>(false);
  const [aiDiagramError, setAiDiagramError] = useState<string | null>(null);
  const [catalogSubjectFilter, setCatalogSubjectFilter] = useState<string>('all');
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadFileSize, setUploadFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [printBlobUrl, setPrintBlobUrl] = useState<string>('');
  const [showMathToolbar, setShowMathToolbar] = useState<boolean>(false);

  const { teacherInfo, generalInfo, objectives, materials, steps, assessment, selfReflection } =
    plan;

  const isMathSubject = (generalInfo?.subject || '').includes('គណិត');

  // Open Image modal
  const openImageModal = (stepKey: string, currentUrl?: string, currentCaption?: string) => {
    setImageModalStep(stepKey);
    setTempImageUrl(currentUrl || '');
    setTempImageCaption(currentCaption || '');
    setUploadFileName('');
    setUploadFileSize('');
    setAiDiagramError(null);
    setImageModalTab(currentUrl ? 'upload' : 'upload');

    // Default catalog filter to match current lesson's subject
    const subj = (generalInfo?.subject || '').toLowerCase();
    if (subj.includes('គណិត')) {
      setCatalogSubjectFilter('គណិតវិទ្យា');
    } else if (subj.includes('រូប')) {
      setCatalogSubjectFilter('រូបវិទ្យា');
    } else if (subj.includes('គីមី')) {
      setCatalogSubjectFilter('គីមីវិទ្យា');
    } else if (subj.includes('ជីវ')) {
      setCatalogSubjectFilter('ជីវវិទ្យា');
    } else if (subj.includes('ផែនដី') || subj.includes('ភូមិ')) {
      setCatalogSubjectFilter('ផែនដីវិទ្យា / ភូមិវិទ្យា');
    } else if (subj.includes('ខ្មែរ')) {
      setCatalogSubjectFilter('ភាសាខ្មែរ');
    } else {
      setCatalogSubjectFilter('all');
    }
  };

  const getStepName = (stepKey: string | null) => {
    if (!stepKey) return '';
    if (stepKey === 'step1') return 'ជំហានទី១៖ រដ្ឋបាលថ្នាក់';
    if (stepKey === 'step2') return 'ជំហានទី២៖ រំឭកមេរៀនចាស់';
    if (stepKey === 'step3') return 'ជំហានទី៣៖ មេរៀនថ្មី & PISA';
    if (stepKey === 'step4') return 'ជំហានទី៤៖ ពង្រឹងចំណេះដឹង';
    if (stepKey === 'step5') return 'ជំហានទី៥៖ កិច្ចការផ្ទះ & បណ្តាំផ្ញើ';
    if (stepKey.startsWith('step3_act_')) {
      const idx = parseInt(stepKey.replace('step3_act_', ''), 10);
      return `សកម្មភាពទី ${idx + 1} នៃជំហានទី៣`;
    }
    return stepKey;
  };

  const getStepContent = (stepKey: string | null) => {
    if (!stepKey) return '';
    if (stepKey === 'step1') return steps.step1.content;
    if (stepKey === 'step2') return steps.step2.content;
    if (stepKey === 'step3') return steps.step3.map((a, i) => `សកម្មភាព ${i + 1} (${a.activityTitle}): ${a.content}`).join('\n\n');
    if (stepKey === 'step4') return steps.step4.content;
    if (stepKey === 'step5') return steps.step5.content;
    if (stepKey.startsWith('step3_act_')) {
      const idx = parseInt(stepKey.replace('step3_act_', ''), 10);
      return steps.step3[idx]?.content || '';
    }
    return '';
  };

  const saveImageModal = () => {
    if (!imageModalStep) return;
    const stepKey = imageModalStep;
    const cleanUrl = tempImageUrl.trim() || undefined;
    const cleanCap = tempImageCaption.trim() || undefined;

    if (stepKey === 'step1') {
      onUpdatePlan({ ...plan, steps: { ...steps, step1: { ...steps.step1, imageUrl: cleanUrl, imageCaption: cleanCap } } });
    } else if (stepKey === 'step2') {
      onUpdatePlan({ ...plan, steps: { ...steps, step2: { ...steps.step2, imageUrl: cleanUrl, imageCaption: cleanCap } } });
    } else if (stepKey === 'step3') {
      onUpdatePlan({ ...plan, steps: { ...steps, step3ImageUrl: cleanUrl, step3ImageCaption: cleanCap } });
    } else if (stepKey.startsWith('step3_act_')) {
      const actIdx = parseInt(stepKey.replace('step3_act_', ''), 10);
      const acts = [...steps.step3];
      if (acts[actIdx]) {
        acts[actIdx] = { ...acts[actIdx], imageUrl: cleanUrl, imageCaption: cleanCap };
        onUpdatePlan({ ...plan, steps: { ...steps, step3: acts } });
      }
    } else if (stepKey === 'step4') {
      onUpdatePlan({ ...plan, steps: { ...steps, step4: { ...steps.step4, imageUrl: cleanUrl, imageCaption: cleanCap } } });
    } else if (stepKey === 'step5') {
      onUpdatePlan({ ...plan, steps: { ...steps, step5: { ...steps.step5, imageUrl: cleanUrl, imageCaption: cleanCap } } });
    }
    setImageModalStep(null);
  };

  const removeStepImage = (stepKey: string) => {
    if (stepKey === 'step1') {
      onUpdatePlan({ ...plan, steps: { ...steps, step1: { ...steps.step1, imageUrl: undefined, imageCaption: undefined } } });
    } else if (stepKey === 'step2') {
      onUpdatePlan({ ...plan, steps: { ...steps, step2: { ...steps.step2, imageUrl: undefined, imageCaption: undefined } } });
    } else if (stepKey === 'step3') {
      onUpdatePlan({ ...plan, steps: { ...steps, step3ImageUrl: undefined, step3ImageCaption: undefined } });
    } else if (stepKey.startsWith('step3_act_')) {
      const actIdx = parseInt(stepKey.replace('step3_act_', ''), 10);
      const acts = [...steps.step3];
      if (acts[actIdx]) {
        acts[actIdx] = { ...acts[actIdx], imageUrl: undefined, imageCaption: undefined };
        onUpdatePlan({ ...plan, steps: { ...steps, step3: acts } });
      }
    } else if (stepKey === 'step4') {
      onUpdatePlan({ ...plan, steps: { ...steps, step4: { ...steps.step4, imageUrl: undefined, imageCaption: undefined } } });
    } else if (stepKey === 'step5') {
      onUpdatePlan({ ...plan, steps: { ...steps, step5: { ...steps.step5, imageUrl: undefined, imageCaption: undefined } } });
    }
  };

  // Upload file processor with client-side image scaling to preserve A4 crispness without memory bloat
  const handleImageFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    setUploadFileName(file.name);
    setUploadFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    if (file.type === 'image/svg+xml' || file.size < 300 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setTempImageUrl(result);
        if (!tempImageCaption) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          setTempImageCaption(`រូបភាពឧបទេស៖ ${cleanName}`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // High-res photo optimization (scale max dimension to 1200px at 85% quality)
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_DIM = 1200;
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setTempImageUrl(optimizedDataUrl);
          if (!tempImageCaption) {
            const cleanName = file.name.replace(/\.[^/.]+$/, '');
            setTempImageCaption(`រូបភាពឧបទេស៖ ${cleanName}`);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate AI diagram tailored to current lesson
  const handleGenerateAiDiagram = async () => {
    if (!imageModalStep) return;
    setIsGeneratingAiDiagram(true);
    setAiDiagramError(null);
    try {
      const res = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: generalInfo.subject,
          grade: generalInfo.grade,
          chapter: generalInfo.chapter,
          lessonTitle: generalInfo.lessonTitle,
          subTopic: generalInfo.subTopic,
          stepKey: imageModalStep,
          stepName: getStepName(imageModalStep),
          content: getStepContent(imageModalStep),
          objectives: objectives.knowledge,
        }),
      });
      const data = await res.json();
      if (data.success && data.dataUri) {
        setTempImageUrl(data.dataUri);
        setTempImageCaption(data.caption || `ដ្យាក្រាមគរុកោសល្យ៖ ${generalInfo.subTopic || generalInfo.lessonTitle}`);
      } else {
        // Fallback to intelligent offline template
        resetToDefaultDiagram();
        setAiDiagramError(data.error || 'មិនអាចបង្កើតតាម AI បាន — ប្រព័ន្ធបានប្តូរទៅដ្យាក្រាមគរុកោសល្យឆ្លាតវៃ');
      }
    } catch (err: any) {
      console.warn('AI Diagram error:', err);
      resetToDefaultDiagram();
      setAiDiagramError('ការតភ្ជាប់ទៅកាន់ AI មានបញ្ហា — បានប្តូរទៅដ្យាក្រាមគរុកោសល្យឆ្លាតវៃ');
    } finally {
      setIsGeneratingAiDiagram(false);
    }
  };

  const resetToDefaultDiagram = () => {
    if (!imageModalStep) return;
    const defaultIll = getStepIllustrations(
      generalInfo.subject,
      generalInfo.subTopic,
      generalInfo.lessonTitle,
      generalInfo.chapter,
      objectives.knowledge
    );
    const key = imageModalStep.startsWith('step3') ? 'step3' : imageModalStep;
    const def = (defaultIll as Record<string, any>)[key] || defaultIll.step3;
    if (def) {
      setTempImageUrl(def.url);
      setTempImageCaption(def.caption);
    }
  };

  const applyCatalogDiagram = (svgUrl: string, title: string) => {
    setTempImageUrl(svgUrl);
    setTempImageCaption(title);
  };

  // Step 2 exercises (1 or 2 review exercises)
  const step2Exercises = steps.step2.exercises || [];
  const updateStep2Exercise = (idx: number, val: string) => {
    const list = [...step2Exercises];
    list[idx] = val;
    onUpdatePlan({ ...plan, steps: { ...steps, step2: { ...steps.step2, exercises: list } } });
  };
  const addStep2Exercise = () => {
    const list = [...step2Exercises, `លំហាត់រំឭកទី ${step2Exercises.length + 1}៖ `];
    onUpdatePlan({ ...plan, steps: { ...steps, step2: { ...steps.step2, exercises: list } } });
  };
  const removeStep2Exercise = (idx: number) => {
    onUpdatePlan({
      ...plan,
      steps: { ...steps, step2: { ...steps.step2, exercises: step2Exercises.filter((_, i) => i !== idx) } },
    });
  };

  // Step 3 exercises (1, 2, 3 including PISA)
  const step3Exercises = steps.step3Exercises || [];
  const updateStep3Ex = (idx: number, updatedFields: Partial<Step3Exercise>) => {
    const list = step3Exercises.map((ex, i) => (i === idx ? { ...ex, ...updatedFields } : ex));
    onUpdatePlan({ ...plan, steps: { ...steps, step3Exercises: list } });
  };
  const addStep3Ex = () => {
    const isPisa = step3Exercises.length >= 2;
    const newEx: Step3Exercise = {
      title: isPisa ? `លំហាត់ទី ${step3Exercises.length + 1} (បែប PISA)` : `លំហាត់ទី ${step3Exercises.length + 1}`,
      question: 'សំណួរលំហាត់ថ្មី...',
      isPisa: isPisa,
      solutionHint: 'គន្លឹះដោះស្រាយ...',
    };
    onUpdatePlan({ ...plan, steps: { ...steps, step3Exercises: [...step3Exercises, newEx] } });
  };
  const removeStep3Ex = (idx: number) => {
    onUpdatePlan({
      ...plan,
      steps: { ...steps, step3Exercises: step3Exercises.filter((_, i) => i !== idx) },
    });
  };

  // Step 4 exercises (1 or 2 consolidation exercises)
  const step4Exercises = steps.step4.exercises || [];
  const updateStep4Exercise = (idx: number, val: string) => {
    const list = [...step4Exercises];
    list[idx] = val;
    onUpdatePlan({ ...plan, steps: { ...steps, step4: { ...steps.step4, exercises: list } } });
  };
  const addStep4Exercise = () => {
    const list = [...step4Exercises, `លំហាត់ពង្រឹងទី ${step4Exercises.length + 1}៖ `];
    onUpdatePlan({ ...plan, steps: { ...steps, step4: { ...steps.step4, exercises: list } } });
  };
  const removeStep4Exercise = (idx: number) => {
    onUpdatePlan({
      ...plan,
      steps: { ...steps, step4: { ...steps.step4, exercises: step4Exercises.filter((_, i) => i !== idx) } },
    });
  };

  // HTML Download
  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneLessonPlanHTML(plan);
    const filename = `កិច្ចតែងការ_${generalInfo.subject}_${generalInfo.grade}_${generalInfo.subTopic.slice(0, 20)}.html`;
    downloadFile(htmlContent, filename, 'text/html');
  };

  // Word (.doc) Download - Uses specialized Word HTML table layout to prevent shifting
  const handleDownloadWord = () => {
    const docContent = generateStandaloneWordDoc(plan);
    const filename = `កិច្ចតែងការ_${generalInfo.subject}_${generalInfo.grade}_${generalInfo.subTopic.slice(0, 20)}.doc`;
    downloadFile(docContent, filename, 'application/msword');
  };

  // Copy full text
  const handleCopyText = () => {
    const text = `ព្រះរាជាណាចក្រកម្ពុជា
ជាតិ សាសនា ព្រះមហាក្សត្រ

${teacherInfo.schoolName}
ក្រុមបច្ចេកទេស៖ ${generalInfo.subject}
គ្រូបង្រៀន៖ ${teacherInfo.teacherName}

កិច្ចតែងការបង្រៀន
មុខវិជ្ជា៖ ${generalInfo.subject} | កម្រិតថ្នាក់៖ ${generalInfo.grade}
${generalInfo.chapter}
${generalInfo.lessonTitle}
ប្រធានបទរង៖ ${generalInfo.subTopic}
រយៈពេល៖ ${generalInfo.duration}
វិធីសាស្ត្រ៖ ${generalInfo.methodology}
យុទ្ធវិធី៖ ${generalInfo.strategy}

I. វត្ថុបំណងមេរៀន
១. ចំណេះដឹង៖
${objectives.knowledge.map((k) => `- ${k}`).join('\n')}
២. បំណិន៖
${objectives.skills.map((s) => `- ${s}`).join('\n')}
៣. ចរិយាសម្បទា៖
${objectives.attitude.map((a) => `- ${a}`).join('\n')}

II. សម្ភារឧបទេស
- សម្រាប់គ្រូ៖ ${materials.teacherMaterials.join(', ')}
- សម្រាប់សិស្ស៖ ${materials.studentMaterials.join(', ')}

III. ដំណើរការបង្រៀន និងរៀន
[ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (${steps.step1.time})]
- ខ្លឹមសារ៖ ${steps.step1.content}
- សកម្មភាពគ្រូ៖ ${steps.step1.teacherActivity}
- សកម្មភាពសិស្ស៖ ${steps.step1.studentActivity}

[ជំហានទី២៖ រំឭកមេរៀនចាស់ (${steps.step2.time})]
- ខ្លឹមសារ៖ ${steps.step2.content}
- សកម្មភាពគ្រូ៖ ${steps.step2.teacherActivity}
- សកម្មភាពសិស្ស៖ ${steps.step2.studentActivity}

[ជំហានទី៣៖ មេរៀនថ្មី]
${steps.step3
  .map(
    (act, i) => `
សកម្មភាពទី ${i + 1} (${act.time})៖ ${act.activityTitle}
ខ្លឹមសារ៖ ${act.content}
សកម្មភាពគ្រូ៖ ${act.teacherActivity}
សកម្មភាពសិស្ស៖ ${act.studentActivity}
`
  )
  .join('\n')}

[ជំហានទី៤៖ ពង្រឹងចំណេះដឹង (${steps.step4.time})]
- សកម្មភាពគ្រូ៖ ${steps.step4.teacherActivity}
- សកម្មភាពសិស្ស៖ ${steps.step4.studentActivity}

[ជំហានទី៥៖ កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ (${steps.step5.time})]
- សកម្មភាពគ្រូ៖ ${steps.step5.teacherActivity}
- សកម្មភាពសិស្ស៖ ${steps.step5.studentActivity}

IV. ការវាយតម្លៃ
- ដើមទី៖ ${assessment.diagnostic}
- ដំណើរការ៖ ${assessment.formative}
- ចុងក្រោយ៖ ${assessment.summative}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const triggerIframePrint = (htmlContent: string) => {
    try {
      const existingIframe = document.getElementById('lesson-print-iframe');
      if (existingIframe && existingIframe.parentNode) {
        existingIframe.parentNode.removeChild(existingIframe);
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'lesson-print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '10px';
      iframe.style.height = '10px';
      iframe.style.border = '0';
      iframe.style.opacity = '0.01';
      iframe.style.pointerEvents = 'none';
      iframe.style.zIndex = '-9999';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();

        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (err) {
            console.warn('Iframe print restricted:', err);
          }
        }, 500);
      }
    } catch (e) {
      console.warn('Cannot create print iframe:', e);
    }
  };

  const handlePrint = () => {
    if (onOpenPrintModal) {
      onOpenPrintModal();
    } else {
      setShowPrintModal(true);
    }
  };

  // Helper updates
  const updateKnowledge = (index: number, val: string) => {
    const list = [...objectives.knowledge];
    list[index] = val;
    onUpdatePlan({ ...plan, objectives: { ...objectives, knowledge: list } });
  };

  const addKnowledge = () => {
    onUpdatePlan({
      ...plan,
      objectives: {
        ...objectives,
        knowledge: [...objectives.knowledge, 'ចំណុចវត្ថុបំណងថ្មី...'],
      },
    });
  };

  const removeKnowledge = (index: number) => {
    onUpdatePlan({
      ...plan,
      objectives: {
        ...objectives,
        knowledge: objectives.knowledge.filter((_, i) => i !== index),
      },
    });
  };

  const updateSkills = (index: number, val: string) => {
    const list = [...objectives.skills];
    list[index] = val;
    onUpdatePlan({ ...plan, objectives: { ...objectives, skills: list } });
  };

  const addSkills = () => {
    onUpdatePlan({
      ...plan,
      objectives: {
        ...objectives,
        skills: [...objectives.skills, 'ចំណុចបំណិនថ្មី...'],
      },
    });
  };

  const removeSkills = (index: number) => {
    onUpdatePlan({
      ...plan,
      objectives: {
        ...objectives,
        skills: objectives.skills.filter((_, i) => i !== index),
      },
    });
  };

  const updateAttitude = (index: number, val: string) => {
    const list = [...objectives.attitude];
    list[index] = val;
    onUpdatePlan({ ...plan, objectives: { ...objectives, attitude: list } });
  };

  const addAttitude = () => {
    onUpdatePlan({
      ...plan,
      objectives: {
        ...objectives,
        attitude: [...objectives.attitude, 'ចំណុចចរិយាសម្បទាថ្មី...'],
      },
    });
  };

  const removeAttitude = (index: number) => {
    onUpdatePlan({
      ...plan,
      objectives: {
        ...objectives,
        attitude: objectives.attitude.filter((_, i) => i !== index),
      },
    });
  };

  // Step 3 Activities modification
  const updateStep3Activity = (index: number, updatedFields: Partial<Step3Activity>) => {
    const updatedActivities = steps.step3.map((act, i) =>
      i === index ? { ...act, ...updatedFields } : act
    );
    onUpdatePlan({
      ...plan,
      steps: {
        ...steps,
        step3: updatedActivities,
      },
    });
  };

  const addStep3Activity = () => {
    const newAct: Step3Activity = {
      activityTitle: `សកម្មភាពទី ${steps.step3.length + 1}៖ សកម្មភាពបន្ថែម`,
      time: '៥ នាទី',
      content: 'ខ្លឹមសារសកម្មភាពថ្មី...',
      teacherActivity: '• គ្រូណែនាំ...',
      studentActivity: '• សិស្សអនុវត្ត...',
    };
    onUpdatePlan({
      ...plan,
      steps: {
        ...steps,
        step3: [...steps.step3, newAct],
      },
    });
  };

  const removeStep3Activity = (index: number) => {
    onUpdatePlan({
      ...plan,
      steps: {
        ...steps,
        step3: steps.step3.filter((_, i) => i !== index),
      },
    });
  };

  const triggerEnhance = async (key: string, sectionName: string, currentContent: string, applyFn: (text: string) => void) => {
    if (!onEnhanceSection) return;
    setEnhancingKey(key);
    try {
      const enhanced = await onEnhanceSection(sectionName, currentContent);
      if (enhanced) {
        applyFn(enhanced);
      }
    } finally {
      setEnhancingKey(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 no-print transition-colors duration-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditable(!isEditable)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              isEditable
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isEditable ? <Eye className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditable ? 'បញ្ចប់ការកែ (Done Editing)' : 'កែសម្រួលផ្ទាល់ (Direct Edit)'}</span>
          </button>

          <span className="text-xs text-slate-400 hidden sm:inline">|</span>

          <span className="text-xs text-slate-500 dark:text-slate-400 hidden md:inline">
            {isEditable ? '✏️ អ្នកអាចចុចលើប្រអប់អត្ថបទដើម្បីកែសម្រួលបាន' : '👁️ កំពុងបង្ហាញទម្រង់ផ្លូវការ (សន្លឹក A4 ក្រដាសសច្បាស់)'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenWorksheetModal && (
            <>
              <button
                onClick={() => onOpenWorksheetModal('worksheet')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 transition cursor-pointer"
                title="បង្កើតសន្លឹកកិច្ចការសិស្ស (Student Worksheet)"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>សន្លឹកកិច្ចការ</span>
              </button>

              <button
                onClick={() => onOpenWorksheetModal('materials')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition cursor-pointer"
                title="បង្កើតសម្ភារៈឩទេស (Teaching Aids / Instructional Materials)"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>សម្ភារៈឩទេស</span>
              </button>
            </>
          )}

          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'បានចម្លង!' : 'ចម្លងអត្ថបទ'}</span>
          </button>

          <button
            onClick={handlePrint}
            title="បោះពុម្ព ឬរក្សាទុកជា PDF (A4 MoEYS)"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ព / PDF</span>
          </button>

          <button
            onClick={handleDownloadWord}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 transition"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Word (.doc)</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>HTML</span>
          </button>

          {/* MathType Formula Toolbar Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMathToolbar((prev) => !prev)}
            title="បើក/បិទ របាររូបមន្ត MathType (Cambria Math & Times New Roman)"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
              showMathToolbar || isMathSubject
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-2xs hover:bg-indigo-100'
                : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border-transparent'
            }`}
          >
            <span className="font-serif italic font-bold text-sm leading-none">∑</span>
            <span>MathType Font</span>
            {isMathSubject && (
              <span className="bg-indigo-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-sans font-bold">
                សកម្ម
              </span>
            )}
          </button>
        </div>

        {/* MathType Toolbar when toggled or in Direct Edit mode */}
        {(isEditable || showMathToolbar) && (
          <div className="w-full mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                <span className="font-serif text-sm italic font-bold">📐 MathType</span>
                <span>របាររូបមន្តគណិតវិទ្យា (Cambria Math & Times New Roman)</span>
                <span className="text-[10px] text-slate-500 font-normal font-sans">(ចុចដើម្បីចម្លងរូបមន្ត)</span>
              </span>
              <div className="flex items-center gap-2">
                {copied && (
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                    <Check className="w-3.5 h-3.5" /> បានចម្លងរូបមន្តចូល Clipboard រួចរាល់!
                  </span>
                )}
                {!isEditable && (
                  <button
                    type="button"
                    onClick={() => setShowMathToolbar(false)}
                    className="text-slate-400 hover:text-slate-600 text-[11px] px-1.5 py-0.5 rounded hover:bg-slate-100 transition cursor-pointer"
                  >
                    ✕ បិទ
                  </button>
                )}
              </div>
            </div>
            <MathToolbar
              onInsertSymbol={(sym) => {
                navigator.clipboard.writeText(sym);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
            <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-1 italic flex items-center justify-between">
              <span>💡 ចុចលើរូបមន្ត MathType ខាងលើដើម្បីចម្លង (Copy) រួចចុច Ctrl+V (ឬ Paste) ចូលក្នុងប្រអប់អត្ថបទដែលអ្នកចង់បាន។</span>
              <span className="font-serif text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">✨ Font: Cambria Math / STIX Two Math / Times New Roman</span>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Sheet Paper (A4 Preview) */}
      <div
        id="printable-lesson-sheet"
        className="lesson-sheet bg-white rounded-xl shadow-lg border border-slate-200/80 p-6 sm:p-10 max-w-[900px] mx-auto text-slate-900 transition font-khmer"
      >
        {/* Top Header: Kingdom of Cambodia & School */}
        <div className="flex justify-between items-start border-b border-slate-300 pb-5 mb-6">
          <div className="text-left space-y-1">
            {isEditable ? (
              <input
                type="text"
                value={teacherInfo.schoolName}
                onChange={(e) =>
                  onUpdatePlan({
                    ...plan,
                    teacherInfo: { ...teacherInfo, schoolName: e.target.value },
                  })
                }
                className="font-bold text-slate-900 text-sm border-b border-dashed border-sky-400 focus:outline-none w-full"
              />
            ) : (
              <div className="font-bold text-slate-900 text-sm">{teacherInfo.schoolName}</div>
            )}

            <div className="text-xs font-medium text-slate-700">
              ក្រុមបច្ចេកទេស៖ <strong>{generalInfo.subject}</strong>
            </div>

            <div className="text-xs text-slate-600">
              គ្រូបង្រៀន៖ <strong>{teacherInfo.teacherName}</strong>{' '}
              {teacherInfo.phoneNumber && `(${teacherInfo.phoneNumber})`}
            </div>
          </div>

          <div className="text-center">
            <div className="font-moul text-slate-900 text-sm tracking-wide">
              ព្រះរាជាណាចក្រកម្ពុជា
            </div>
            <div className="font-moul text-slate-800 text-xs mt-1">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </div>
            <div className="text-sky-600 text-xs tracking-widest mt-0.5">៚ ៚ ៚</div>
          </div>
        </div>

        {/* Document Title */}
        <div className="text-center my-5">
          <h1 className="font-moul text-xl sm:text-2xl text-slate-900 tracking-wide mb-1">
            កិច្ចតែងការបង្រៀន
          </h1>
          <p className="text-xs text-sky-700 font-semibold uppercase tracking-wider">
            ស្តង់ដារ ៥ ជំហាន (ក្រសួងអប់រំ យុវជន និងកីឡា)
          </p>
        </div>

        {/* General Info Metadata Grid */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 sm:p-4 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-semibold text-slate-700">មុខវិជ្ជា៖</span>{' '}
            <span className="font-medium text-slate-900">{generalInfo.subject}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">កម្រិតថ្នាក់៖</span>{' '}
            <span className="font-medium text-slate-900">{generalInfo.grade}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">ជំពូក៖</span>{' '}
            <span className="font-medium text-slate-900">{generalInfo.chapter}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">មេរៀន៖</span>{' '}
            <span className="font-medium text-slate-900">{generalInfo.lessonTitle}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-slate-700">ប្រធានបទរង៖</span>{' '}
            {isEditable ? (
              <input
                type="text"
                value={generalInfo.subTopic}
                onChange={(e) =>
                  onUpdatePlan({
                    ...plan,
                    generalInfo: { ...generalInfo, subTopic: e.target.value },
                  })
                }
                className="font-bold text-sky-900 border-b border-dashed border-sky-400 focus:outline-none w-3/4 ml-1"
              />
            ) : (
              <span className="font-bold text-sky-900">{generalInfo.subTopic}</span>
            )}
          </div>
          <div>
            <span className="font-semibold text-slate-700">រយៈពេលបង្រៀន៖</span>{' '}
            <span className="font-medium text-slate-900">{generalInfo.duration}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-700">កាលបរិច្ឆេទ៖</span>{' '}
            <span className="font-medium text-slate-900">{teacherInfo.date}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-slate-700">វិធីសាស្ត្របង្រៀន៖</span>{' '}
            <span className="text-slate-900 font-medium">{generalInfo.methodology}</span>
          </div>
          <div className="sm:col-span-2">
            <span className="font-semibold text-slate-700">យុទ្ធវិធីបង្រៀន៖</span>{' '}
            <span className="text-slate-900 font-medium">{generalInfo.strategy}</span>
          </div>
        </div>

        {/* Section I: Objectives */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-moul text-sm text-slate-900 border-b-2 border-sky-600 pb-1 inline-block">
              I. វត្ថុបំណងមេរៀន (Lesson Objectives)
            </h2>
            {isEditable && onEnhanceSection && (
              <button
                onClick={() =>
                  triggerEnhance(
                    'objectives',
                    'វត្ថុបំណងមេរៀន',
                    `ចំណេះដឹង:\n${objectives.knowledge.join('\n')}\nបំណិន:\n${objectives.skills.join('\n')}\nចរិយាសម្បទា:\n${objectives.attitude.join('\n')}`,
                    () => {}
                  )
                }
                disabled={enhancingKey === 'objectives'}
                className="no-print inline-flex items-center gap-1 text-[11px] text-sky-700 hover:text-sky-900"
              >
                <Sparkles className="w-3 h-3" />
                <span>{enhancingKey === 'objectives' ? 'កំពុងកែសម្រួល...' : 'កែលម្អដោយ AI'}</span>
              </button>
            )}
          </div>

          <div className="space-y-3 text-xs pl-2">
            {/* Knowledge */}
            <div>
              <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                <span>១. ចំណេះដឹង (Knowledge)</span>
                {isEditable && (
                  <button
                    onClick={addKnowledge}
                    className="no-print text-sky-600 hover:text-sky-800 text-[11px] flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> បន្ថែម
                  </button>
                )}
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-800 pl-2">
                {objectives.knowledge.map((k, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="mt-1">•</span>
                    {isEditable ? (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="text"
                          value={k}
                          onChange={(e) => updateKnowledge(i, e.target.value)}
                          className="w-full border border-slate-200 rounded px-2 py-0.5"
                        />
                        <button
                          onClick={() => removeKnowledge(i)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <MathText text={k} />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                <span>២. បំណិន (Skills)</span>
                {isEditable && (
                  <button
                    onClick={addSkills}
                    className="no-print text-sky-600 hover:text-sky-800 text-[11px] flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> បន្ថែម
                  </button>
                )}
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-800 pl-2">
                {objectives.skills.map((s, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="mt-1">•</span>
                    {isEditable ? (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="text"
                          value={s}
                          onChange={(e) => updateSkills(i, e.target.value)}
                          className="w-full border border-slate-200 rounded px-2 py-0.5"
                        />
                        <button
                          onClick={() => removeSkills(i)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <MathText text={s} />
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Attitude */}
            <div>
              <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                <span>៣. ចរិយាសម្បទា (Attitude)</span>
                {isEditable && (
                  <button
                    onClick={addAttitude}
                    className="no-print text-sky-600 hover:text-sky-800 text-[11px] flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> បន្ថែម
                  </button>
                )}
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-800 pl-2">
                {objectives.attitude.map((a, i) => (
                  <li key={i} className="flex items-start gap-1">
                    <span className="mt-1">•</span>
                    {isEditable ? (
                      <div className="flex-1 flex items-center gap-1">
                        <input
                          type="text"
                          value={a}
                          onChange={(e) => updateAttitude(i, e.target.value)}
                          className="w-full border border-slate-200 rounded px-2 py-0.5"
                        />
                        <button
                          onClick={() => removeAttitude(i)}
                          className="text-red-500 hover:text-red-700 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <MathText text={a} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section II: Materials */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h2 className="font-moul text-sm text-slate-900 border-b-2 border-sky-600 pb-1 inline-block">
              II. សម្ភារឧបទេស និងធនធានសិក្សា (Teaching Aids & Materials)
            </h2>
            {onOpenWorksheetModal && (
              <div className="flex items-center gap-1.5 no-print">
                <button
                  type="button"
                  onClick={() => onOpenWorksheetModal('materials')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-md transition shadow-2xs cursor-pointer"
                  title="បង្កើត Flashcards, ផ្ទាំងគំនូរបំព្រួញ, ឬការណែនាំពិសោធន៍"
                >
                  <Layers className="w-3 h-3 text-emerald-600" />
                  <span>បង្កើតសម្ភារៈឩទេស</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenWorksheetModal('worksheet')}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-300 rounded-md transition shadow-2xs cursor-pointer"
                  title="បង្កើតសន្លឹកកិច្ចការសិស្ស"
                >
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>បង្កើតសន្លឹកកិច្ចការ</span>
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pl-2">
            <div className="bg-slate-50/70 p-3 rounded border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">១. សម្រាប់គ្រូ (Teacher)៖</div>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {materials.teacherMaterials.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-50/70 p-3 rounded border border-slate-200">
              <div className="font-bold text-slate-800 mb-1">២. សម្រាប់សិស្ស (Students)៖</div>
              <ul className="list-disc list-inside space-y-1 text-slate-700">
                {materials.studentMaterials.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section III: 5 Steps Teaching Process Table */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-moul text-sm text-slate-900 border-b-2 border-sky-600 pb-1 inline-block">
              III. ដំណើរការបង្រៀន និងរៀន (Teaching and Learning Process)
            </h2>
            {isEditable && (
              <button
                onClick={addStep3Activity}
                className="no-print text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> បន្ថែមសកម្មភាពក្នុងជំហានទី៣
              </button>
            )}
          </div>

          <div className="overflow-x-auto border border-slate-900 rounded-sm">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold border-b border-slate-900">
                  <th className="border-r border-slate-400 p-2.5 text-center w-[33%]">
                    សកម្មភាពគ្រូ
                  </th>
                  <th className="border-r border-slate-400 p-2.5 text-center w-[34%]">
                    ជំហានបង្រៀន និង ខ្លឹមសារមេរៀន
                  </th>
                  <th className="p-2.5 text-center w-[33%]">
                    សកម្មភាពសិស្ស
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-400 text-slate-900">
                {/* Step 1: Admin */}
                <tr className="align-top">
                  {/* Column 1: Teacher Activity */}
                  <td className="border-r border-slate-400 p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step1.teacherActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step1: { ...steps.step1, teacherActivity: e.target.value },
                            },
                          })
                        }
                        rows={4}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step1.teacherActivity} />
                    )}
                  </td>

                  {/* Column 2: Step & Content */}
                  <td className="border-r border-slate-400 p-2.5 font-medium w-[34%]">
                    <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-slate-200">
                      <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                        <span className="font-moul text-xs text-sky-950">ជំហានទី១៖ រដ្ឋបាលថ្នាក់</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full font-semibold text-[10.5px]">
                          {steps.step1.time}
                        </span>
                        {steps.step1.imageUrl ? (
                          <div className="no-print flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openImageModal('step1', steps.step1.imageUrl, steps.step1.imageCaption)}
                              className="text-[10px] text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium transition"
                              title="ប្តូររូបភាព ឬ Upload ថ្មី"
                            >
                              <ImageIcon className="w-3 h-3 text-sky-600" /> រូបភាព/Upload
                            </button>
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => removeStepImage('step1')}
                                className="text-[10px] text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                                title="លុបរូបភាពចេញ"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openImageModal('step1')}
                            className="no-print text-[10px] text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-dashed border-sky-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium transition"
                            title="បន្ថែមរូបភាព ឬ Upload"
                          >
                            <Upload className="w-3 h-3 text-sky-600" />
                            <span>Upload រូបភាព</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditable ? (
                      <textarea
                        value={steps.step1.content}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step1: { ...steps.step1, content: e.target.value },
                            },
                          })
                        }
                        rows={2}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <div className="text-slate-800 leading-relaxed font-normal">
                        <MathText text={steps.step1.content} />
                      </div>
                    )}

                    {/* Step 1 Illustration */}
                    {steps.step1.imageUrl && (
                      <div className="mt-2 p-2 bg-slate-50 border border-slate-300 rounded-lg text-center">
                        <img
                          src={steps.step1.imageUrl}
                          alt={steps.step1.imageCaption || 'ដ្យាក្រាមរដ្ឋបាលថ្នាក់'}
                          className="max-h-28 mx-auto rounded object-contain"
                        />
                        {isEditable ? (
                          <div className="mt-2 text-left bg-white p-2 rounded-lg border-2 border-sky-300 shadow-xs">
                            <label className="text-xs font-bold text-slate-900 block mb-1 flex items-center gap-1">
                              <span className="text-sky-600 font-black">🔍</span>
                              <span>កែសម្រួលចំណងជើងពន្យល់រូបភាព៖</span>
                            </label>
                            <input
                              type="text"
                              value={steps.step1.imageCaption || ''}
                              onChange={(e) =>
                                onUpdatePlan({
                                  ...plan,
                                  steps: {
                                    ...steps,
                                    step1: { ...steps.step1, imageCaption: e.target.value },
                                  },
                                })
                              }
                              placeholder="វាយបញ្ចូលចំណងជើងពន្យល់រូបភាព..."
                              className="w-full text-xs sm:text-sm font-bold text-slate-950 bg-white border border-slate-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm font-bold text-slate-950 mt-2 px-3 py-1.5 bg-white border-2 border-slate-300 rounded-lg inline-flex items-center gap-1.5 shadow-xs max-w-full">
                            <span className="text-sky-700 font-black text-sm shrink-0">🔍</span>
                            <span className="text-slate-950 font-bold">{steps.step1.imageCaption || 'ដ្យាក្រាមរដ្ឋបាលថ្នាក់'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Column 3: Student Activity */}
                  <td className="p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step1.studentActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step1: { ...steps.step1, studentActivity: e.target.value },
                            },
                          })
                        }
                        rows={4}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step1.studentActivity} />
                    )}
                  </td>
                </tr>

                {/* Step 2: Review & Exercises */}
                <tr className="align-top bg-amber-50/20">
                  {/* Column 1: Teacher Activity */}
                  <td className="border-r border-slate-400 p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step2.teacherActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step2: { ...steps.step2, teacherActivity: e.target.value },
                            },
                          })
                        }
                        rows={5}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step2.teacherActivity} />
                    )}
                  </td>

                  {/* Column 2: Step & Content */}
                  <td className="border-r border-slate-400 p-2.5 font-medium w-[34%]">
                    <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-amber-200">
                      <div className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                        <span className="font-moul text-xs text-amber-950">ជំហានទី២៖ រំឭកមេរៀនចាស់</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-semibold text-[10.5px]">
                          {steps.step2.time}
                        </span>
                        {steps.step2.imageUrl ? (
                          <div className="no-print flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openImageModal('step2', steps.step2.imageUrl, steps.step2.imageCaption)}
                              className="text-[10px] text-amber-800 hover:text-amber-950 bg-amber-100/70 hover:bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium transition"
                              title="ប្តូររូបភាព ឬ Upload ថ្មី"
                            >
                              <ImageIcon className="w-3 h-3 text-amber-700" /> រូបភាព/Upload
                            </button>
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => removeStepImage('step2')}
                                className="text-[10px] text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                                title="លុបរូបភាពចេញ"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openImageModal('step2')}
                            className="no-print text-[10px] text-amber-800 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-dashed border-amber-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium transition"
                            title="បន្ថែមរូបភាព ឬ Upload"
                          >
                            <Upload className="w-3 h-3 text-amber-700" />
                            <span>Upload រូបភាព</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditable ? (
                      <textarea
                        value={steps.step2.content}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step2: { ...steps.step2, content: e.target.value },
                            },
                          })
                        }
                        rows={2}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <div className="text-slate-800 leading-relaxed font-normal mb-2">
                        <MathText text={steps.step2.content} />
                      </div>
                    )}

                    {/* Step 2 Diagram / Image */}
                    {steps.step2.imageUrl && (
                      <div className="mt-2 mb-2 p-2 bg-white border border-amber-300 rounded-lg text-center">
                        <img
                          src={steps.step2.imageUrl}
                          alt={steps.step2.imageCaption || 'ដ្យាក្រាមរំឭកមេរៀន'}
                          className="max-h-28 mx-auto rounded object-contain"
                        />
                        {isEditable ? (
                          <div className="mt-2 text-left bg-amber-50 p-2 rounded-lg border-2 border-amber-300 shadow-xs">
                            <label className="text-xs font-bold text-amber-950 block mb-1 flex items-center gap-1">
                              <span className="text-amber-700 font-black">🔍</span>
                              <span>កែសម្រួលចំណងជើងពន្យល់រូបភាព៖</span>
                            </label>
                            <input
                              type="text"
                              value={steps.step2.imageCaption || ''}
                              onChange={(e) =>
                                onUpdatePlan({
                                  ...plan,
                                  steps: {
                                    ...steps,
                                    step2: { ...steps.step2, imageCaption: e.target.value },
                                  },
                                })
                              }
                              placeholder="វាយបញ្ចូលចំណងជើងពន្យល់រូបភាព..."
                              className="w-full text-xs sm:text-sm font-bold text-slate-950 bg-white border border-amber-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                            />
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm font-bold text-slate-950 mt-2 px-3 py-1.5 bg-amber-50 border-2 border-amber-300 rounded-lg inline-flex items-center gap-1.5 shadow-xs max-w-full">
                            <span className="text-amber-800 font-black text-sm shrink-0">🔍</span>
                            <span className="text-slate-950 font-bold">{steps.step2.imageCaption || 'ដ្យាក្រាមរំឭកមេរៀនចាស់'}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 2 Review Exercises Box (1 or 2 exercises) */}
                    <div className="mt-2 p-2 bg-amber-50/90 border border-amber-300 rounded-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
                        <span className="flex items-center gap-1">
                          <span>📝 លំហាត់រំឭកមេរៀនចាស់ (Review)</span>
                        </span>
                        {isEditable && (
                          <button
                            onClick={addStep2Exercise}
                            className="no-print text-amber-700 hover:text-amber-900 text-[10px] font-semibold flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> ថែមលំហាត់
                          </button>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-800">
                        {step2Exercises.map((ex, i) => (
                          <div key={i} className="flex items-start gap-1 bg-white p-1.5 rounded border border-amber-200">
                            <span className="font-bold text-amber-800 text-[11px] shrink-0 mt-0.5">
                              {i + 1}.
                            </span>
                            {isEditable ? (
                              <div className="flex-1 flex items-center gap-1">
                                <input
                                  type="text"
                                  value={ex}
                                  onChange={(e) => updateStep2Exercise(i, e.target.value)}
                                  className="w-full text-xs border border-amber-300 rounded px-1.5 py-0.5"
                                />
                                <button
                                  onClick={() => removeStep2Exercise(i)}
                                  className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <MathText text={ex} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Student Activity */}
                  <td className="p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step2.studentActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step2: { ...steps.step2, studentActivity: e.target.value },
                            },
                          })
                        }
                        rows={5}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step2.studentActivity} />
                    )}
                  </td>
                </tr>

                {/* Step 3: Main Header Banner & 3 Exercises (Including PISA) */}
                <tr className="bg-sky-50/80 border-y-2 border-sky-600">
                  <td colSpan={3} className="p-3 text-left">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div>
                        <span className="font-moul text-xs text-sky-950">
                          ជំហានទី៣៖ មេរៀនថ្មី — {generalInfo.subTopic || generalInfo.lessonTitle}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          (វិធីសាស្ត្រ៖ {generalInfo.methodology} | យុទ្ធវិធី៖ {generalInfo.strategy})
                        </div>
                      </div>
                      {steps.step3ImageUrl ? (
                        <div className="no-print flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              openImageModal('step3', steps.step3ImageUrl, steps.step3ImageCaption)
                            }
                            className="text-[11px] text-sky-800 bg-white hover:bg-sky-50 border border-sky-300 px-2.5 py-1 rounded shadow-xs flex items-center gap-1 font-medium transition"
                            title="ប្តូរដ្យាក្រាម ឬ Upload រូបភាពថ្មី"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-sky-600" />
                            <span>ប្តូរដ្យាក្រាម/Upload រូបភាព</span>
                          </button>
                          {isEditable && (
                            <button
                              type="button"
                              onClick={() => removeStepImage('step3')}
                              className="text-xs text-red-500 hover:text-red-700 p-1 bg-white hover:bg-red-50 rounded border border-red-200"
                              title="លុបរូបភាពជំហានទី៣ចេញ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openImageModal('step3')}
                          className="no-print text-[11px] text-sky-800 bg-white hover:bg-sky-50 border border-dashed border-sky-400 px-2.5 py-1 rounded shadow-xs flex items-center gap-1 font-medium transition"
                          title="បន្ថែមដ្យាក្រាម ឬ Upload រូបភាព"
                        >
                          <Upload className="w-3.5 h-3.5 text-sky-600" />
                          <span>+ Upload រូបភាព/ដ្យាក្រាមជំហានទី៣</span>
                        </button>
                      )}
                    </div>

                    {/* Step 3 Visual & 3 Exercises Grid */}
                    <div className="flex flex-col lg:flex-row gap-3 items-start mt-2">
                      {/* Step 3 Diagram Card */}
                      {steps.step3ImageUrl && (
                        <div className="w-full lg:w-[34%] shrink-0 p-2.5 bg-white rounded-lg border-2 border-sky-300 text-center shadow-xs">
                          <img
                            src={steps.step3ImageUrl}
                            alt={steps.step3ImageCaption || 'ដ្យាក្រាមមេរៀនថ្មី'}
                            className="max-h-36 mx-auto rounded object-contain"
                          />
                          {isEditable ? (
                            <div className="mt-2 text-left bg-sky-50 p-2 rounded-lg border-2 border-sky-300 shadow-xs">
                              <label className="text-xs font-bold text-sky-950 block mb-1 flex items-center gap-1">
                                <span className="text-sky-700 font-black">🔍</span>
                                <span>កែសម្រួលចំណងជើងពន្យល់ដ្យាក្រាម៖</span>
                              </label>
                              <input
                                type="text"
                                value={steps.step3ImageCaption || ''}
                                onChange={(e) =>
                                  onUpdatePlan({
                                    ...plan,
                                    steps: {
                                      ...steps,
                                      step3ImageCaption: e.target.value,
                                    },
                                  })
                                }
                                placeholder="វាយបញ្ចូលចំណងជើងពន្យល់ដ្យាក្រាម..."
                                className="w-full text-xs sm:text-sm font-bold text-slate-950 bg-white border border-sky-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                              />
                            </div>
                          ) : (
                            <div className="text-xs sm:text-sm font-bold text-slate-950 mt-2 px-3 py-1.5 bg-sky-50 border-2 border-sky-300 rounded-lg inline-flex items-center gap-1.5 shadow-xs max-w-full">
                              <span className="text-sky-800 font-black text-sm shrink-0">🔍</span>
                              <span className="text-slate-950 font-bold">{steps.step3ImageCaption || 'ដ្យាក្រាមមេរៀនថ្មី'}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 3 Exercises Container (3 Exercises: Direct, Intermediate, and PISA) */}
                      <div className="flex-1 w-full p-2.5 bg-emerald-50/70 border border-emerald-300 rounded-lg">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                            <span>លំហាត់អនុវត្ត ៣ កម្រិត (រួមទាំងលំហាត់ស្តង់ដារអន្តរជាតិ PISA)</span>
                          </span>
                          {isEditable && (
                            <button
                              onClick={addStep3Ex}
                              className="no-print text-emerald-700 hover:text-emerald-900 text-[10px] font-semibold flex items-center gap-0.5 bg-white px-2 py-0.5 rounded border border-emerald-200"
                            >
                              <Plus className="w-3 h-3" /> ថែមលំហាត់
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {step3Exercises.map((ex, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border text-xs flex flex-col justify-between ${
                                ex.isPisa
                                  ? 'bg-amber-50/95 border-amber-400 ring-1 ring-amber-300 shadow-xs'
                                  : 'bg-white border-slate-200 shadow-xs'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  {isEditable ? (
                                    <input
                                      type="text"
                                      value={ex.title}
                                      onChange={(e) =>
                                        updateStep3Ex(idx, { title: e.target.value })
                                      }
                                      className="font-bold text-[11px] text-slate-900 border rounded px-1 py-0.5 w-full"
                                    />
                                  ) : (
                                    <span className="font-bold text-[11px] text-slate-900">
                                      <MathText text={ex.title} />
                                    </span>
                                  )}
                                  {ex.isPisa && (
                                    <span className="bg-amber-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full shrink-0 flex items-center gap-0.5">
                                      <Star className="w-2.5 h-2.5 fill-white" /> PISA
                                    </span>
                                  )}
                                  {isEditable && (
                                    <button
                                      onClick={() => removeStep3Ex(idx)}
                                      className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                                      title="លុបលំហាត់"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                                {isEditable ? (
                                  <textarea
                                    value={ex.question}
                                    onChange={(e) =>
                                      updateStep3Ex(idx, { question: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full text-[11px] border rounded p-1 mb-1"
                                  />
                                ) : (
                                  <p className="text-[11px] text-slate-800 leading-relaxed">
                                    <MathText text={ex.question} />
                                  </p>
                                )}
                              </div>
                              {ex.solutionHint && (
                                <div className="mt-1 pt-1 border-t border-slate-100 text-[10px] text-slate-600">
                                  {isEditable ? (
                                    <input
                                      type="text"
                                      value={ex.solutionHint}
                                      onChange={(e) =>
                                        updateStep3Ex(idx, { solutionHint: e.target.value })
                                      }
                                      placeholder="គន្លឹះដោះស្រាយ..."
                                      className="w-full text-[10px] border rounded px-1 py-0.5"
                                    />
                                  ) : (
                                    <span>💡 <strong>គន្លឹះ៖</strong> <MathText text={ex.solutionHint} /></span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Step 3: Activities Rows */}
                {steps.step3.map((act, index) => (
                  <tr key={index} className="align-top bg-white">
                    {/* Column 1: Teacher Activity */}
                    <td className="border-r border-slate-400 p-2.5 whitespace-pre-line w-[33%]">
                      {isEditable ? (
                        <textarea
                          value={act.teacherActivity}
                          onChange={(e) =>
                            updateStep3Activity(index, { teacherActivity: e.target.value })
                          }
                          rows={5}
                          className="w-full border rounded p-1 text-xs"
                        />
                      ) : (
                        <MathText text={act.teacherActivity} />
                      )}
                    </td>

                    {/* Column 2: Step & Content */}
                    <td className="border-r border-slate-400 p-2.5 w-[34%]">
                      <div className="flex items-center justify-between gap-1 mb-2 pb-1 border-b border-slate-200">
                        <div className="font-semibold text-sky-800 text-xs">សកម្មភាព {index + 1}</div>
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full font-medium text-[10px]">
                            {act.time}
                          </span>
                          {act.imageUrl ? (
                            <button
                              type="button"
                              onClick={() => openImageModal(`step3_act_${index}`, act.imageUrl, act.imageCaption)}
                              className="no-print text-[9.5px] text-sky-700 hover:text-sky-900 bg-sky-50 border border-sky-200 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                              title="ប្តូររូបភាពសកម្មភាព"
                            >
                              <ImageIcon className="w-2.5 h-2.5" /> រូបភាព
                            </button>
                          ) : isEditable ? (
                            <button
                              type="button"
                              onClick={() => openImageModal(`step3_act_${index}`)}
                              className="no-print text-[9.5px] text-slate-500 hover:text-sky-700 hover:bg-sky-50 px-1.5 py-0.5 rounded border border-dashed border-slate-300 flex items-center gap-0.5"
                              title="ថែមរូបភាពសកម្មភាព"
                            >
                              <Plus className="w-2.5 h-2.5" /> រូប
                            </button>
                          ) : null}
                          {isEditable && steps.step3.length > 1 && (
                            <button
                              onClick={() => removeStep3Activity(index)}
                              className="no-print text-red-500 hover:text-red-700 p-0.5"
                              title="លុបសកម្មភាពនេះ"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {isEditable ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={act.activityTitle}
                            onChange={(e) =>
                              updateStep3Activity(index, { activityTitle: e.target.value })
                            }
                            className="w-full font-bold text-sky-900 border rounded p-1 text-xs"
                          />
                          <textarea
                            value={act.content}
                            onChange={(e) =>
                              updateStep3Activity(index, { content: e.target.value })
                            }
                            rows={3}
                            className="w-full border rounded p-1 text-xs"
                          />
                        </div>
                      ) : (
                        <>
                          <div className="font-bold text-sky-900 mb-1">
                            <MathText text={act.activityTitle} />
                          </div>
                          <div className="whitespace-pre-line text-slate-800 leading-relaxed font-normal">
                            <MathText text={act.content} />
                          </div>
                        </>
                      )}

                      {/* Step 3 Activity Image */}
                      {act.imageUrl && (
                        <div className="mt-2 p-2 bg-sky-50/70 border border-sky-300 rounded-lg text-center">
                          <img
                            src={act.imageUrl}
                            alt={act.imageCaption || 'រូបភាពសកម្មភាព'}
                            className="max-h-28 mx-auto rounded object-contain"
                          />
                          {isEditable ? (
                            <div className="mt-2 text-left bg-white p-2 rounded-lg border-2 border-sky-300 shadow-xs">
                              <label className="text-xs font-bold text-sky-950 block mb-1 flex items-center gap-1">
                                <span className="text-sky-700 font-black">🔍</span>
                                <span>កែសម្រួលចំណងជើងពន្យល់រូបភាព៖</span>
                              </label>
                              <input
                                type="text"
                                value={act.imageCaption || ''}
                                onChange={(e) => updateStep3Activity(index, { imageCaption: e.target.value })}
                                placeholder="វាយបញ្ចូលចំណងជើងពន្យល់រូបភាព..."
                                className="w-full text-xs sm:text-sm font-bold text-slate-950 bg-white border border-sky-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                              />
                            </div>
                          ) : (
                            <div className="text-xs sm:text-sm font-bold text-slate-950 mt-2 px-3 py-1.5 bg-white border-2 border-sky-300 rounded-lg inline-flex items-center gap-1.5 shadow-xs max-w-full">
                              <span className="text-sky-800 font-black text-sm shrink-0">🔍</span>
                              <span className="text-slate-950 font-bold">{act.imageCaption || 'រូបភាពសកម្មភាព'}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Column 3: Student Activity */}
                    <td className="p-2.5 whitespace-pre-line w-[33%]">
                      {isEditable ? (
                        <textarea
                          value={act.studentActivity}
                          onChange={(e) =>
                            updateStep3Activity(index, { studentActivity: e.target.value })
                          }
                          rows={5}
                          className="w-full border rounded p-1 text-xs"
                        />
                      ) : (
                        <MathText text={act.studentActivity} />
                      )}
                    </td>
                  </tr>
                ))}

                {/* Step 4: Reinforcement & Exercises */}
                <tr className="align-top bg-purple-50/20">
                  {/* Column 1: Teacher Activity */}
                  <td className="border-r border-slate-400 p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step4.teacherActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step4: { ...steps.step4, teacherActivity: e.target.value },
                            },
                          })
                        }
                        rows={5}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step4.teacherActivity} />
                    )}
                  </td>

                  {/* Column 2: Step & Content */}
                  <td className="border-r border-slate-400 p-2.5 font-medium w-[34%]">
                    <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-purple-200">
                      <div className="font-bold text-purple-950 text-xs flex items-center gap-1.5">
                        <span className="font-moul text-xs text-purple-950">ជំហានទី៤៖ ពង្រឹងចំណេះដឹង</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-full font-semibold text-[10.5px]">
                          {steps.step4.time}
                        </span>
                        {steps.step4.imageUrl ? (
                          <div className="no-print flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openImageModal('step4', steps.step4.imageUrl, steps.step4.imageCaption)}
                              className="text-[10px] text-purple-800 hover:text-purple-950 bg-purple-100/70 hover:bg-purple-100 border border-purple-300 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium transition"
                              title="ប្តូររូបភាព ឬ Upload ថ្មី"
                            >
                              <ImageIcon className="w-3 h-3 text-purple-700" /> រូបភាព/Upload
                            </button>
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => removeStepImage('step4')}
                                className="text-[10px] text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                                title="លុបរូបភាពចេញ"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openImageModal('step4')}
                            className="no-print text-[10px] text-purple-800 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 border border-dashed border-purple-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium transition"
                            title="បន្ថែមរូបភាព ឬ Upload"
                          >
                            <Upload className="w-3 h-3 text-purple-700" />
                            <span>Upload រូបភាព</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditable ? (
                      <textarea
                        value={steps.step4.content}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step4: { ...steps.step4, content: e.target.value },
                            },
                          })
                        }
                        rows={2}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <div className="text-slate-800 leading-relaxed font-normal mb-2">
                        <MathText text={steps.step4.content} />
                      </div>
                    )}

                    {/* Step 4 Diagram / Image */}
                    {steps.step4.imageUrl && (
                      <div className="mt-2 mb-2 p-2 bg-white border border-purple-300 rounded-lg text-center">
                        <img
                          src={steps.step4.imageUrl}
                          alt={steps.step4.imageCaption || 'ដ្យាក្រាមពង្រឹងពុទ្ធិ'}
                          className="max-h-28 mx-auto rounded object-contain"
                        />
                        {isEditable ? (
                          <div className="mt-2 text-left bg-purple-50 p-2 rounded-lg border-2 border-purple-300 shadow-xs">
                            <label className="text-xs font-bold text-purple-950 block mb-1 flex items-center gap-1">
                              <span className="text-purple-700 font-black">🔍</span>
                              <span>កែសម្រួលចំណងជើងពន្យល់រូបភាព៖</span>
                            </label>
                            <input
                              type="text"
                              value={steps.step4.imageCaption || ''}
                              onChange={(e) =>
                                onUpdatePlan({
                                  ...plan,
                                  steps: {
                                    ...steps,
                                    step4: { ...steps.step4, imageCaption: e.target.value },
                                  },
                                })
                              }
                              placeholder="វាយបញ្ចូលចំណងជើងពន្យល់រូបភាព..."
                              className="w-full text-xs sm:text-sm font-bold text-slate-950 bg-white border border-purple-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm font-bold text-slate-950 mt-2 px-3 py-1.5 bg-purple-50 border-2 border-purple-300 rounded-lg inline-flex items-center gap-1.5 shadow-xs max-w-full">
                            <span className="text-purple-700 font-black text-sm shrink-0">🔍</span>
                            <span className="text-slate-950 font-bold">{steps.step4.imageCaption || 'ដ្យាក្រាមពង្រឹងពុទ្ធិ'}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Step 4 Consolidation Exercises Box (1 or 2 exercises) */}
                    <div className="mt-2 p-2 bg-purple-50/90 border border-purple-300 rounded-lg">
                      <div className="flex items-center justify-between text-xs font-bold text-purple-900 mb-1">
                        <span>🎯 លំហាត់ពង្រឹងចំណេះដឹង (Consolidation)</span>
                        {isEditable && (
                          <button
                            onClick={addStep4Exercise}
                            className="no-print text-purple-700 hover:text-purple-900 text-[10px] font-semibold flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> ថែមលំហាត់
                          </button>
                        )}
                      </div>
                      <div className="space-y-1.5 text-xs text-slate-800">
                        {step4Exercises.map((ex, i) => (
                          <div key={i} className="flex items-start gap-1 bg-white p-1.5 rounded border border-purple-200">
                            <span className="font-bold text-purple-800 text-[11px] shrink-0 mt-0.5">
                              {i + 1}.
                            </span>
                            {isEditable ? (
                              <div className="flex-1 flex items-center gap-1">
                                <input
                                  type="text"
                                  value={ex}
                                  onChange={(e) => updateStep4Exercise(i, e.target.value)}
                                  className="w-full text-xs border border-purple-300 rounded px-1.5 py-0.5"
                                />
                                <button
                                  onClick={() => removeStep4Exercise(i)}
                                  className="text-red-500 hover:text-red-700 p-0.5 shrink-0"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ) : (
                              <MathText text={ex} />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Column 3: Student Activity */}
                  <td className="p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step4.studentActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step4: { ...steps.step4, studentActivity: e.target.value },
                            },
                          })
                        }
                        rows={5}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step4.studentActivity} />
                    )}
                  </td>
                </tr>

                {/* Step 5: Homework & Guidance */}
                <tr className="align-top">
                  {/* Column 1: Teacher Activity */}
                  <td className="border-r border-slate-400 p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step5.teacherActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step5: { ...steps.step5, teacherActivity: e.target.value },
                            },
                          })
                        }
                        rows={4}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step5.teacherActivity} />
                    )}
                  </td>

                  {/* Column 2: Step & Content */}
                  <td className="border-r border-slate-400 p-2.5 font-medium w-[34%]">
                    <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-sky-200">
                      <div className="font-bold text-sky-950 text-xs flex items-center gap-1.5">
                        <span className="font-moul text-xs text-sky-950">ជំហានទី៥៖ កិច្ចការផ្ទះ & បណ្តាំផ្ញើ</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full font-semibold text-[10.5px]">
                          {steps.step5.time}
                        </span>
                        {steps.step5.imageUrl ? (
                          <div className="no-print flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => openImageModal('step5', steps.step5.imageUrl, steps.step5.imageCaption)}
                              className="text-[10px] text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-medium transition"
                              title="ប្តូររូបភាព ឬ Upload ថ្មី"
                            >
                              <ImageIcon className="w-3 h-3 text-sky-600" /> រូបភាព/Upload
                            </button>
                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => removeStepImage('step5')}
                                className="text-[10px] text-red-500 hover:text-red-700 p-0.5 rounded hover:bg-red-50"
                                title="លុបរូបភាពចេញ"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => openImageModal('step5')}
                            className="no-print text-[10px] text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-dashed border-sky-300 px-1.5 py-0.5 rounded flex items-center gap-1 font-medium transition"
                            title="បន្ថែមរូបភាព ឬ Upload"
                          >
                            <Upload className="w-3 h-3 text-sky-600" />
                            <span>Upload រូបភាព</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {isEditable ? (
                      <textarea
                        value={steps.step5.content}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step5: { ...steps.step5, content: e.target.value },
                            },
                          })
                        }
                        rows={2}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <div className="text-slate-800 leading-relaxed font-normal">
                        <MathText text={steps.step5.content} />
                      </div>
                    )}

                    {/* Step 5 Illustration */}
                    {steps.step5.imageUrl && (
                      <div className="mt-2 p-2 bg-slate-50 border border-slate-300 rounded-lg text-center">
                        <img
                          src={steps.step5.imageUrl}
                          alt={steps.step5.imageCaption || 'កិច្ចការផ្ទះ'}
                          className="max-h-24 mx-auto rounded object-contain"
                        />
                        {isEditable ? (
                          <div className="mt-2 text-left bg-white p-2 rounded-lg border-2 border-sky-300 shadow-xs">
                            <label className="text-xs font-bold text-sky-950 block mb-1 flex items-center gap-1">
                              <span className="text-sky-700 font-black">🔍</span>
                              <span>កែសម្រួលចំណងជើងពន្យល់រូបភាព៖</span>
                            </label>
                            <input
                              type="text"
                              value={steps.step5.imageCaption || ''}
                              onChange={(e) =>
                                onUpdatePlan({
                                  ...plan,
                                  steps: {
                                    ...steps,
                                    step5: { ...steps.step5, imageCaption: e.target.value },
                                  },
                                })
                              }
                              placeholder="វាយបញ្ចូលចំណងជើងពន្យល់រូបភាព..."
                              className="w-full text-xs sm:text-sm font-bold text-slate-950 bg-white border border-sky-300 rounded px-2.5 py-1.5 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            />
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm font-bold text-slate-950 mt-2 px-3 py-1.5 bg-white border-2 border-slate-300 rounded-lg inline-flex items-center gap-1.5 shadow-xs max-w-full">
                            <span className="text-sky-800 font-black text-sm shrink-0">🔍</span>
                            <span className="text-slate-950 font-bold">{steps.step5.imageCaption || 'រូបភាពកិច្ចការផ្ទះ & បណ្តាំផ្ញើ'}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Column 3: Student Activity */}
                  <td className="p-2.5 whitespace-pre-line w-[33%]">
                    {isEditable ? (
                      <textarea
                        value={steps.step5.studentActivity}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            steps: {
                              ...steps,
                              step5: { ...steps.step5, studentActivity: e.target.value },
                            },
                          })
                        }
                        rows={4}
                        className="w-full border rounded p-1 text-xs"
                      />
                    ) : (
                      <MathText text={steps.step5.studentActivity} />
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section IV: Assessment */}
        <div className="mb-6">
          <h2 className="font-moul text-sm text-slate-900 border-b-2 border-sky-600 pb-1 mb-2 inline-block">
            IV. ការវាយតម្លៃ (Assessment)
          </h2>
          <div className="bg-slate-50 border border-slate-300 rounded p-3 text-xs space-y-2 text-slate-800">
            <div>
              <span className="font-bold text-slate-900">១. ការវាយតម្លៃដើមទី (Diagnostic)៖</span>{' '}
              <MathText text={assessment.diagnostic} />
            </div>
            <div>
              <span className="font-bold text-slate-900">២. ការវាយតម្លៃដំណើរការ (Formative)៖</span>{' '}
              <MathText text={assessment.formative} />
            </div>
            <div>
              <span className="font-bold text-slate-900">៣. ការវាយតម្លៃចុងក្រោយ (Summative)៖</span>{' '}
              <MathText text={assessment.summative} />
            </div>
          </div>
        </div>

        {/* Section V: Reflection (if present) */}
        {selfReflection && (
          <div className="mb-6">
            <h2 className="font-moul text-sm text-slate-900 border-b-2 border-sky-600 pb-1 mb-2 inline-block">
              V. ការឆ្លុះបញ្ចាំងរបស់គ្រូបង្រៀន (Self-Reflection)
            </h2>
            <div className="bg-amber-50/60 border border-amber-200 rounded p-3 text-xs text-slate-800 italic">
              {selfReflection}
            </div>
          </div>
        )}

        {/* Signatures Block in 3-column table (MoEYS Standard Compact - Fits 100% inside page) */}
        <table
          className="w-full table-fixed mt-4 pt-2 border-t border-slate-300 border-none text-xs text-center text-slate-800 break-inside-avoid"
          style={{ pageBreakInside: 'avoid', breakInside: 'avoid', tableLayout: 'fixed', width: '100%' }}
        >
          <tbody>
            <tr className="border-none" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              {/* Column 1: Principal */}
              <td className="w-1/3 align-top border-none p-2 text-center overflow-hidden">
                <div className="font-bold text-slate-900 text-xs">បានឃើញ និងឯកភាព</div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦</div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5">នាយក / នាយិកាសាលា</div>
                <div className="border-t-2 border-dotted border-slate-400 w-3/4 mx-auto mt-7 mb-1.5" />
                <div className="text-xs font-bold text-slate-900 truncate px-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={teacherInfo.principalName || ''}
                      onChange={(e) =>
                        onUpdatePlan({
                          ...plan,
                          teacherInfo: { ...teacherInfo, principalName: e.target.value },
                        })
                      }
                      placeholder="ឈ្មោះនាយកសាលា..."
                      className="border-b border-dashed border-sky-400 text-center font-bold focus:outline-none w-full max-w-[150px]"
                    />
                  ) : (
                    <span>ឈ្មោះ ៖ {teacherInfo.principalName || '....................................'}</span>
                  )}
                </div>
              </td>

              {/* Column 2: Head of Technical Team */}
              <td className="w-1/3 align-top border-none p-2 text-center overflow-hidden">
                <div className="font-bold text-slate-900 text-xs">បានពិនិត្យត្រឹមត្រូវ</div>
                <div className="text-[10.5px] text-slate-500 mt-0.5">ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦</div>
                <div className="text-[11px] font-semibold text-slate-700 mt-0.5">ប្រធានក្រុមបច្ចេកទេស</div>
                <div className="border-t-2 border-dotted border-slate-400 w-3/4 mx-auto mt-7 mb-1.5" />
                <div className="text-xs font-bold text-slate-900 truncate px-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={teacherInfo.headOfTechnicalTeam || ''}
                      onChange={(e) =>
                        onUpdatePlan({
                          ...plan,
                          teacherInfo: { ...teacherInfo, headOfTechnicalTeam: e.target.value },
                        })
                      }
                      placeholder="ឈ្មោះប្រធានក្រុមបច្ចេកទេស..."
                      className="border-b border-dashed border-sky-400 text-center font-bold focus:outline-none w-full max-w-[150px]"
                    />
                  ) : (
                    <span>ឈ្មោះ ៖ {teacherInfo.headOfTechnicalTeam || '....................................'}</span>
                  )}
                </div>
              </td>

              {/* Column 3: Teacher */}
              <td className="w-1/3 align-top border-none p-2 text-center overflow-hidden">
                <div className="text-xs text-slate-800 truncate px-1">
                  {isEditable ? (
                    <div className="flex items-center justify-center gap-1">
                      <span>ធ្វើនៅ</span>
                      <input
                        type="text"
                        value={teacherInfo.schoolName}
                        onChange={(e) =>
                          onUpdatePlan({
                            ...plan,
                            teacherInfo: { ...teacherInfo, schoolName: e.target.value },
                          })
                        }
                        placeholder="ឈ្មោះសាលារៀន..."
                        className="border-b border-dashed border-sky-400 text-center text-xs focus:outline-none w-24"
                      />
                    </div>
                  ) : (
                    <span>ធ្វើនៅ {teacherInfo.schoolName || '....................................'}</span>
                  )}
                </div>
                <div className="text-[10.5px] text-slate-500 mt-0.5 truncate px-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={teacherInfo.date}
                      onChange={(e) =>
                        onUpdatePlan({
                          ...plan,
                          teacherInfo: { ...teacherInfo, date: e.target.value },
                        })
                      }
                      placeholder="កាលបរិច្ឆេទ..."
                      className="border-b border-dashed border-sky-400 text-center text-[10.5px] focus:outline-none w-full max-w-[150px]"
                    />
                  ) : (
                    <span>{teacherInfo.date || 'ថ្ងៃទី.....ខែ.....ឆ្នាំ២០២៦'}</span>
                  )}
                </div>
                <div className="text-[11px] font-bold text-slate-900 mt-0.5">ហត្ថលេខា និងឈ្មោះគ្រូបង្រៀន</div>
                <div className="border-t-2 border-dotted border-slate-400 w-3/4 mx-auto mt-7 mb-1.5" />
                <div className="text-xs font-bold text-slate-900 truncate px-1">
                  {isEditable ? (
                    <input
                      type="text"
                      value={teacherInfo.teacherName}
                      onChange={(e) =>
                        onUpdatePlan({
                          ...plan,
                          teacherInfo: { ...teacherInfo, teacherName: e.target.value },
                        })
                      }
                      placeholder="ឈ្មោះគ្រូបង្រៀន..."
                      className="border-b border-dashed border-sky-400 text-center font-bold focus:outline-none w-full max-w-[150px]"
                    />
                  ) : (
                    <span>ឈ្មោះ ៖ {teacherInfo.teacherName}</span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Image & Diagram Selection Modal */}
      {imageModalStep && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-5 sm:p-6 my-8 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
              <div>
                <h3 className="font-moul text-sm text-slate-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  <span>គ្រប់គ្រងរូបភាព & ដ្យាក្រាមឧបទេស</span>
                  <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                    {getStepName(imageModalStep)}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ផ្ទុកឡើងរូបភាពផ្ទាល់ខ្លួន បង្កើតដ្យាក្រាម AI ឱ្យត្រូវនឹងមេរៀន ឬជ្រើសរើសពីបណ្ណាល័យ
                </p>
              </div>
              <button
                type="button"
                onClick={() => setImageModalStep(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 mb-3 gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => setImageModalTab('upload')}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg flex items-center gap-1.5 transition border-b-2 ${
                  imageModalTab === 'upload'
                    ? 'border-sky-600 text-sky-700 bg-sky-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-sky-600" />
                <span>📁 ផ្ទុកឡើងរូបភាព (Upload)</span>
              </button>

              <button
                type="button"
                onClick={() => setImageModalTab('ai')}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg flex items-center gap-1.5 transition border-b-2 ${
                  imageModalTab === 'ai'
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>🤖 បង្កើតដ្យាក្រាម AI តាមមេរៀន</span>
              </button>

              <button
                type="button"
                onClick={() => setImageModalTab('catalog')}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg flex items-center gap-1.5 transition border-b-2 ${
                  imageModalTab === 'catalog'
                    ? 'border-emerald-600 text-emerald-700 bg-emerald-50/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>🎨 បណ្ណាល័យដ្យាក្រាម</span>
              </button>

              <button
                type="button"
                onClick={() => setImageModalTab('url')}
                className={`px-3 py-2 text-xs font-bold rounded-t-lg flex items-center gap-1.5 transition border-b-2 ${
                  imageModalTab === 'url'
                    ? 'border-slate-600 text-slate-800 bg-slate-100'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
                <span>🔗 តំណភ្ជាប់រូបភាព</span>
              </button>
            </div>

            {/* Modal Body / Tab Contents */}
            <div className="overflow-y-auto space-y-3.5 flex-1 pr-1">
              {/* TAB 1: UPLOAD IMAGE */}
              {imageModalTab === 'upload' && (
                <div className="space-y-3">
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageFile(file);
                    }}
                  />

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleImageFile(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                      isDragging
                        ? 'border-sky-500 bg-sky-50/70 scale-[0.99]'
                        : 'border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/30'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shadow-xs">
                      <FolderUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        ចុចទីនេះដើម្បីជ្រើសរើសរូបភាព ឬ អូសទម្លាក់រូបភាពដាក់ទីនេះ
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        គាំទ្រ PNG, JPG, JPEG, SVG, WebP, GIF (ប្រព័ន្ធបង្រួមទំហំស្វ័យប្រវត្តិកុំឱ្យលើសទំព័រ A4)
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-1 px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs flex items-center gap-1.5 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>ជ្រើសរើសរូបភាពពីម៉ាស៊ីន (Choose File)</span>
                    </button>
                  </div>

                  {uploadFileName && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold truncate max-w-xs">{uploadFileName}</span>
                        <span className="text-[10px] text-emerald-700 font-mono">({uploadFileSize})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-bold text-emerald-700 hover:underline shrink-0"
                      >
                        ប្តូររូបផ្សេង
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AI DIAGRAM GENERATION (Match current lesson) */}
              {imageModalTab === 'ai' && (
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-indigo-50 via-sky-50 to-emerald-50 border border-indigo-200 rounded-xl">
                    <div className="font-bold text-xs text-indigo-950 flex items-center gap-1.5 mb-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                      <span>បង្កើតដ្យាក្រាមគរុកោសល្យឆ្លាតវៃឱ្យត្រូវនឹងមេរៀនជាក់ស្តែង</span>
                    </div>

                    <div className="bg-white/80 p-2.5 rounded-lg border border-indigo-100 text-xs text-slate-700 space-y-1 mb-2.5">
                      <div>
                        <span className="font-bold text-indigo-900">មុខវិជ្ជា៖</span>{' '}
                        {generalInfo.subject} ({generalInfo.grade})
                      </div>
                      <div>
                        <span className="font-bold text-indigo-900">ជំពូក & មេរៀន៖</span>{' '}
                        {generalInfo.chapter} — {generalInfo.lessonTitle}
                      </div>
                      <div>
                        <span className="font-bold text-indigo-900">ប្រធានបទរង៖</span>{' '}
                        <strong className="text-sky-800">{generalInfo.subTopic || generalInfo.lessonTitle}</strong>
                      </div>
                      <div>
                        <span className="font-bold text-indigo-900">ផ្នែកដែលត្រូវបំពាក់៖</span>{' '}
                        <span className="text-emerald-700 font-semibold">{getStepName(imageModalStep)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleGenerateAiDiagram}
                        disabled={isGeneratingAiDiagram}
                        className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        {isGeneratingAiDiagram ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                            <span>កំពុងបង្កើតដ្យាក្រាមតាមខ្លឹមសារមេរៀន...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                            <span>បង្កើតដ្យាក្រាម AI តាមមេរៀននេះ</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={resetToDefaultDiagram}
                        disabled={isGeneratingAiDiagram}
                        className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs flex items-center gap-1.5 transition"
                        title="ប្រើដ្យាក្រាមគរុកោសល្យលំនាំដើមដែលត្រូវតាមមុខវិជ្ជា"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>ដ្យាក្រាមគរុកោសល្យរហ័ស</span>
                      </button>
                    </div>

                    {aiDiagramError && (
                      <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{aiDiagramError}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: CATALOG OF PEDAGOGICAL DIAGRAMS */}
              {imageModalTab === 'catalog' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                      <span>🎨 ជ្រើសរើសដ្យាក្រាមគរុកោសល្យតាមមុខវិជ្ជា៖</span>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {[
                      { id: 'all', label: 'ទាំងអស់' },
                      { id: 'គណិតវិទ្យា', label: '📐 គណិតវិទ្យា' },
                      { id: 'រូបវិទ្យា', label: '⚡ រូបវិទ្យា' },
                      { id: 'គីមីវិទ្យា', label: '🧪 គីមីវិទ្យា' },
                      { id: 'ជីវវិទ្យា', label: '🔬 ជីវវិទ្យា' },
                      { id: 'ផែនដីវិទ្យា / ភូមិវិទ្យា', label: '🌍 ផែនដី/ភូមិ' },
                      { id: 'ភាសាខ្មែរ', label: '📚 ភាសាខ្មែរ' },
                    ].map((tab) => {
                      const isActive = catalogSubjectFilter === tab.id;
                      const count =
                        tab.id === 'all'
                          ? AVAILABLE_DIAGRAMS_CATALOG.length
                          : AVAILABLE_DIAGRAMS_CATALOG.filter((c) => c.subject.includes(tab.id)).length;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCatalogSubjectFilter(tab.id)}
                          className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition cursor-pointer flex items-center gap-1 ${
                            isActive
                              ? 'bg-sky-600 text-white shadow-xs font-bold'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-[9px] px-1 rounded-full ${
                              isActive ? 'bg-sky-700 text-sky-100' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1.5 border border-slate-200 rounded-xl bg-slate-50/50">
                    {AVAILABLE_DIAGRAMS_CATALOG.filter((cat) =>
                      catalogSubjectFilter === 'all' ? true : cat.subject.includes(catalogSubjectFilter)
                    ).map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => applyCatalogDiagram(cat.svgUrl, cat.title)}
                        className="p-2.5 rounded-lg border border-slate-200 hover:border-sky-500 bg-white hover:bg-sky-50/50 cursor-pointer transition shadow-2xs group flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="text-[11px] font-bold text-slate-900 group-hover:text-sky-700 leading-tight">
                            {cat.title}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold shrink-0 ${
                              cat.subject.includes('គណិត')
                                ? 'bg-blue-100 text-blue-700'
                                : cat.subject.includes('រូប')
                                ? 'bg-amber-100 text-amber-700'
                                : cat.subject.includes('គីមី')
                                ? 'bg-cyan-100 text-cyan-700'
                                : cat.subject.includes('ជីវ')
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {cat.subject}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mb-1.5">
                          {cat.description}
                        </p>
                        <div className="mt-auto h-12 bg-slate-50 rounded border border-slate-100 overflow-hidden flex items-center justify-center p-1">
                          <img
                            src={cat.svgUrl}
                            alt={cat.title}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DIRECT URL / SVG */}
              {imageModalTab === 'url' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700">
                    តំណភ្ជាប់រូបភាពពីអ៊ីនធឺណិត ឬ Data-URI (Image URL / SVG)៖
                  </label>
                  <input
                    type="text"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://example.com/diagram.png ឬ data:image/svg+xml..."
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500">
                    អ្នកអាចបិទភ្ជាប់តំណភ្ជាប់រូបភាពផ្ទាល់ (HTTPS) ឬកូដរូបភាព SVG data-uri។
                  </p>
                </div>
              )}

              {/* Caption Input (Shared across all tabs) */}
              <div className="pt-3 border-t-2 border-slate-200 bg-slate-50/70 -mx-5 px-5 sm:-mx-6 sm:px-6 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="text-sky-600 text-base">🔍</span>
                    <span>ចំណងជើងពន្យល់រូបភាព (Image Caption)៖</span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    បង្ហាញក្រោមរូបភាពច្បាស់ៗ
                  </span>
                </div>
                <input
                  type="text"
                  value={tempImageCaption}
                  onChange={(e) => setTempImageCaption(e.target.value)}
                  placeholder="វាយបញ្ចូលចំណងជើងពន្យល់រូបភាពនៅទីនេះ (ឧ. ដ្យាក្រាមប្រៀបធៀបមាត្រដ្ឋានសីតុណ្ហភាព Celsius, Kelvin)..."
                  className="w-full text-xs sm:text-sm font-bold text-slate-950 bg-white border-2 border-sky-400 focus:border-sky-600 rounded-lg px-3 py-2.5 shadow-xs focus:ring-2 focus:ring-sky-500/20 focus:outline-none placeholder:text-slate-400"
                />

                {/* Quick suggestions to populate caption with 1 click */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] font-bold text-slate-600">គន្លឹះបំពេញរហ័ស៖</span>
                  <button
                    type="button"
                    onClick={() =>
                      setTempImageCaption(
                        `ដ្យាក្រាមពន្យល់៖ ${generalInfo.subTopic || generalInfo.lessonTitle}`
                      )
                    }
                    className="text-[10.5px] px-2 py-0.5 bg-white hover:bg-sky-50 text-sky-800 border border-sky-300 rounded font-medium transition cursor-pointer"
                  >
                    + មេរៀន {generalInfo.lessonTitle}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTempImageCaption(
                        `រូបភាពពិសោធន៍ និងការសង្កេត៖ ${generalInfo.subTopic || generalInfo.lessonTitle}`
                      )
                    }
                    className="text-[10.5px] px-2 py-0.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 rounded font-medium transition cursor-pointer"
                  >
                    + រូបភាពពិសោធន៍
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setTempImageCaption(
                        `ដ្យាក្រាមសង្ខេប និងគំនូរបំព្រួញ៖ ${generalInfo.chapter}`
                      )
                    }
                    className="text-[10.5px] px-2 py-0.5 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded font-medium transition cursor-pointer"
                  >
                    + គំនូរបំព្រួញជំពូក
                  </button>
                </div>
              </div>

              {/* Live Preview Box */}
              {tempImageUrl ? (
                <div className="p-3.5 bg-slate-100 border-2 border-slate-300 rounded-xl text-center">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-2 px-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-sky-600">👁️</span>
                      <span>ការបង្ហាញមើលជាមុន (Live Preview)</span>
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> សមស្របសម្រាប់បោះពុម្ព A4 &amp; Word
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border-2 border-slate-300 shadow-xs max-h-44 overflow-hidden flex items-center justify-center">
                    <img
                      src={tempImageUrl}
                      alt={tempImageCaption || 'Preview'}
                      className="max-h-40 max-w-full object-contain mx-auto rounded"
                    />
                  </div>
                  
                  {/* High-visibility caption preview */}
                  <div className="mt-2.5 px-3 py-2 bg-white border-2 border-amber-400 rounded-lg text-center shadow-xs">
                    <div className="text-[10.5px] font-bold text-amber-900 uppercase tracking-wide mb-0.5">
                      ចំណងជើងពន្យល់រូបភាព (អក្សរបង្ហាញក្រោមរូបភាព)៖
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-950 flex items-center justify-center gap-1.5 flex-wrap">
                      <span className="text-sky-700 font-black text-sm">🔍</span>
                      {tempImageCaption ? (
                        <span className="text-slate-950 font-bold">{tempImageCaption}</span>
                      ) : (
                        <span className="text-rose-600 font-medium italic text-xs">
                          (មិនទាន់មានចំណងជើងពន្យល់នៅឡើយទេ — សូមវាយបញ្ចូលក្នុងប្រអប់ «ចំណងជើងពន្យល់រូបភាព» ខាងលើ)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50/60 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                  មិនទាន់មានរូបភាពត្រូវបានជ្រើសរើសនៅឡើយទេ។
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 mt-3">
              <button
                type="button"
                onClick={() => {
                  setTempImageUrl('');
                  setTempImageCaption('');
                  setUploadFileName('');
                  setUploadFileSize('');
                }}
                className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
              >
                លុបរូបភាពចេញ
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setImageModalStep(null)}
                  className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition"
                >
                  បោះបង់
                </button>
                <button
                  type="button"
                  onClick={saveImageModal}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs transition"
                >
                  រក្សាទុកការផ្លាស់ប្តូរ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print & PDF Modal */}
      <PrintPdfModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        plan={plan}
      />
    </div>
  );
}
