import { Question, QuestionType } from '@/types/quiz';
import { SingleChoiceQuestion } from '@components/SingleChoiceQuestion';
import { MultipleChoiceQuestion } from '@components/MultipleChoiceQuestion';
import { ShortTextQuestion } from '@components/ShortTextQuestion';
import { Trash2 } from 'lucide-react';

export interface QuestionEditorProps {
  /**
   * The question to edit
   */
  question: Question;

  /**
   * Callback when question title changes
   */
  onTitleChange: (title: string) => void;

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
   * Callback when question is removed
   */
  onRemove: () => void;

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
   * Question number/index for display
   */
  questionNumber?: number;
}

/**
 * Question Editor component
 *
 * Routes to the appropriate question type component based on the question's type.
 *
 * @example
 * ```tsx
 * <QuestionEditor
 *   question={question}
 *   questionNumber={1}
 *   onTitleChange={(title) => updateQuestion(question.id, { title })}
 *   onRemove={() => removeQuestion(question.id)}
 * />
 * ```
 */
export function QuestionEditor({
  question,
  onTitleChange,
  onTypeChange,
  onOptionChange,
  onToggleCorrect,
  onAddOption,
  onRemoveOption,
  onRemove,
  preview = false,
  error,
  questionNumber,
}: QuestionEditorProps) {
  return (
    <div className="relative">
      {/* Question Header (Edit mode only) */}
      {!preview && (
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-neutral-900">
            Question {questionNumber}
          </h3>
          <button
            onClick={onRemove}
            className="px-3 py-1 text-sm font-medium text-destructive-600 hover:text-destructive-700 hover:bg-destructive-50 rounded-md transition-colors flex items-center gap-1.5"
            aria-label={`Remove question ${questionNumber}`}
          >
            <Trash2 className="w-4 h-4" />
            Remove Question
          </button>
        </div>
      )}

      {/* Route to appropriate question type component */}
      {question.type === QuestionType.SINGLE_CHOICE && (
        <SingleChoiceQuestion
          question={question}
          onTitleChange={onTitleChange}
          onTypeChange={onTypeChange}
          onOptionChange={onOptionChange}
          onToggleCorrect={onToggleCorrect}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
          preview={preview}
          error={error}
          questionNumber={questionNumber}
        />
      )}

      {question.type === QuestionType.MULTIPLE_CHOICE && (
        <MultipleChoiceQuestion
          question={question}
          onTitleChange={onTitleChange}
          onTypeChange={onTypeChange}
          onOptionChange={onOptionChange}
          onToggleCorrect={onToggleCorrect}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
          preview={preview}
          error={error}
          questionNumber={questionNumber}
        />
      )}

      {question.type === QuestionType.SHORT_TEXT && (
        <ShortTextQuestion
          question={question}
          onTitleChange={onTitleChange}
          onTypeChange={onTypeChange}
          preview={preview}
          error={error}
          questionNumber={questionNumber}
        />
      )}
    </div>
  );
}
