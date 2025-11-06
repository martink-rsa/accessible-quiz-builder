import { Button } from '@components/Button';
import { Checkbox } from '@components/Checkbox';
import { Input } from '@components/Input';
import { Trash2 } from 'lucide-react';

import {
  MultipleChoiceQuestion as MultipleChoiceQuestionType,
  QuestionType,
} from '@/types/quiz';

export interface MultipleChoiceQuestionProps {
  /**
   * The multiple choice question data
   */
  question: MultipleChoiceQuestionType;

  /**
   * Callback when question title changes
   */
  onTitleChange?: (title: string) => void;

  /**
   * Callback when question type changes
   */
  onTypeChange?: (newType: QuestionType) => void;

  /**
   * Callback when an option text changes
   */
  onOptionChange?: (optionId: string, text: string) => void;

  /**
   * Callback when an option is marked/unmarked as correct
   */
  onToggleCorrect?: (optionId: string) => void;

  /**
   * Callback when an option is added
   */
  onAddOption?: () => void;

  /**
   * Callback when an option is removed
   */
  onRemoveOption?: (optionId: string) => void;

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
 * Multiple Choice Question component for quiz builder
 *
 * Features:
 * - Edit question title
 * - Add/remove options
 * - Mark correct answers with checkboxes (multiple allowed)
 * - Preview mode for student view
 * - Accessible with proper ARIA labels and keyboard navigation
 *
 * @example
 * ```tsx
 * <MultipleChoiceQuestion
 *   question={question}
 *   onTitleChange={(title) => updateQuestion(question.id, { title })}
 *   onOptionChange={(optionId, text) => updateOption(question.id, optionId, { text })}
 *   onToggleCorrect={(optionId) => toggleOptionCorrect(question.id, optionId)}
 *   onAddOption={() => addOption(question.id, createOption())}
 *   onRemoveOption={(optionId) => removeOption(question.id, optionId)}
 * />
 * ```
 */
export function MultipleChoiceQuestion({
  question,
  onTitleChange,
  onTypeChange,
  onOptionChange,
  onToggleCorrect,
  onAddOption,
  onRemoveOption,
  preview = false,
  error,
  className = '',
  questionNumber,
}: MultipleChoiceQuestionProps) {
  if (preview) {
    // Preview mode - student view
    return (
      <fieldset
        className={`rounded-lg border border-neutral-200 p-4 ${className}`}
      >
        <legend className="px-2 text-lg font-semibold">{question.title}</legend>
        <p className="mt-2 mb-4 text-sm text-neutral-600">
          Select all that apply
        </p>
        <div className="space-y-3">
          {question.options.map((option) => (
            <Checkbox
              key={option.id}
              name={`question-${question.id}-${option.id}`}
              label={option.text}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  // Edit mode - builder view
  const correctCount = question.options.filter((opt) => opt.isCorrect).length;
  const hasMinOptions = question.options.length >= 2;
  const hasCorrectAnswer = correctCount >= 1;

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

      {/* Options */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="block text-sm font-medium text-neutral-700">
            Answer Options
            <span className="text-destructive-600 ml-1" aria-label="required">
              *
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onAddOption}
            aria-label="Add option"
          >
            + Add Option
          </Button>
        </div>

        {!hasMinOptions && (
          <p className="text-destructive-600 mb-2 text-sm" role="alert">
            Add at least 2 options
          </p>
        )}

        {!hasCorrectAnswer && hasMinOptions && (
          <p className="text-destructive-600 mb-2 text-sm" role="alert">
            Mark at least one option as correct
          </p>
        )}

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div key={option.id} className="flex items-start gap-2">
              {/* Correct Answer Indicator */}
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id={`correct-${option.id}`}
                  checked={option.isCorrect}
                  onChange={() => onToggleCorrect?.(option.id)}
                  className="focus:ring-primary-500 text-primary-600 h-5 w-5 cursor-pointer rounded border-2 border-neutral-300 bg-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                  aria-label={`Mark "${option.text || `Option ${index + 1}`}" as correct answer`}
                />
              </div>

              {/* Option Text */}
              <div className="flex-1">
                <Input
                  label={`Option ${index + 1}`}
                  value={option.text}
                  onChange={(e) => onOptionChange?.(option.id, e.target.value)}
                  placeholder="Enter option text"
                  required
                  helpText={
                    option.isCorrect
                      ? 'Correct answer'
                      : 'Check box to mark as correct'
                  }
                />
              </div>

              {/* Remove Button */}
              <div className="pt-8">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveOption?.(option.id)}
                  disabled={question.options.length <= 2}
                  aria-label={`Remove option ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Summary */}
      {hasMinOptions && hasCorrectAnswer && (
        <div className="text-primary-600 mt-4 text-sm" role="status">
          ✓ Question is valid ({correctCount} correct{' '}
          {correctCount === 1 ? 'answer' : 'answers'})
        </div>
      )}
    </div>
  );
}
