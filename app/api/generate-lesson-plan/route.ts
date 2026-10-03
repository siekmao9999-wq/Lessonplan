import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { LessonPlanData } from '@/types/lesson-plan';
import { generatePedagogicalFallbackPlan } from '@/lib/pedagogical-generator';
import { getStepIllustrations } from '@/lib/step-illustrations';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Candidate models for automatic failover when experiencing high demand (503 / 429)
const CANDIDATE_MODELS = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

export async function POST(req: NextRequest) {
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { teacherInfo, generalInfo, customPrompt } = body;

  const subject = generalInfo?.subject || 'រូបវិទ្យា';
  const grade = generalInfo?.grade || 'ថ្នាក់ទី១០';
  const chapter = generalInfo?.chapter || 'ជំពូកទី៣៖ ទែម៉ូឌីណាមិច';
  const lessonTitle = generalInfo?.lessonTitle || 'មេរៀនទី១៖ សីតុណ្ហភាព និងកម្តៅ';
  const subTopic =
    generalInfo?.subTopic ||
    'សីតុណ្ហភាព និងការបំប្លែងខ្នាតសីតុណ្ហភាព (Celsius, Fahrenheit, Kelvin)';
  const duration = generalInfo?.duration || '៤៥ នាទី (១ ម៉ោងសិក្សា)';
  const methodology =
    generalInfo?.methodology || 'វិធីសាស្ត្របង្រៀនតាមបែបសហការ (Collaborative Learning)';
  const strategy =
    generalInfo?.strategy || 'យុទ្ធវិធីបង្រៀនតាមបែបពិព័រណ៍វិចិត្រសាល (Gallery Walk)';

  const illustrations = getStepIllustrations(subject, subTopic, lessonTitle, chapter);

  const systemInstruction = `
អ្នកគឺជាអ្នកជំនាញគរុកោសល្យ និងជាគ្រូបង្រៀនកម្រិតវិទ្យាល័យ/អនុវិទ្យាល័យដ៏មានបទពិសោធន៍ខ្ពស់នៅកម្ពុជា (MoEYS Expert Pedagogue)។
ភារកិច្ចរបស់អ្នកគឺរៀបចំ "កិច្ចតែងការបង្រៀន" ឱ្យបានត្រឹមត្រូវតាមស្តង់ដារ ៥ ជំហានរបស់ក្រសួងអប់រំ យុវជន និងកីឡានៃព្រះរាជាណាចក្រកម្ពុជា។

លក្ខណៈវិនិច្ឆ័យសំខាន់ៗបំផុតដែលត្រូវគោរពតាមយ៉ាងម៉ឺងម៉ាត់៖
១. **ទម្រង់សរសេរគណិតវិទ្យា និងវិទ្យាសាស្ត្រតាមបែប MathType/LaTeX ស្អាតបាត ១០០%**៖
   - **សំខាន់បំផុត**៖ រាល់រូបមន្តគណិតវិទ្យា និមិត្តសញ្ញា អថេរ ($x, y, z, a, b, c, m, n$), ប្រមាណវិធីបូកដកគុណចែក ($+$, $-$, $\\times$, $\\div$, $\\pm$), ផលធៀប, ប្រភាគ ($\\frac{a}{b}$), ស្វ័យគុណ ($x^2, x^n$), សញ្ញាឬស ($\\sqrt{x}, \\sqrt{\\Delta}$), សញ្ញាផលបូក-ផលចែក, ត្រីកោណមាត្រ ($\\sin, \\cos, \\tan$), ដេរីវេ-អាំងតេក្រាល ($f'(x), \\int f(x) dx$), លីមីត ($\\lim_{x \\to 0}$), វ៉ិចទ័រ ($\\vec{u}$), ប្រព័ន្ធសមីការ ($\\begin{cases} ... \\end{cases}$), និងសញ្ញាខ្នាត ត្រូវតែសរសេរក្នុងសញ្ញា '$...$' (ឬ '$$...$$' សម្រាប់រូបមន្តធំ) ជានិច្ច!
   - ឧទាហរណ៍ជាក់ស្តែងតាមកម្រិតថ្នាក់៖
     + បឋមសិក្សា៖ '$28 + 35 = 63$', '$\\frac{1}{2} + \\frac{1}{3} = \\frac{5}{6}$', '$20\\% \\times 40\\,000 = 8\\,000\\text{៛}$'
     + អនុវិទ្យាល័យ៖ '$\\sin \\hat{B} = \\frac{AC}{BC}$', '$\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}$', '$c^2 = a^2 + b^2$', '$\\Delta = b^2 - 4ac$'
     + វិទ្យាល័យ៖ '$f'(x) = 6x^2 - 10x + 4$', '$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$', '$\\int (3x^2 + 2x) dx = x^3 + x^2 + C$', '$\\vec{u} \\cdot \\vec{v} = |\\vec{u}| |\\vec{v}| \\cos \\theta$'
   - ការសរសេរក្នុង '$...$' គឺចាំបាច់ដើម្បីឱ្យប្រព័ន្ធបង្ហាញ Font MathType ស្អាតបាត ទាំងលើអេក្រង់ ពេលបោះពុម្ព និងពេលទាញយកជាឯកសារ Word (.doc)។
២. **ដាក់ខ្លឹមសារមេរៀនចូលទៅក្នុង «សកម្មភាពគ្រូ» និង «សកម្មភាពសិស្ស» (Content-Rich Activities)**៖
   - មិនត្រូវសរសេរតែពាក្យគរុកោសល្យទូទៅថា «គ្រូពន្យល់» ឬ «សិស្សស្តាប់» ឬ «សិស្សឆ្លើយ» ឡើយ!
   - ក្នុង **សកម្មភាពគ្រូ (teacherActivity)**៖ ត្រូវសរសេរខ្លឹមសារជាក់ស្តែង រូបមន្តគន្លឹះ សំណួរជាក់លាក់ដែលគ្រូចោទសួរ និងការណែនាំដំណោះស្រាយលម្អិត។
   - ក្នុង **សកម្មភាពសិស្ស (studentActivity)**៖ ត្រូវសរសេរខ្លឹមសារចម្លើយជាក់ស្តែង រូបមន្តដែលសិស្សកត់ត្រា លេខនិងជំហានគណនាដែលសិស្សអនុវត្ត និងសេចក្តីសន្និដ្ឋានដែលសិស្សទាញចេញ។
៣. **ក្នុងជំហានទី៣ (មេរៀនថ្មី)**៖ ត្រូវរៀបចំជាសកម្មភាពលម្អិតយ៉ាងហោចណាស់ ២ ទៅ ៣ សកម្មភាព ដោយត្រូវឆ្លុះបញ្ចាំងឱ្យឃើញច្បាស់ពីវិធីសាស្ត្រ (${methodology}) និងយុទ្ធវិធី (${strategy})។
៤. **រៀបចំលំហាត់តាមជំហាននីមួយៗឱ្យបានត្រឹមត្រូវតាមស្តង់ដារ**៖
   - ជំហានទី២ (រំឭកមេរៀនចាស់)៖ ត្រូវមានលំហាត់រំឭក ១ ឬ ២ សំណួរ/លំហាត់ (step2 exercises)។
   - ជំហានទី៣ (មេរៀនថ្មី)៖ ត្រូវមានលំហាត់ចំនួន ៣ កម្រិត (step3Exercises):
     + លំហាត់ទី១៖ កម្រិតមូលដ្ឋាន/អនុវត្តផ្ទាល់ (Direct Application)
     + លំហាត់ទី២៖ កម្រិតមធ្យម/វិភាគ (Intermediate / Analytical)
     + លំហាត់ទី៣៖ លំហាត់បែប PISA ស្តង់ដារអន្តរជាតិ (isPisa: true) ដែលផ្សារភ្ជាប់នឹងបរិបទជីវិតពិត វិទ្យាសាស្ត្រ ឬសង្គមជាក់ស្តែង (Real-world scenario & Critical thinking)។
   - ជំហានទី៤ (ពង្រឹងចំណេះដឹង)៖ ត្រូវមានលំហាត់ពង្រឹង ១ ឬ ២ សំណួរ/លំហាត់ (step4 exercises)។
៥. **វត្ថុបំណងត្រូវកំណត់ឱ្យច្បាស់លាស់ អាចវាស់វែងបាន (SMART objectives)**។
៦. **ត្រូវឆ្លើយតបជាទម្រង់ JSON សុទ្ធសាធតាម Schema ដែលបានកំណត់**។
`;

  const userPrompt = `
សូមបង្កើតកិច្ចតែងការបង្រៀនពេញលេញមួយសម្រាប់៖
- មុខវិជ្ជា៖ ${subject}
- ថ្នាក់ទី៖ ${grade}
- ជំពូក៖ ${chapter}
- មេរៀន៖ ${lessonTitle}
- ប្រធានបទរង/ចំណងជើងរង៖ ${subTopic}
- រយៈពេលបង្រៀន៖ ${duration}
- សាលារៀន៖ ${teacherInfo?.schoolName || 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)'}
- វិធីសាស្ត្របង្រៀន៖ ${methodology}
- យុទ្ធវិធីបង្រៀន៖ ${strategy}
${customPrompt ? `\nសំណូមពរ ឬព័ត៌មានបន្ថែមពីគ្រូ៖ ${customPrompt}` : ''}

តម្រូវការពិសេស៖
1. រាល់រូបមន្តគណិតវិទ្យា/រូបវិទ្យា ត្រូវសរសេរក្នុងទម្រង់ MathType/LaTeX ($...$) ឱ្យបានស្អាត។
2. បញ្ចូលខ្លឹមសារមេរៀន រូបមន្ត សំណួរ និងចម្លើយជាក់ស្តែងចូលក្នុង «សកម្មភាពគ្រូ» និង «សកម្មភាពសិស្ស» ឱ្យបានក្បោះក្បាយ។
3. ជំហានទី២ មានលំហាត់រំឭក ១-២, ជំហានទី៣ មានលំហាត់ ៣ កម្រិត (រួមទាំង PISA), និងជំហានទី៤ មានលំហាត់ពង្រឹង ១-២។
`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      objectives: {
        type: Type.OBJECT,
        properties: {
          knowledge: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'ចំណុចវត្ថុបំណងចំណេះដឹង (Knowledge) យ៉ាងតិច ២-៣ ចំណុច',
          },
          skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'ចំណុចវត្ថុបំណងបំណិន (Skills) រួមទាំងបំណិនដោះស្រាយលំហាត់ PISA',
          },
          attitude: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'ចំណុចវត្ថុបំណងចរិយាសម្បទា (Attitude) យ៉ាងតិច ២ ចំណុច',
          },
        },
        required: ['knowledge', 'skills', 'attitude'],
      },
      materials: {
        type: Type.OBJECT,
        properties: {
          teacherMaterials: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'សម្ភារឧបទេសសម្រាប់គ្រូ',
          },
          studentMaterials: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'សម្ភារឧបទេសសម្រាប់សិស្ស',
          },
        },
        required: ['teacherMaterials', 'studentMaterials'],
      },
      steps: {
        type: Type.OBJECT,
        properties: {
          step1: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              content: { type: Type.STRING },
              teacherActivity: { type: Type.STRING },
              studentActivity: { type: Type.STRING },
            },
            required: ['time', 'content', 'teacherActivity', 'studentActivity'],
          },
          step2: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              content: { type: Type.STRING },
              teacherActivity: { type: Type.STRING },
              studentActivity: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'លំហាត់រំឭកមេរៀនចាស់ ១ ឬ ២ សំណួរ/លំហាត់',
              },
            },
            required: ['time', 'content', 'teacherActivity', 'studentActivity', 'exercises'],
          },
          step3: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                activityTitle: { type: Type.STRING },
                time: { type: Type.STRING },
                content: { type: Type.STRING },
                teacherActivity: { type: Type.STRING },
                studentActivity: { type: Type.STRING },
              },
              required: [
                'activityTitle',
                'time',
                'content',
                'teacherActivity',
                'studentActivity',
              ],
            },
          },
          step3Exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                question: { type: Type.STRING },
                isPisa: { type: Type.BOOLEAN },
                solutionHint: { type: Type.STRING },
              },
              required: ['title', 'question'],
            },
            description: 'លំហាត់ចំនួន ៣ កម្រិត (លំហាត់ទី១ អនុវត្តផ្ទាល់, លំហាត់ទី២ វិភាគ, លំហាត់ទី៣ បែប PISA)',
          },
          step4: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              content: { type: Type.STRING },
              teacherActivity: { type: Type.STRING },
              studentActivity: { type: Type.STRING },
              exercises: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'លំហាត់ពង្រឹងចំណេះដឹង ១ ឬ ២ សំណួរ/លំហាត់',
              },
            },
            required: ['time', 'content', 'teacherActivity', 'studentActivity', 'exercises'],
          },
          step5: {
            type: Type.OBJECT,
            properties: {
              time: { type: Type.STRING },
              content: { type: Type.STRING },
              teacherActivity: { type: Type.STRING },
              studentActivity: { type: Type.STRING },
            },
            required: ['time', 'content', 'teacherActivity', 'studentActivity'],
          },
        },
        required: ['step1', 'step2', 'step3', 'step4', 'step5'],
      },
      assessment: {
        type: Type.OBJECT,
        properties: {
          diagnostic: { type: Type.STRING },
          formative: { type: Type.STRING },
          summative: { type: Type.STRING },
        },
        required: ['diagnostic', 'formative', 'summative'],
      },
      selfReflection: {
        type: Type.STRING,
        description: 'ការឆ្លុះបញ្ចាំងរបស់គ្រូបន្ទាប់ពីបង្រៀនរួច',
      },
    },
    required: ['objectives', 'materials', 'steps', 'assessment'],
  };

  let generatedText: string | null = null;
  let modelUsed: string = '';

  // Try candidate models with automatic failover
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.7,
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      if (response && response.text) {
        generatedText = response.text;
        modelUsed = model;
        break; // Successfully generated!
      }
    } catch (err: any) {
      console.warn(`[Generate Lesson Plan] Model ${model} failed:`, err?.message || err);
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  // Parse response if text was received from AI
  if (generatedText) {
    try {
      let parsedData;
      try {
        parsedData = JSON.parse(generatedText);
      } catch {
        const cleaned = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      if (parsedData?.objectives && parsedData?.steps) {
        const parsedSteps = parsedData.steps;

        // Ensure step 2 exercises exist
        const step2Exercises =
          Array.isArray(parsedSteps.step2?.exercises) && parsedSteps.step2.exercises.length > 0
            ? parsedSteps.step2.exercises
            : [
                `លំហាត់រំឭកទី១៖ ចូររំឭកគោលគំនិតគ្រឹះនៃមេរៀនមុនដែលទាក់ទងនឹង ${subTopic}។`,
                `លំហាត់រំឭកទី២៖ តើសំណួររំឭកអ្វីខ្លះដែលជួយភ្ជាប់ទៅកាន់ ${lessonTitle}?`,
              ];

        // Ensure step 3 exercises exist (with PISA)
        const step3Exercises =
          Array.isArray(parsedSteps.step3Exercises) && parsedSteps.step3Exercises.length > 0
            ? parsedSteps.step3Exercises
            : [
                {
                  title: 'លំហាត់ទី១ (អនុវត្តផ្ទាល់)',
                  question: `ចូរអនុវត្តលំហាត់គន្លឹះដំបូងដើម្បីស្វែងយល់ពីនិយមន័យ និងទ្រឹស្តីបទនៃ ${subTopic}។`,
                  solutionHint: 'អនុវត្តតាមរូបមន្តគ្រឹះក្នុងសៀវភៅពុម្ព។',
                },
                {
                  title: 'លំហាត់ទី២ (កម្រិតមធ្យម / វិភាគ)',
                  question: `ចូរធ្វើការវិភាគ និងប្រៀបធៀបទិន្នន័យជាក់ស្តែងទាក់ទងនឹង ${subTopic}។`,
                  solutionHint: 'ប្រៀបធៀបលក្ខណៈពិសេស និងទាញការសន្និដ្ឋាន។',
                },
                {
                  title: 'លំហាត់ទី៣ (បែប PISA - ស្តង់ដារអន្តរជាតិ)',
                  isPisa: true,
                  question: `បរិបទជាក់ស្តែងក្នុងជីវភាព (PISA Context)៖ សិក្សាពីស្ថានភាពជាក់ស្តែងក្នុងសហគមន៍ដែលទាក់ទងនឹង ${subTopic}។ ចូរវិភាគទិន្នន័យ និងដោះស្រាយបញ្ហា។`,
                  solutionHint: 'ប្រើប្រាស់បំណិនត្រិះរិះពិចារណា (Critical Thinking)។',
                },
              ];

        // Ensure step 4 exercises exist
        const step4Exercises =
          Array.isArray(parsedSteps.step4?.exercises) && parsedSteps.step4.exercises.length > 0
            ? parsedSteps.step4.exercises
            : [
                `លំហាត់ពង្រឹងទី១៖ សំណួរបំផុសគំនិតវាស់ស្ទង់ការយល់ដឹងរួមលើ ${subTopic}។`,
                `លំហាត់ពង្រឹងទី២៖ លំហាត់អនុវត្តសង្ខេបដើម្បីវាយតម្លៃការក្តាប់បានរបស់សិស្ស។`,
              ];

        const fullLessonPlan: LessonPlanData = {
          id: 'lesson-' + Date.now(),
          teacherInfo: {
            teacherName: teacherInfo?.teacherName || 'លោកគ្រូ/អ្នកគ្រូ',
            phoneNumber: teacherInfo?.phoneNumber || '',
            schoolName: teacherInfo?.schoolName || 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)',
            headOfTechnicalTeam: teacherInfo?.headOfTechnicalTeam || 'ប្រធានក្រុមបច្ចេកទេស',
            principalName: teacherInfo?.principalName || 'នាយកសាលា',
            date:
              teacherInfo?.date ||
              `ថ្ងៃទី ${new Date().getDate()} ខែ ${new Date().getMonth() + 1} ឆ្នាំ ${new Date().getFullYear()}`,
          },
          generalInfo: {
            subject,
            grade,
            chapter,
            lessonTitle,
            subTopic,
            duration,
            methodology,
            strategy,
          },
          objectives: parsedData.objectives,
          materials: parsedData.materials,
          steps: {
            step1: {
              ...parsedSteps.step1,
              imageUrl: illustrations.step1.url,
              imageCaption: illustrations.step1.caption,
            },
            step2: {
              ...parsedSteps.step2,
              exercises: step2Exercises,
              imageUrl: illustrations.step2.url,
              imageCaption: illustrations.step2.caption,
            },
            step3: parsedSteps.step3.map((act: any, idx: number) => ({
              ...act,
              exercise: step3Exercises[idx] || undefined,
              imageUrl: illustrations.step3.url,
              imageCaption: `រូបភាពដ្យាក្រាម៖ សកម្មភាពទី ${idx + 1}`,
            })),
            step3Exercises: step3Exercises,
            step3ImageUrl: illustrations.step3.url,
            step3ImageCaption: illustrations.step3.caption,
            step4: {
              ...parsedSteps.step4,
              exercises: step4Exercises,
              imageUrl: illustrations.step4.url,
              imageCaption: illustrations.step4.caption,
            },
            step5: {
              ...parsedSteps.step5,
              imageUrl: illustrations.step5.url,
              imageCaption: illustrations.step5.caption,
            },
          },
          assessment: parsedData.assessment,
          selfReflection: parsedData.selfReflection || '',
          updatedAt: new Date().toISOString(),
        };

        return NextResponse.json({
          success: true,
          lessonPlan: fullLessonPlan,
          isFallback: false,
          modelUsed,
        });
      }
    } catch (parseErr) {
      console.warn('Failed to parse AI JSON response, falling back to pedagogical engine:', parseErr);
    }
  }

  // Resilient Pedagogical Fallback Engine
  console.info('Using standard pedagogical engine fallback to ensure uninterrupted user service.');
  const fallbackPlan = generatePedagogicalFallbackPlan(teacherInfo, generalInfo, customPrompt);

  return NextResponse.json({
    success: true,
    lessonPlan: fallbackPlan,
    isFallback: true,
    modelUsed: 'pedagogical-engine',
    message: 'កិច្ចតែងការបង្រៀនត្រូវបានរៀបចំរួចរាល់តាមស្តង់ដារគរុកោសល្យក្រសួងអប់រំ (ដោយសារម៉ាស៊ីន AI ជួបបញ្ហា High Demand 503 បណ្តោះអាសន្ន)។',
  });
}
