import { LESSON_MATH } from './lessonsMath';
import { LESSON_SCIENCE } from './lessonsScience';
import { LESSON_ENGLISH } from './lessonsEnglish';
import { LESSON_FILIPINO } from './lessonsFilipino';
import { LESSON_HISTORY } from './lessonsHistory';

export const LESSON_DB: Record<string, string> = {
  ...LESSON_MATH,
  ...LESSON_SCIENCE,
  ...LESSON_ENGLISH,
  ...LESSON_FILIPINO,
  ...LESSON_HISTORY
};
