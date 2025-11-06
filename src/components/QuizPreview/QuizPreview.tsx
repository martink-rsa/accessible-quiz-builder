import { QuestionEditor } from '@components/QuestionEditor';

import { Quiz } from '@/types/quiz';

export interface QuizPreviewProps {
  /**
   * The quiz to preview
   */
  quiz: Quiz;

  /**
   * Additional class name for the wrapper
   */
  className?: string;
}

/**
 * Quiz Preview component
 *
 * Shows a read-only preview of the quiz as students would see it.
 *
 * @example
 * ```tsx
 * <QuizPreview quiz={quiz} />
 * ```
 */
export function QuizPreview({ quiz, className = '' }: QuizPreviewProps) {
  if (quiz.questions.length === 0) {
    return (
      <div className={`py-12 text-center ${className}`}>
        <p className="text-lg text-neutral-600">
          No questions in this quiz yet. Add questions in Edit mode to see them
          here.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Quiz Header */}
      <div className="mb-8">
        {quiz.title && (
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">
            {quiz.title}
          </h1>
        )}
        {quiz.description && (
          <p className="text-lg text-neutral-600">{quiz.description}</p>
        )}
        {!quiz.title && !quiz.description && (
          <h1 className="mb-2 text-3xl font-bold text-neutral-900">
            Untitled Quiz
          </h1>
        )}
      </div>

      {/* Quiz Instructions */}
      <div className="bg-primary-50 border-primary-200 mb-6 rounded-lg border p-4">
        <h2 className="text-primary-900 mb-2 text-lg font-semibold">
          Instructions
        </h2>
        <ul className="text-primary-800 list-inside list-disc space-y-1 text-sm">
          <li>Read each question carefully</li>
          <li>Select your answer(s) for choice questions</li>
          <li>Type your response for text questions</li>
          <li>This is a preview - your answers will not be saved</li>
        </ul>
      </div>

      {/* Questions */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        {quiz.questions.map((question, index) => (
          <div key={question.id}>
            <div className="mb-2">
              <span className="text-sm font-medium text-neutral-600">
                Question {index + 1} of {quiz.questions.length}
              </span>
            </div>
            <QuestionEditor
              question={question}
              questionNumber={index + 1}
              onTitleChange={() => {}}
              onRemove={() => {}}
              preview={true}
            />
          </div>
        ))}
      </form>

      {/* Footer Note */}
      <div className="mt-8 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
        <p className="text-center text-sm text-neutral-600">
          This is a preview of your quiz. Switch to Edit mode to make changes.
        </p>
      </div>
    </div>
  );
}
