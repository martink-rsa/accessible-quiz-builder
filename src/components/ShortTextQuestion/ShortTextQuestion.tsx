import { Input } from '@components/Input';
import { Textarea } from '@components/Input/Textarea';

import {
  QuestionType,
  ShortTextQuestion as ShortTextQuestionType,
} from '@/types/quiz';

export interface ShortTextQuestionProps {
  /**
   * The short text question data
   */
  question: ShortTextQuestionType;

  /**
   * Callback when question title changes
   */
  onTitleChange?: (title: string) => void;

  /**
   * Callback when question type changes
   */
  onTypeChange?: (newType: QuestionType) => void;

  /**
   * Whether the component is in preview mode (read-only)
   * @default false
   */
  preview?: boolean;

  /**
   * Error message for the question
   */
  error?: string;

  /**
   * Additional class name for the wrapper
   */
  className?: string;

  /**
   * Question number/index for display
   */
  questionNumber?: number;
}

/**
 * Short Text Question component for quiz builder
 *
 * Features:
 * - Edit question title
 * - Preview mode shows textarea for student answer
 * - Accessible with proper ARIA labels and keyboard navigation
 *
 * @example
 * ```tsx
 * <ShortTextQuestion
 *   question={question}
 *   onTitleChange={(title) => updateQuestion(question.id, { title })}
 * />
 * ```
 */
export function ShortTextQuestion({
  question,
  onTitleChange,
  onTypeChange,
  preview = false,
  error,
  className = '',
  questionNumber,
}: ShortTextQuestionProps) {
  if (preview) {
    // Preview mode - student view
    return (
      <div className={`rounded-lg border border-neutral-200 p-4 ${className}`}>
        <label className="mb-4 block text-lg font-semibold">
          {question.title}
        </label>
        <Textarea
          label="Your Answer"
          placeholder="Type your answer here..."
          rows={4}
        />
      </div>
    );
  }

  // Edit mode - builder view
  const hasTitle = question.title.trim().length > 0;

  return (
    <div className={`rounded-lg border border-neutral-200 p-4 ${className}`}>
      {/* Question Title and Type */}
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <Input
            label="Question"
            value={question.title}
            onChange={(e) => onTitleChange?.(e.target.value)}
            placeholder="Enter your question"
            required
            error={error}
            helpText="Students will provide a text response to this question"
          />
        </div>
        {!preview && onTypeChange && (
          <div className="w-48">
            <label
              htmlFor={`question-type-${question.id}`}
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Type
            </label>
            <select
              id={`question-type-${question.id}`}
              value={question.type}
              onChange={(e) => onTypeChange(e.target.value as QuestionType)}
              className="focus:ring-primary-500 focus:border-primary-500 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-700 transition-colors hover:border-neutral-400 focus:ring-2 focus:outline-none"
              aria-label={`Question ${questionNumber} type`}
            >
              <option value={QuestionType.SINGLE_CHOICE}>Single Choice</option>
              <option value={QuestionType.MULTIPLE_CHOICE}>
                Multiple Choice
              </option>
              <option value={QuestionType.SHORT_TEXT}>Short Text</option>
            </select>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {hasTitle && (
        <div className="mt-4 border-t border-neutral-200 pt-4">
          <p className="mb-2 text-sm font-medium text-neutral-700">Preview:</p>
          <p className="mb-2 text-base text-neutral-900">{question.title}</p>
          <Textarea
            label="Student answer area"
            placeholder="Type your answer here..."
            rows={3}
            disabled
            size="sm"
          />
        </div>
      )}

      {/* Validation Summary */}
      {hasTitle && (
        <div className="text-primary-600 mt-4 text-sm" role="status">
          ✓ Question is valid
        </div>
      )}
    </div>
  );
}
