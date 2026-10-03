import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

export async function POST(req: NextRequest) {
  try {
    const { sectionName, currentContent, instruction, lessonContext } = await req.json();

    const prompt = `
អ្នកគឺជាអ្នកជំនាញគរុកោសល្យខ្មែរនៃក្រសួងអប់រំ យុវជន និងកីឡា។
សូមជួយកែសម្រួល ឬពង្រីកផ្នែក៖ "${sectionName}" នៃកិច្ចតែងការបង្រៀនខាងក្រោម៖

បរិបទមេរៀន៖
- មុខវិជ្ជា៖ ${lessonContext?.subject || 'រូបវិទ្យា'} (${lessonContext?.grade || 'ថ្នាក់ទី១០'})
- មេរៀន៖ ${lessonContext?.lessonTitle || ''} - ${lessonContext?.subTopic || ''}
- វិធីសាស្ត្រ/យុទ្ធវិធី៖ ${lessonContext?.methodology || ''} / ${lessonContext?.strategy || ''}

ខ្លឹមសារបច្ចុប្បន្ន៖
${currentContent}

ការណែនាំកែលម្អបន្ថែមពីគ្រូ៖
${instruction || 'សូមពង្រីកខ្លឹមសារឱ្យកាន់តែស៊ីជម្រៅ ច្បាស់លាស់ និងមានគរុកោសល្យល្អ'}

សូមបញ្ចេញខ្លឹមសារថ្មីដែលបានកែលម្អរួចជាភាសាខ្មែរ ដោយផ្ទាល់ (មិនបាច់មានពាក្យផ្តើម ឬសេចក្តីនាំមុខទេ)៖
`;

    let enhancedText: string | null = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.6,
          },
        });

        if (response?.text) {
          enhancedText = response.text.trim();
          break;
        }
      } catch (err: any) {
        console.warn(`[Enhance Section] Model ${model} failed:`, err?.message || err);
        await new Promise((res) => setTimeout(res, 400));
      }
    }

    if (enhancedText) {
      return NextResponse.json({
        success: true,
        enhancedText,
      });
    }

    // Fallback if all models are unavailable: return slightly expanded current content
    return NextResponse.json({
      success: true,
      enhancedText: currentContent,
      note: 'ម៉ាស៊ីន AI កំពុងមានអ្នកប្រើប្រាស់ច្រើនបណ្តោះអាសន្ន',
    });
  } catch (error: any) {
    console.warn('Error enhancing section:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'មិនអាចកែលម្អបានទេនៅពេលនេះ' },
      { status: 500 }
    );
  }
}
