'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  X,
  Loader2,
  FileDown,
  Info,
  Sparkles,
} from 'lucide-react';
import { LessonPlanData } from '@/types/lesson-plan';
import {
  generateStandaloneLessonPlanHTML,
  generateStandaloneWordDoc,
  downloadFile,
} from '@/lib/export-html';

interface PrintPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlanData;
}

export function PrintPdfModal({ isOpen, onClose, plan }: PrintPdfModalProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [printWarning, setPrintWarning] = useState<string | null>(null);

  const { generalInfo } = plan;

  // Generate a standalone HTML blob URL when modal opens
  const standaloneBlobUrl = React.useMemo(() => {
    if (!isOpen) return '';
    try {
      const html = generateStandaloneLessonPlanHTML(plan, true);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.warn('Failed to create blob url for print:', e);
      return '';
    }
  }, [isOpen, plan]);

  useEffect(() => {
    return () => {
      if (standaloneBlobUrl) {
        URL.revokeObjectURL(standaloneBlobUrl);
      }
    };
  }, [standaloneBlobUrl]);

  if (!isOpen) return null;

  // 1. Direct PDF Download using html2pdf.js (bypasses iframe restrictions completely)
  const handleDownloadDirectPdf = async () => {
    setIsGeneratingPdf(true);
    setPdfError(null);
    setPrintWarning(null);
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;

      // Find the printable sheet container
      const source = document.getElementById('printable-lesson-sheet');
      if (!source) {
        throw new Error('រកមិនឃើញទម្រង់កិច្ចតែងការនៅលើទំព័រ។ សូមបើកមើលទំព័រ «A4 Sheet Preview» សិន។');
      }

      const safeSubject = generalInfo.subject.replace(/[\\/:*?"<>|]/g, '_');
      const safeGrade = generalInfo.grade.replace(/[\\/:*?"<>|]/g, '_');
      const safeTopic = (generalInfo.subTopic || generalInfo.lessonTitle || 'មេរៀន')
        .slice(0, 30)
        .replace(/[\\/:*?"<>|]/g, '_');
      const fileName = `កិច្ចតែងការ_${safeSubject}_${safeGrade}_${safeTopic}.pdf`;

      const opt = {
        margin: [8, 8, 8, 8] as [number, number, number, number], // mm
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
          ignoreElements: (element: Element) => {
            return (
              element.classList?.contains('no-print') ||
              element.hasAttribute('data-no-print')
            );
          },
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
        },
        pagebreak: {
          mode: ['css', 'legacy'],
          avoid: ['tr', '.signatures-table', '.step-visual-box', '.assessment-card'],
        },
      };

      await html2pdf().set(opt).from(source).save();
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 5000);
    } catch (err: any) {
      console.error('Direct PDF error:', err);
      setPdfError(
        err?.message ||
          'មានបញ្ហាក្នុងការបង្កើតឯកសារ PDF ដោយផ្ទាល់។ សូមសាកល្បងចុច «បើកផ្ទាំងទោលក្នុង Tab ថ្មី» ឬ «ទាញយកជា HTML»។'
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // 2. Trigger browser window.print() with fallback
  const handleSystemPrint = () => {
    setPrintWarning(null);
    try {
      window.print();
    } catch (err) {
      console.warn('window.print() error in iframe:', err);
      setPrintWarning(
        'កម្មវិធីរុករកបានទប់ស្កាត់ផ្ទាំង Print ដោយសារ iFrame Sandbox។ សូមប្រើជម្រើស «ទាញយកជា PDF ដោយផ្ទាល់» ឬ «បើកក្នុង Tab ថ្មី» ខាងក្រោម។'
      );
    }
  };

  // 3. Download standalone HTML
  const handleDownloadHtml = () => {
    const htmlContent = generateStandaloneLessonPlanHTML(plan, false);
    const filename = `កិច្ចតែងការ_${generalInfo.subject}_${generalInfo.grade}_${(generalInfo.subTopic || 'មេរៀន').slice(0, 20)}.html`;
    downloadFile(htmlContent, filename, 'text/html');
  };

  // 4. Download Word document
  const handleDownloadWord = () => {
    const docContent = generateStandaloneWordDoc(plan);
    const filename = `កិច្ចតែងការ_${generalInfo.subject}_${generalInfo.grade}_${(generalInfo.subTopic || 'មេរៀន').slice(0, 20)}.doc`;
    downloadFile(docContent, filename, 'application/msword');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xl w-full p-5 sm:p-6 my-8 flex flex-col animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 flex items-center justify-center shadow-xs">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-moul text-sm text-slate-900 dark:text-white">
                បោះពុម្ព ឬរក្សាទុកជា PDF
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                កិច្ចតែងការបង្រៀនស្តង់ដារ ៥ ជំហាន (៣ ជួរឈរ MoEYS)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="បិទ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts & Feedback */}
        {pdfSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>ជោគជ័យ!</strong> ឯកសារ PDF ត្រូវបានទាញយកចូលក្នុងកុំព្យូទ័ររបស់អ្នករួចរាល់ហើយ។
            </span>
          </div>
        )}

        {pdfError && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-800 dark:text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{pdfError}</span>
          </div>
        )}

        {printWarning && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{printWarning}</span>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3">
          {/* Primary Recommended Option: Direct PDF Download */}
          <div className="p-4 rounded-xl border-2 border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 dark:border-sky-600 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-sky-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ជម្រើសណែនាំ
                </span>
                <span className="font-bold text-xs text-sky-950 dark:text-sky-200">
                  ទាញយកជា PDF (.pdf) ដោយផ្ទាល់
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
              ដំណើរការ ១០០% គ្រប់ Browser (មិនបាច់ឆ្លងកាត់ផ្ទាំង Print និងមិនខ្លាចជាប់សោរ iFrame ឡើយ)។
            </p>
            <button
              type="button"
              onClick={handleDownloadDirectPdf}
              disabled={isGeneratingPdf}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>កំពុងរៀបចំ និងទាញយក PDF (A4)...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>ចុចទីនេះដើម្បីទាញយកជា PDF (.pdf) ភ្លាមៗ</span>
                </>
              )}
            </button>
          </div>

          {/* Action Grid for other formats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {/* System Print */}
            <button
              type="button"
              onClick={handleSystemPrint}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 text-left"
            >
              <Printer className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>បើកផ្ទាំង Print (Ctrl + P)</span>
            </button>

            {/* Standalone Tab Link */}
            {standaloneBlobUrl ? (
              <a
                href={standaloneBlobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 text-center no-underline"
              >
                <ExternalLink className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>បើកក្នុង Tab ថ្មីសម្រាប់ Print</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handleSystemPrint}
                className="p-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold text-xs flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-indigo-600" />
                <span>បើកក្នុង Tab ថ្មី</span>
              </button>
            )}

            {/* Word Download */}
            <button
              type="button"
              onClick={handleDownloadWord}
              className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/70 text-blue-900 dark:text-blue-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>ទាញយកជា Word (.doc)</span>
            </button>

            {/* Standalone HTML */}
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>ទាញយកជា HTML (.html)</span>
            </button>
          </div>

          {/* Guide Card */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1.5">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>ការណែនាំពេលប្រើផ្ទាំង Print របស់ Browser៖</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400 pl-1 leading-relaxed">
              <li>
                <strong>Destination៖</strong> ជ្រើស <strong>«Save as PDF»</strong> (រក្សាទុកជា PDF)
              </li>
              <li>
                <strong>Paper size៖</strong> ជ្រើស <strong>A4</strong> | <strong>Layout៖</strong> Portrait (បញ្ឈរ)
              </li>
              <li>
                <strong>Options៖</strong> ធីកលើ <strong>«Background graphics»</strong> ដើម្បីបង្ហាញពណ៌ក្បាលតារាង និងដ្យាក្រាមច្បាស់ល្អ។
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition"
          >
            យល់ព្រម / បិទ
          </button>
        </div>
      </div>
    </div>
  );
}
