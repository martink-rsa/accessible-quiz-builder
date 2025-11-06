import { QuestionType } from '@/types/quiz';
import { Button } from '@components/Button';

export interface QuestionTypeSelectorProps {
  /**
   * Callback when a question type is selected
   */
  onSelect: (type: QuestionType) => void;

  /**
   * Additional class name for the wrapper
   */
  className?: string;
}

/**
 * Question Type Selector component
 *
 * Allows users to select which type of question to add to the quiz.
 *
 * @example
 * ```tsx
 * <QuestionTypeSelector
 *   onSelect={(type) => addNewQuestion(type)}
 * />
 * ```
 */
export function QuestionTypeSelector({
  onSelect,
  className = '',
}: QuestionTypeSelectorProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <h3 className="text-sm font-medium text-neutral-700">
        Select Question Type:
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() => onSelect(QuestionType.SINGLE_CHOICE)}
          aria-label="Add single choice question"
        >
          Single Choice
        </Button>
        <Button
          variant="primary"
          onClick={() => onSelect(QuestionType.MULTIPLE_CHOICE)}
          aria-label="Add multiple choice question"
        >
          Multiple Choice
        </Button>
        <Button
          variant="primary"
          onClick={() => onSelect(QuestionType.SHORT_TEXT)}
          aria-label="Add short text question"
        >
          Short Text
        </Button>
      </div>
      <p className="text-sm text-neutral-600">
        <strong>Single Choice:</strong> Students select one answer (radio
        buttons)
        <br />
        <strong>Multiple Choice:</strong> Students select multiple answers
        (checkboxes)
        <br />
        <strong>Short Text:</strong> Students type a text response
      </p>
    </div>
  );
}
