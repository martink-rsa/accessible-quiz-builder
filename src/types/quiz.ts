/**
 * Question type enum
 */
export enum QuestionType {
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_TEXT = 'short_text',
}

/**
 * Option for choice-based questions
 */
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Base question interface
 */
interface BaseQuestion {
  id: string;
  title: string;
}

/**
 * Single choice question (radio buttons)
 */
export interface SingleChoiceQuestion extends BaseQuestion {
  type: QuestionType.SINGLE_CHOICE;
  options: Option[];
}

/**
 * Multiple choice question (checkboxes)
 */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: QuestionType.MULTIPLE_CHOICE;
  options: Option[];
}

/**
 * Short text question (open-ended)
 */
export interface ShortTextQuestion extends BaseQuestion {
  type: QuestionType.SHORT_TEXT;
}

/**
 * Discriminated union of all question types
 */
export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | ShortTextQuestion;

/**
 * Quiz interface
 */
export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

/**
 * Quiz state for the reducer
 */
export interface QuizState {
  quiz: Quiz;
  history: Quiz[];
  currentHistoryIndex: number;
}

/**
 * Type guard for single choice questions
 */
export function isSingleChoiceQuestion(
  question: Question,
): question is SingleChoiceQuestion {
  return question.type === QuestionType.SINGLE_CHOICE;
}

/**
 * Type guard for multiple choice questions
 */
export function isMultipleChoiceQuestion(
  question: Question,
): question is MultipleChoiceQuestion {
  return question.type === QuestionType.MULTIPLE_CHOICE;
}

/**
 * Type guard for short text questions
 */
export function isShortTextQuestion(
  question: Question,
): question is ShortTextQuestion {
  return question.type === QuestionType.SHORT_TEXT;
}

/**
 * Type guard for choice-based questions
 */
export function isChoiceQuestion(
  question: Question,
): question is SingleChoiceQuestion | MultipleChoiceQuestion {
  return (
    question.type === QuestionType.SINGLE_CHOICE ||
    question.type === QuestionType.MULTIPLE_CHOICE
  );
}
