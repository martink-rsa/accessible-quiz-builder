import {
  SingleChoiceQuestion as SingleChoiceQuestionType,
  QuestionType,
} from '@/types/quiz';
import { Input } from '@components/Input';
import { Radio } from '@components/Radio';
import { Button } from '@components/Button';
import { Trash2 } from 'lucide-react';

export interface SingleChoiceQuestionProps {
  /**
   * The single choice question data
   */
  question: SingleChoiceQuestionType;

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
 * Single Choice Question component for quiz builder
 *
 * Features:
 * - Edit question title
 * - Add/remove options
 * - Mark correct answer with radio button
 * - Preview mode for student view
 * - Accessible with proper ARIA labels and keyboard navigation
 *
 * @example
 * ```tsx
 * <SingleChoiceQuestion
 *   question={question}
 *   onTitleChange={(title) => updateQuestion(question.id, { title })}
 *   onOptionChange={(optionId, text) => updateOption(question.id, optionId, { text })}
 *   onToggleCorrect={(optionId) => toggleOptionCorrect(question.id, optionId)}
 *   onAddOption={() => addOption(question.id, createOption())}
 *   onRemoveOption={(optionId) => removeOption(question.id, optionId)}
 * />
 * ```
 */
export function SingleChoiceQuestion({
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
}: SingleChoiceQuestionProps) {
  if (preview) {
    // Preview mode - student view
    return (
      <fieldset
        className={`border border-neutral-200 rounded-lg p-4 ${className}`}
      >
        <legend className="text-lg font-semibold px-2">{question.title}</legend>
        <div className="space-y-3 mt-4">
          {question.options.map((option) => (
            <Radio
              key={option.id}
              name={`question-${question.id}`}
              label={option.text}
              value={option.id}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  // Edit mode - builder view
  const correctCount = question.options.filter((opt) => opt.isCorrect).length;
  const hasMinOptions = question.options.length >= 2;
  const hasCorrectAnswer = correctCount === 1;

  return (
    <div className={`border border-neutral-200 rounded-lg p-4 ${className}`}>
      {/* Question Title and Type */}
      <div className="flex gap-3 items-start">
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
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Type
            </label>
            <select
              id={`question-type-${question.id}`}
              value={question.type}
              onChange={(e) => onTypeChange(e.target.value as QuestionType)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md bg-white text-neutral-700 hover:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
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
        <div className="flex items-center justify-between mb-2">
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
          <p className="text-sm text-destructive-600 mb-2" role="alert">
            Add at least 2 options
          </p>
        )}

        {!hasCorrectAnswer && hasMinOptions && (
          <p className="text-sm text-destructive-600 mb-2" role="alert">
            Mark exactly one option as correct
          </p>
        )}

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <div key={option.id} className="flex items-start gap-2">
              {/* Correct Answer Indicator */}
              <div className="flex items-center pt-8">
                <input
                  type="radio"
                  id={`correct-${option.id}`}
                  name={`correct-${question.id}`}
                  checked={option.isCorrect}
                  onChange={() => onToggleCorrect?.(option.id)}
                  className="w-5 h-5 border-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-neutral-300 focus:ring-primary-500 text-primary-600 bg-white cursor-pointer"
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
                      : 'Select radio to mark as correct'
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
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validation Summary */}
      {hasMinOptions && hasCorrectAnswer && (
        <div className="mt-4 text-sm text-primary-600" role="status">
          ✓ Question is valid
        </div>
      )}
    </div>
  );
}
