import { useCallback, useReducer } from 'react';

import { Option, Question, QuestionType, Quiz } from '@/types/quiz';

/**
 * Action types for the quiz reducer
 */
export enum QuizActionType {
  ADD_QUESTION = 'ADD_QUESTION',
  REMOVE_QUESTION = 'REMOVE_QUESTION',
  UPDATE_QUESTION = 'UPDATE_QUESTION',
  MOVE_QUESTION = 'MOVE_QUESTION',
  ADD_OPTION = 'ADD_OPTION',
  REMOVE_OPTION = 'REMOVE_OPTION',
  UPDATE_OPTION = 'UPDATE_OPTION',
  TOGGLE_OPTION_CORRECT = 'TOGGLE_OPTION_CORRECT',
  UPDATE_QUIZ_TITLE = 'UPDATE_QUIZ_TITLE',
  UPDATE_QUIZ_DESCRIPTION = 'UPDATE_QUIZ_DESCRIPTION',
  CLEAR_QUIZ = 'CLEAR_QUIZ',
  LOAD_QUIZ = 'LOAD_QUIZ',
  UNDO = 'UNDO',
  REDO = 'REDO',
}

/**
 * Action interfaces
 */
type QuizAction =
  | { type: QuizActionType.ADD_QUESTION; payload: { question: Question } }
  | { type: QuizActionType.REMOVE_QUESTION; payload: { questionId: string } }
  | {
      type: QuizActionType.UPDATE_QUESTION;
      payload: { questionId: string; updates: Partial<Question> | Question };
    }
  | {
      type: QuizActionType.MOVE_QUESTION;
      payload: { questionId: string; newIndex: number };
    }
  | {
      type: QuizActionType.ADD_OPTION;
      payload: { questionId: string; option: Option };
    }
  | {
      type: QuizActionType.REMOVE_OPTION;
      payload: { questionId: string; optionId: string };
    }
  | {
      type: QuizActionType.UPDATE_OPTION;
      payload: {
        questionId: string;
        optionId: string;
        updates: Partial<Option>;
      };
    }
  | {
      type: QuizActionType.TOGGLE_OPTION_CORRECT;
      payload: { questionId: string; optionId: string };
    }
  | { type: QuizActionType.UPDATE_QUIZ_TITLE; payload: { title: string } }
  | {
      type: QuizActionType.UPDATE_QUIZ_DESCRIPTION;
      payload: { description: string };
    }
  | { type: QuizActionType.CLEAR_QUIZ }
  | { type: QuizActionType.LOAD_QUIZ; payload: { quiz: Quiz } }
  | { type: QuizActionType.UNDO }
  | { type: QuizActionType.REDO };

/**
 * State interface with history for undo/redo
 */
interface QuizState {
  present: Quiz;
  past: Quiz[];
  future: Quiz[];
}

/**
 * Helper to create a new state with history
 */
function createHistoryState(
  present: Quiz,
  past: Quiz[],
  previousPresent?: Quiz,
): QuizState {
  return {
    present,
    past: previousPresent ? [...past, previousPresent] : past,
    future: [],
  };
}

/**
 * Quiz reducer with undo/redo support
 */
