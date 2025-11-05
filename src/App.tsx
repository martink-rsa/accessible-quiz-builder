import { useState, useEffect } from 'react';
import { useQuizReducer } from './hooks/useQuizReducer';
import { useLocalStorage } from './hooks/useLocalStorage';
import { QuestionList } from './components/QuestionList';
import { QuizPreview } from './components/QuizPreview';
import { Input } from './components/Input';
import { Textarea } from './components/Input/Textarea';
import { Button } from './components/Button';
import { ButtonGroup } from './components/ButtonGroup';
import { PublishModal } from './components/PublishModal/PublishModal';
import { Edit, Eye, Trash2, Undo2, Redo2, Send } from 'lucide-react';
import { isQuizValid } from './utils/validation';
import type { Quiz } from './types/quiz';

const STORAGE_KEY = 'accessible-quiz-builder-quiz';

export default function App() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Initialize quiz from localStorage or create new
  const [storedQuiz, setStoredQuiz] = useLocalStorage<Quiz | null>(
    STORAGE_KEY,
    null,
  );

  const {
    quiz,
    canUndo,
    canRedo,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
    toggleOptionCorrect,
    updateQuizTitle,
    updateQuizDescription,
    clearQuiz,
    undo,
    redo,
  } = useQuizReducer(
    storedQuiz || {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      questions: [],
    },
  );

  // Save to localStorage whenever quiz changes
  useEffect(() => {
    setStoredQuiz(quiz);
  }, [quiz, setStoredQuiz]);

  const handleClearQuiz = () => {
    clearQuiz();
    setShowClearConfirm(false);
  };

  return (
    <main className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 -mx-6 px-6 py-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-neutral-900">
              Accessible Quiz Builder
            </h1>
            <ButtonGroup aria-label="View mode">
              <Button
                variant={mode === 'edit' ? 'primary' : 'ghost'}
                onClick={() => setMode('edit')}
                aria-pressed={mode === 'edit'}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant={mode === 'preview' ? 'primary' : 'ghost'}
                onClick={() => setMode('preview')}
                aria-pressed={mode === 'preview'}
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </ButtonGroup>
          </div>

          {/* Edit Mode Controls */}
          {mode === 'edit' && (
            <div className="flex items-center gap-2 border-t border-neutral-200 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo last change"
              >
                <Undo2 className="w-4 h-4" />
                Undo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
              >
                <Redo2 className="w-4 h-4" />
                Redo
              </Button>
              <div className="flex-1" />
              {!showClearConfirm ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowClearConfirm(true)}
                  disabled={
                    quiz.questions.length === 0 &&
                    !quiz.title &&
                    !quiz.description
                  }
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Quiz
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-700">
                    Are you sure?
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleClearQuiz}
                  >
                    Yes, Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowClearConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPublishModal(true)}
                disabled={quiz.questions.length === 0 || !isQuizValid(quiz)}
                aria-label="Publish quiz"
              >
                <Send className="w-4 h-4" />
                Publish
              </Button>
            </div>
          )}
        </header>

        {/* Content */}
        {mode === 'edit' ? (
          <div className="space-y-6">
            {/* Quiz Metadata Container */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Quiz Details</h2>
              <div className="space-y-4">
                <Input
                  label="Quiz Title"
                  value={quiz.title}
                  onChange={(e) => updateQuizTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  helpText="Give your quiz a descriptive title"
                />
                <Textarea
                  label="Quiz Description"
                  value={quiz.description || ''}
                  onChange={(e) => updateQuizDescription(e.target.value)}
                  placeholder="Enter quiz description (optional)"
                  helpText="Provide context or instructions for students"
                  rows={3}
                />
              </div>
            </div>

            {/* Questions Container */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <h2 className="text-xl font-semibold mb-4">Questions</h2>
              <QuestionList
                questions={quiz.questions}
                onAddQuestion={addQuestion}
                onRemoveQuestion={removeQuestion}
                onUpdateQuestion={updateQuestion}
                onAddOption={addOption}
                onRemoveOption={removeOption}
                onUpdateOption={updateOption}
                onToggleOptionCorrect={toggleOptionCorrect}
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <QuizPreview quiz={quiz} />
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-neutral-600">
          <p>
            Built with accessibility in mind. Follows WCAG 2.2 Level AA
            guidelines.
          </p>
        </footer>
      </div>

      {/* Publish Modal */}
      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        quizTitle={quiz.title}
      />
    </main>
  );
}
