'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Info, Sparkles, BookOpen } from 'lucide-react';
import { LessonPlanData } from '@/types/lesson-plan';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlanData;
}

export function PromptModal({ isOpen, onClose, plan }: PromptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const { generalInfo, teacherInfo } = plan;

  const promptText = `សូមដើរតួជាគ្រូបង្រៀនកម្រិតវិទ្យាល័យដ៏មានបទពិសោធន៍នៅកម្ពុជា។ សូមជួយរៀបចំកិច្ចតែងការបង្រៀនចំនួន ១ម៉ោងសិក្សា (${generalInfo.duration}) យ៉ាងលម្អិត ដោយផ្អែកលើព័ត៌មានខាងក្រោម៖
**១. ព័ត៌មានទូទៅ៖**
* **មុខវិជ្ជា៖** ${generalInfo.subject}
* **ថ្នាក់ទី៖** ${generalInfo.grade}
* **${generalInfo.chapter}**
* **${generalInfo.lessonTitle}**
* **ប្រធានបទរង/ចំណងជើងរង៖** ${generalInfo.subTopic}
* **រយៈពេលបង្រៀន៖** ${generalInfo.duration}
* **សាលារៀន៖** ${teacherInfo.schoolName}

**២. វិធីសាស្ត្រ និងយុទ្ធវិធីបង្រៀនដែលត្រូវប្រើ៖**
* **វិធីសាស្ត្របង្រៀន៖** ${generalInfo.methodology}
* **យុទ្ធវិធីបង្រៀន៖** ${generalInfo.strategy}

**៣. រចនាសម្ព័ន្ធកិច្ចតែងការដែលទាមទារ (សរសេរជាទម្រង់ស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា)៖**
* **វត្ថុបំណងមេរៀន៖** សូមសរសេរឱ្យបានច្បាស់លាស់ (ចំណេះដឹង បំណិន ចរិយាសម្បទា)។
* **សម្ភារឧបទេស៖** តើត្រូវមានអ្វីខ្លះសម្រាប់សកម្មភាព ${generalInfo.strategy}?
* **ដំណើរការបង្រៀននិងរៀន (មាន៥ជំហាន ជាមួយនឹងការបែងចែកពេលវេលា)៖**
  * ជំហានទី១៖ រដ្ឋបាលថ្នាក់
  * ជំហានទី២៖ រំឭកមេរៀនចាស់
  * ជំហានទី៣៖ មេរៀនថ្មី - **សំខាន់បំផុត៖** ត្រូវបញ្ជាក់ពីសកម្មភាពគ្រូ និងសកម្មភាពសិស្សឱ្យបានច្បាស់លាស់ ដោយរៀបរាប់ពីរបៀបដែលគ្រូដឹកនាំសិស្សធ្វើសកម្មភាព ${generalInfo.strategy} និង ${generalInfo.methodology}។
  * ជំហានទី៤៖ ពង្រឹងចំណេះដឹង
  * ជំហានទី៥៖ កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ

* **ការវាយតម្លៃ៖** របៀបវាយតម្លៃសិស្សពេលកំពុងរៀន។

សូមសរសេរកិច្ចតែងការនេះជាភាសាខ្មែរឱ្យបានក្បោះក្បាយ និងត្រឹមត្រូវតាមបច្ចេកទេសគរុកោសល្យ។`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-sm">គំរូ Prompt សម្រាប់យកទៅប្រើប្រាស់</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700">
          <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-sky-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold">កំណត់សម្គាល់គរុកោសល្យ៖</span> ព័ត៌មានផ្ទាល់ខ្លួនដូចជា
              ឈ្មោះគ្រូ លេខទូរស័ព្ទ ប្រធានក្រុមបច្ចេកទេស និងកាលបរិច្ឆេទ
              គឺសម្រាប់បំពាក់លើក្បាលកិច្ចតែងការ (Header) នៅពេលទាញយកជា HTML/Word
              ដោយមិនប៉ះពាល់ដល់ដំណើរការបង្រៀនរបស់ AI ឡើយ។
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-800">
              <span>អត្ថបទ Prompt ពេញលេញ (អាចចម្លងយកទៅប្រើក្នុង Gemini ឬ ChatGPT)៖</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-800 font-bold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'បានចម្លងរួចរាល់!' : 'ចម្លងអត្ថបទ (Copy)'}</span>
              </button>
            </div>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-72 border border-slate-700 selection:bg-sky-600">
              {promptText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            បិទ
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'បានចម្លង!' : 'ចម្លង Prompt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
