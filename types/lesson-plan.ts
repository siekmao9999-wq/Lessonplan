export interface TeacherInfo {
  teacherName: string;
  phoneNumber?: string;
  schoolName: string;
  headOfTechnicalTeam?: string;
  principalName?: string;
  date: string;
}

export interface LessonGeneralInfo {
  subject: string;
  grade: string;
  chapter: string;
  lessonTitle: string;
  subTopic: string;
  duration: string;
  methodology: string;
  strategy: string;
}

export interface LessonObjectives {
  knowledge: string[];
  skills: string[];
  attitude: string[];
}

export interface TeachingMaterials {
  teacherMaterials: string[];
  studentMaterials: string[];
}

export interface StepItem {
  time: string;
  content: string;
  teacherActivity: string;
  studentActivity: string;
  exercises?: string[]; // លំហាត់រំឭក (ជំហានទី២) ឬ លំហាត់ពង្រឹង (ជំហានទី៤)
  imageUrl?: string; // រូបភាពដ្យាក្រាម/ឧបទេសប្រចាំជំហាន
  imageCaption?: string;
}

export interface Step3Exercise {
  id?: string;
  title: string; // ឧ. "លំហាត់ទី១", "លំហាត់ទី២", "លំហាត់ទី៣ (បែប PISA)"
  question: string;
  isPisa?: boolean; // សម្គាល់លំហាត់ស្តង់ដារ PISA
  solutionHint?: string; // ការណែនាំដំណោះស្រាយ
}

export interface Step3Activity {
  activityTitle: string;
  time: string;
  content: string;
  teacherActivity: string;
  studentActivity: string;
  exercise?: Step3Exercise; // លំហាត់ភ្ជាប់ក្នុងសកម្មភាព
  imageUrl?: string; // រូបភាពប្រចាំសកម្មភាព
  imageCaption?: string;
}

export interface LessonSteps {
  step1: StepItem; // រដ្ឋបាលថ្នាក់
  step2: StepItem; // រំឭកមេរៀនចាស់ (មានលំហាត់ ១ ឬ ២)
  step3: Step3Activity[]; // មេរៀនថ្មី (មានសកម្មភាពលម្អិត)
  step3Exercises?: Step3Exercise[]; // លំហាត់ ១, ២, ៣ (រួមទាំង PISA) នៃជំហានទី៣
  step3ImageUrl?: string; // រូបភាពរួមនៃជំហានទី៣
  step3ImageCaption?: string;
  step4: StepItem; // ពង្រឹងចំណេះដឹង (មានលំហាត់ ១ ឬ ២)
  step5: StepItem; // កិច្ចការផ្ទះ និងបណ្តាំផ្ញើ
}

export interface LessonAssessment {
  diagnostic: string;
  formative: string;
  summative: string;
}

export interface LessonPlanData {
  id?: string;
  teacherInfo: TeacherInfo;
  generalInfo: LessonGeneralInfo;
  objectives: LessonObjectives;
  materials: TeachingMaterials;
  steps: LessonSteps;
  assessment: LessonAssessment;
  selfReflection?: string;
  updatedAt?: string;
}

export interface GenerateLessonRequest {
  teacherInfo: TeacherInfo;
  generalInfo: LessonGeneralInfo;
  additionalNotes?: string;
}
