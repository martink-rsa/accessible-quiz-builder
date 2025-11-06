import { Button } from '@components/Button';
import { QuestionEditor } from '@components/QuestionEditor';

import { Option, Question, QuestionType } from '@/types/quiz';

export interface QuestionListProps {
  /**
   * Array of questions
   */
  questions: Question[];

  /**
   * Callback when a question is added
   */
  onAddQuestion: (question: Question) => void;

  /**
   * Callback when a question is removed
   */
  onRemoveQuestion: (questionId: string) => void;

  /**
   * Callback when a question is updated
   */
  onUpdateQuestion: (questionId: string, updates: Partial<Question>) => void;

  /**
   * Callback when an option is added to a question
   */
  onAddOption: (questionId: string, option: Option) => void;

  /**
   * Callback when an option is removed from a question
   */
  onRemoveOption: (questionId: string, optionId: string) => void;

  /**
   * Callback when an option is updated
   */
  onUpdateOption: (
    questionId: string,
    optionId: string,
    updates: Partial<Option>,
  ) => void;

  /**
   * Callback when an option's correct status is toggled
   */
  onToggleOptionCorrect: (questionId: string, optionId: string) => void;
}

/**
 * Question List component
 *
 * Manages the list of questions with add/remove functionality.
 *
 * @example
 * ```tsx
 * <QuestionList
 *   questions={quiz.questions}
 *   onAddQuestion={addQuestion}
 *   onRemoveQuestion={removeQuestion}
 *   onUpdateQuestion={updateQuestion}
 *   onAddOption={addOption}
 *   onRemoveOption={removeOption}
 *   onUpdateOption={updateOption}
 *   onToggleOptionCorrect={toggleOptionCorrect}
 * />
 * ```
 */
export function QuestionList({
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestion,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onToggleOptionCorrect,
}: QuestionListProps) {
  const handleAddQuestion = () => {
    // Create a new Single Choice question by default
    const newQuestion = createQuestion(QuestionType.SINGLE_CHOICE);
    onAddQuestion(newQuestion);
  };

  const handleTypeChange = (questionId: string, newType: QuestionType) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question || question.type === newType) return;

    // Create new question with same ID and title but new type
    const newQuestion = createQuestion(newType);
    newQuestion.id = questionId;
    newQuestion.title = question.title;

    // Replace the entire question object
    onUpdateQuestion(questionId, newQuestion as Partial<Question>);
  };

  return (
    <div className="space-y-6">
      {/* Questions List */}
      {questions.length > 0 && (
        <div className="space-y-6">
          {questions.map((question, index) => (
            <QuestionEditor
              key={question.id}
              question={question}
              questionNumber={index + 1}
              onTitleChange={(title) =>
                onUpdateQuestion(question.id, { title })
              }
              onTypeChange={(newType) => handleTypeChange(question.id, newType)}
              onOptionChange={(optionId, text) =>
                onUpdateOption(question.id, optionId, { text })
              }
              onToggleCorrect={(optionId) =>
                onToggleOptionCorrect(question.id, optionId)
              }
              onAddOption={() => {
                const newOption = createOption();
                onAddOption(question.id, newOption);
              }}
              onRemoveOption={(optionId) =>
                onRemoveOption(question.id, optionId)
              }
              onRemove={() => onRemoveQuestion(question.id)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {questions.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-neutral-300 py-12 text-center">
          <p className="mb-4 text-neutral-600">No questions yet</p>
          <p className="mb-6 text-sm text-neutral-500">
            Get started by adding your first question to the quiz
          </p>
          <Button
            variant="primary"
            onClick={handleAddQuestion}
            aria-label="Add first question"
          >
            + Add Question
          </Button>
        </div>
      )}

      {/* Add Question Section (when questions exist) */}
      {questions.length > 0 && (
        <div className="border-t border-neutral-200 pt-6">
          <Button
            variant="primary"
            onClick={handleAddQuestion}
            aria-label="Add new question"
          >
            + Add Question
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Helper function to create a new question
 */
function createQuestion(type: QuestionType): Question {
  const id = crypto.randomUUID();

  switch (type) {
    case QuestionType.SINGLE_CHOICE:
      return {
        id,
        type: QuestionType.SINGLE_CHOICE,
        title: '',
        options: [createOption(), createOption()],
      };

    case QuestionType.MULTIPLE_CHOICE:
      return {
        id,
        type: QuestionType.MULTIPLE_CHOICE,
        title: '',
        options: [createOption(), createOption()],
      };

    case QuestionType.SHORT_TEXT:
      return {
        id,
        type: QuestionType.SHORT_TEXT,
        title: '',
      };
  }
}

/**
 * Helper function to create a new option
 */
function createOption(): Option {
  return {
    id: crypto.randomUUID(),
    text: '',
    isCorrect: false,
  };
}
