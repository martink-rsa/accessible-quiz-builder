import * as yup from 'yup';

import { QuestionType } from '@/types/quiz';

/**
 * Option schema for choice-based questions
 */
const optionSchema = yup.object({
  id: yup.string().required('Option ID is required'),
  text: yup.string().required('Option text is required'),
  isCorrect: yup.boolean().required(),
});

/**
 * Single choice question schema
 */
const singleChoiceQuestionSchema = yup.object({
  id: yup.string().required('Question ID is required'),
  type: yup
    .string()
    .oneOf([QuestionType.SINGLE_CHOICE])
    .required('Question type is required'),
  title: yup.string().required('Question title is required'),
  options: yup
    .array()
    .of(optionSchema)
    .min(2, 'Single choice questions must have at least 2 options')
    .required('Options are required')
    .test(
      'has-correct-answer',
      'Single choice questions must have exactly one correct answer',
      (options) => {
        if (!options) return false;
        const correctCount = options.filter((opt) => opt.isCorrect).length;
        return correctCount === 1;
      },
    ),
});

/**
 * Multiple choice question schema
 */
const multipleChoiceQuestionSchema = yup.object({
  id: yup.string().required('Question ID is required'),
  type: yup
    .string()
    .oneOf([QuestionType.MULTIPLE_CHOICE])
    .required('Question type is required'),
  title: yup.string().required('Question title is required'),
  options: yup
    .array()
    .of(optionSchema)
    .min(2, 'Multiple choice questions must have at least 2 options')
    .required('Options are required')
    .test(
      'has-correct-answer',
      'Multiple choice questions must have at least one correct answer',
      (options) => {
        if (!options) return false;
        const correctCount = options.filter((opt) => opt.isCorrect).length;
        return correctCount >= 1;
      },
    ),
});

/**
 * Short text question schema
 */
const shortTextQuestionSchema = yup.object({
  id: yup.string().required('Question ID is required'),
  type: yup
    .string()
    .oneOf([QuestionType.SHORT_TEXT])
    .required('Question type is required'),
  title: yup.string().required('Question title is required'),
});

/**
 * Question schema (discriminated union)
 */
export const questionSchema = yup.lazy((value) => {
  switch (value?.type) {
    case QuestionType.SINGLE_CHOICE:
      return singleChoiceQuestionSchema;
    case QuestionType.MULTIPLE_CHOICE:
      return multipleChoiceQuestionSchema;
    case QuestionType.SHORT_TEXT:
      return shortTextQuestionSchema;
    default:
      return yup.object();
  }
});

/**
 * Quiz schema
 */
export const quizSchema = yup.object({
  id: yup.string().required('Quiz ID is required'),
  title: yup.string().required('Quiz title is required'),
  description: yup.string(),
  questions: yup.array().of(questionSchema).required('Questions are required'),
});

/**
 * Validate a question
 */
export async function validateQuestion(question: unknown): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
}> {
  try {
    await questionSchema.validate(question, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Validate a quiz
 */
export async function validateQuiz(quiz: unknown): Promise<{
  isValid: boolean;
  errors: Record<string, string>;
}> {
  try {
    await quizSchema.validate(quiz, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

/**
 * Check if a question is valid (sync check without detailed errors)
 */
export function isQuestionValid(question: unknown): boolean {
  try {
    questionSchema.validateSync(question);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a quiz is valid (sync check without detailed errors)
 */
export function isQuizValid(quiz: unknown): boolean {
  try {
    quizSchema.validateSync(quiz);
    return true;
  } catch {
    return false;
  }
}