function quizReducer(state: QuizState, action: QuizAction): QuizState {
  const { present, past, future } = state;

  switch (action.type) {
    case QuizActionType.UNDO: {
      if (past.length === 0) return state;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      return {
        present: previous,
        past: newPast,
        future: [present, ...future],
      };
    }

    case QuizActionType.REDO: {
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      return {
        present: next,
        past: [...past, present],
        future: newFuture,
      };
    }

    case QuizActionType.ADD_QUESTION: {
      const newQuiz: Quiz = {
        ...present,
        questions: [...present.questions, action.payload.question],
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.REMOVE_QUESTION: {
      const newQuiz: Quiz = {
        ...present,
        questions: present.questions.filter(
          (q) => q.id !== action.payload.questionId,
        ),
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.UPDATE_QUESTION: {
      const newQuiz: Quiz = {
        ...present,
        questions: present.questions.map((q) =>
          q.id === action.payload.questionId
            ? ({ ...q, ...action.payload.updates } as Question)
            : q,
        ),
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.MOVE_QUESTION: {
      const { questionId, newIndex } = action.payload;
      const oldIndex = present.questions.findIndex((q) => q.id === questionId);
      if (oldIndex === -1 || oldIndex === newIndex) return state;

      const newQuestions = [...present.questions];
      const [movedQuestion] = newQuestions.splice(oldIndex, 1);
      newQuestions.splice(newIndex, 0, movedQuestion);

      const newQuiz: Quiz = {
        ...present,
        questions: newQuestions,
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.ADD_OPTION: {
      const newQuiz: Quiz = {
        ...present,
        questions: present.questions.map((q) => {
          if (q.id === action.payload.questionId) {
            if (q.type === QuestionType.SHORT_TEXT) return q;
            return {
              ...q,
              options: [...q.options, action.payload.option],
            };
          }
          return q;
        }),
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.REMOVE_OPTION: {
      const newQuiz: Quiz = {
        ...present,
        questions: present.questions.map((q) => {
          if (q.id === action.payload.questionId) {
            if (q.type === QuestionType.SHORT_TEXT) return q;
            return {
              ...q,
              options: q.options.filter(
                (opt) => opt.id !== action.payload.optionId,
              ),
            };
          }
          return q;
        }),
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.UPDATE_OPTION: {
      const newQuiz: Quiz = {
        ...present,
        questions: present.questions.map((q) => {
          if (q.id === action.payload.questionId) {
            if (q.type === QuestionType.SHORT_TEXT) return q;
            return {
              ...q,
              options: q.options.map((opt) =>
                opt.id === action.payload.optionId
                  ? { ...opt, ...action.payload.updates }
                  : opt,
              ),
            };
          }
          return q;
        }),
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.TOGGLE_OPTION_CORRECT: {
      const newQuiz: Quiz = {
        ...present,
        questions: present.questions.map((q) => {
          if (q.id === action.payload.questionId) {
            if (q.type === QuestionType.SHORT_TEXT) return q;

            // For single choice, uncheck all others when checking one
            if (q.type === QuestionType.SINGLE_CHOICE) {
              return {
                ...q,
                options: q.options.map((opt) =>
                  opt.id === action.payload.optionId
                    ? { ...opt, isCorrect: !opt.isCorrect }
                    : { ...opt, isCorrect: false },
                ),
              };
            }

            // For multiple choice, just toggle the clicked one
            return {
              ...q,
              options: q.options.map((opt) =>
                opt.id === action.payload.optionId
                  ? { ...opt, isCorrect: !opt.isCorrect }
                  : opt,
              ),
            };
          }
          return q;
        }),
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.UPDATE_QUIZ_TITLE: {
      const newQuiz: Quiz = {
        ...present,
        title: action.payload.title,
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.UPDATE_QUIZ_DESCRIPTION: {
      const newQuiz: Quiz = {
        ...present,
        description: action.payload.description,
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.CLEAR_QUIZ: {
      const newQuiz: Quiz = {
        ...present,
        title: '',
        description: '',
        questions: [],
      };
      return createHistoryState(newQuiz, past, present);
    }

    case QuizActionType.LOAD_QUIZ: {
      // Loading a quiz doesn't add to history (to avoid undo loading)
      return {
        present: action.payload.quiz,
        past: [],
        future: [],
      };
    }

    default:
      return state;
  }
}

/**
 * Initial quiz state
 */
function createInitialQuiz(): Quiz {
  return {
    id: crypto.randomUUID(),
    title: '',
    description: '',
    questions: [],
  };
}

/**
 * Hook to manage quiz state with undo/redo support
 */
export function useQuizReducer(initialQuiz?: Quiz) {
  const [state, dispatch] = useReducer(quizReducer, {
    present: initialQuiz || createInitialQuiz(),
    past: [],
    future: [],
  });

  // Action creators
  const addQuestion = useCallback((question: Question) => {
    dispatch({
      type: QuizActionType.ADD_QUESTION,
      payload: { question },
    });
  }, []);

  const removeQuestion = useCallback((questionId: string) => {
    dispatch({
      type: QuizActionType.REMOVE_QUESTION,
      payload: { questionId },
    });
  }, []);

  const updateQuestion = useCallback(
    (questionId: string, updates: Partial<Question>) => {
      dispatch({
        type: QuizActionType.UPDATE_QUESTION,
        payload: { questionId, updates },
      });
    },
    [],
  );

  const moveQuestion = useCallback((questionId: string, newIndex: number) => {
    dispatch({
      type: QuizActionType.MOVE_QUESTION,
      payload: { questionId, newIndex },
    });
  }, []);

  const addOption = useCallback((questionId: string, option: Option) => {
    dispatch({
      type: QuizActionType.ADD_OPTION,
      payload: { questionId, option },
    });
  }, []);

  const removeOption = useCallback((questionId: string, optionId: string) => {
    dispatch({
      type: QuizActionType.REMOVE_OPTION,
      payload: { questionId, optionId },
    });
  }, []);

  const updateOption = useCallback(
    (questionId: string, optionId: string, updates: Partial<Option>) => {
      dispatch({
        type: QuizActionType.UPDATE_OPTION,
        payload: { questionId, optionId, updates },
      });
    },
    [],
  );

  const toggleOptionCorrect = useCallback(
    (questionId: string, optionId: string) => {
      dispatch({
        type: QuizActionType.TOGGLE_OPTION_CORRECT,
        payload: { questionId, optionId },
      });
    },
    [],
  );

  const updateQuizTitle = useCallback((title: string) => {
    dispatch({
      type: QuizActionType.UPDATE_QUIZ_TITLE,
      payload: { title },
    });
  }, []);

  const updateQuizDescription = useCallback((description: string) => {
    dispatch({
      type: QuizActionType.UPDATE_QUIZ_DESCRIPTION,
      payload: { description },
    });
  }, []);

  const clearQuiz = useCallback(() => {
    dispatch({ type: QuizActionType.CLEAR_QUIZ });
  }, []);

  const loadQuiz = useCallback((quiz: Quiz) => {
    dispatch({
      type: QuizActionType.LOAD_QUIZ,
      payload: { quiz },
    });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: QuizActionType.UNDO });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: QuizActionType.REDO });
  }, []);

  return {
    quiz: state.present,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
    addQuestion,
    removeQuestion,
    updateQuestion,
    moveQuestion,
    addOption,
    removeOption,
    updateOption,
    toggleOptionCorrect,
    updateQuizTitle,
    updateQuizDescription,
    clearQuiz,
    loadQuiz,
    undo,
    redo,
  };
}

export type UseQuizReducerReturn = ReturnType<typeof useQuizReducer>;
