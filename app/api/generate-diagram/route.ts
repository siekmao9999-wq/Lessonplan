import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { getStepIllustrations } from '@/lib/step-illustrations';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-3.8-flash', 'gemini-2.5-pro'];

export async function POST(req: NextRequest) {
  try {
    const {
      subject,
      grade,
      chapter,
      lessonTitle,
      subTopic,
      stepKey,
      stepName,
      content,
      objectives,
    } = await req.json();

    const topicLabel = subTopic || lessonTitle || subject || 'មេរៀន';
    const stepLabel = stepName || stepKey || 'ជំហានទី៣';

    const sLower = (subject || '').toLowerCase();
    const isMathSubject = sLower.includes('គណិត') || sLower.includes('math');

    const subjectSpecificInstruction = isMathSubject
      ? `
⚠️ ការណែនាំពិសេសសម្រាប់មុខវិជ្ជា «គណិតវិទ្យា» (Mathematics)៖
- ដាច់ខាតមិនត្រូវបង្កើតដ្យាក្រាមអក្សរសិល្ប៍ វិភាគរឿង ឬដ្យាក្រាមមុខវិជ្ជាផ្សេងឡើយ!
- ត្រូវតែជាដ្យាក្រាមគណិតវិទ្យាពិតប្រាកដ ១០០% ស្របតាមប្រធានបទ «${topicLabel}»។
- ត្រូវបង្ហាញ៖ រូបមន្តគណិតវិទ្យា (Math formulas), សមីការ, គំរូធរណីមាត្រ (Geometric figures), អ័ក្សកូអរដោនេ x-y, ដ្យាក្រាមជំហានដោះស្រាយលំហាត់ ឬតារាងតម្លៃពិត។
- រូបមន្តត្រូវសរសេរឱ្យបានស្អាត និងច្បាស់លាស់។
`
      : '';

    const prompt = `
អ្នកគឺជាអ្នកជំនាញបង្កើតដ្យាក្រាមអប់រំ និងគំនូរបច្ចេកទេសគរុកោសល្យខ្មែរ (Educational Diagram & Concept Map Specialist) សម្រាប់កម្រិតវិទ្យាល័យ និងអនុវិទ្យាល័យនៃក្រសួងអប់រំ យុវជន និងកីឡា។

សូមបង្កើតរូបភាពជាដ្យាក្រាម SVG (Scalable Vector Graphics) មួយដែលស្របត្រូវឥតខ្ចោះទៅតាមខ្លឹមសារមេរៀនពិតប្រាកដខាងក្រោម៖

ព័ត៌មានមេរៀន៖
- មុខវិជ្ជា៖ ${subject || 'គណិតវិទ្យា'} (${grade || 'ថ្នាក់ទី១០'})
- ជំពូក៖ ${chapter || ''}
- មេរៀន៖ ${lessonTitle || ''}
- ចំណងជើងរង/ប្រធានបទជាក់លាក់៖ ${subTopic || lessonTitle || ''}
- ផ្នែកដែលត្រូវបំពាក់ដ្យាក្រាម៖ ${stepLabel}
- ខ្លឹមសារសង្ខេបនៃជំហាននេះ៖ ${content || ''}
- វត្ថុបំណងមេរៀន៖ ${Array.isArray(objectives) ? objectives.join(', ') : ''}
${subjectSpecificInstruction}

តម្រូវការបច្ចេកទេស SVG៖
1. ត្រូវបង្កើតកូដ SVG សុទ្ធសាធ (valid SVG code) ដែលចាប់ផ្តើមដោយ <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 180"> និងបញ្ចប់ដោយ </svg>។
2. ទំហំ viewBox="0 0 560 180" (ឬ 560x200) សមស្របនឹងទម្រង់ក្រដាស A4 ក្នុងកិច្ចតែងការបង្រៀន។
3. ប្រើប្រាស់ពណ៌ទំនើប បែបគរុកោសល្យ (Pastel & Professional Educational Theme: ផ្ទៃក្រោយស្រាល #f8fafc ឬ #f0f9ff, ស៊ុមស្អាត, Card/Boxes មាន border-radius)។
4. អក្សរខ្មែរត្រូវប្រើ font-family="'Kantumruy Pro', 'Battambang', 'Segoe UI', sans-serif"។
5. ខ្លឹមសារក្នុងដ្យាក្រាមត្រូវមាន៖
   - ចំណងជើងដ្យាក្រាមច្បាស់លាស់នៅខាងលើ ដែលបញ្ជាក់ពីប្រធានបទមេរៀនជាក់ស្តែង
   - ប្រអប់/Card ចំនួន 2 ទៅ 4 ដែលបង្ហាញពីគំនិតគន្លឹះ ទំនាក់ទំនង រូបមន្ត (បើរូបវិទ្យា/គណិត/គីមី) ឬដំណើរការ (បើជីវវិទ្យា/ផែនដី/ប្រវត្តិ) ដែលត្រូវតាមមេរៀន ${topicLabel}
   - ព្រួញតភ្ជាប់ ឬនិមិត្តសញ្ញាបង្ហាញលំហូរយល់ដឹង
   - អក្សរខ្មែរត្រឹមត្រូវតាមអក្ខរាវិរុទ្ធខ្មែរ
6. មិនត្រូវដាក់សេចក្តីពន្យល់ ឬ Markdown code blocks ឡើយ។ បញ្ចេញតែកូដ <svg>...</svg> សុទ្ធសាធប៉ុណ្ណោះ។
`;

    let svgOutput: string | null = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.3,
          },
        });

        const text = response?.text?.trim();
        if (text) {
          // Extract SVG if wrapped in markdown
          const match = text.match(/<svg[\s\S]*?<\/svg>/i);
          if (match) {
            svgOutput = match[0];
            break;
          } else if (text.startsWith('<svg') && text.endsWith('</svg>')) {
            svgOutput = text;
            break;
          }
        }
      } catch (err: any) {
        console.warn(`[Generate Diagram] Model ${model} error:`, err?.message || err);
      }
    }

    if (svgOutput) {
      const dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgOutput.trim());
      const caption = `ដ្យាក្រាមគរុកោសល្យ៖ ${topicLabel} (${stepLabel})`;
      return NextResponse.json({
        success: true,
        svg: svgOutput,
        dataUri,
        caption,
      });
    }

    // High reliability fallback: Use the subject-matched diagram engine
    const matchedIllustrations = getStepIllustrations(
      subject,
      subTopic,
      lessonTitle,
      chapter,
      Array.isArray(objectives) ? objectives : undefined
    );
    const fallbackVisual = (matchedIllustrations as any)[stepKey] || matchedIllustrations.step3;

    return NextResponse.json({
      success: true,
      svg: null,
      dataUri: fallbackVisual.url,
      caption: fallbackVisual.caption,
      isFallback: true,
    });
  } catch (error: any) {
    console.error('Error generating diagram:', error?.message || error);
    return NextResponse.json(
      { success: false, error: 'មានបញ្ហាបច្ចេកទេសក្នុងការបង្កើតរូបភាព' },
      { status: 500 }
    );
  }
}
