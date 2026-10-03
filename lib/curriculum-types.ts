export interface CurriculumLesson {
  id: string;
  chapter: string;
  lessonTitle: string;
  subTopic: string;
  keyConcepts?: string[];
  suggestedMaterials?: string[];
}
