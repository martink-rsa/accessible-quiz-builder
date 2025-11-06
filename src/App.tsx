import { Button } from '@components/Button';
import { ButtonGroup } from '@components/ButtonGroup';
import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { Input } from '@components/Input';
import { Textarea } from '@components/Input/Textarea';
import { PublishModal } from '@components/PublishModal/PublishModal';
import { QuestionList } from '@components/QuestionList';
import { QuizPreview } from '@components/QuizPreview';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { useQuizReducer } from '@hooks/useQuizReducer';
import { isQuizValid } from '@utils/validation';
import { Edit, Eye, Redo2, Send, Trash2, Undo2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import type { Quiz } from '@/types/quiz';

const STORAGE_KEY = 'accessible-quiz-builder-quiz';

export default function App() {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

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

  useEffect(() => {
    setStoredQuiz(quiz);
  }, [quiz, setStoredQuiz]);

  const handleClearQuiz = () => {
    clearQuiz();
    setShowClearConfirm(false);
  };

  return (
    <>
      <main className="min-h-screen bg-neutral-50">
        <Header className="mb-6" />

        <div className="mx-auto max-w-5xl p-6">
          <div className="mb-6 rounded-lg border border-neutral-200 bg-white px-6 py-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <ButtonGroup aria-label="View mode">
                <Button
                  variant={mode === 'edit' ? 'primary' : 'ghost'}
                  onClick={() => setMode('edit')}
                  aria-pressed={mode === 'edit'}
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant={mode === 'preview' ? 'primary' : 'ghost'}
                  onClick={() => setMode('preview')}
                  aria-pressed={mode === 'preview'}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
              </ButtonGroup>
            </div>

            {mode === 'edit' && (
              <div className="flex items-center gap-2 border-t border-neutral-200 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={!canUndo}
                  aria-label="Undo last change"
                >
                  <Undo2 className="h-4 w-4" />
                  Undo
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={!canRedo}
                  aria-label="Redo"
                >
                  <Redo2 className="h-4 w-4" />
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
                    <Trash2 className="h-4 w-4" />
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
                  <Send className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            )}
          </div>

          {mode === 'edit' ? (
            <div className="space-y-6">
              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Quiz Details</h2>
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

              <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">Questions</h2>
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
            <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
              <QuizPreview quiz={quiz} />
            </div>
          )}
        </div>
      </main>

      <Footer />

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        quizTitle={quiz.title}
      />
    </>
  );
}
