import { render, screen } from '@testing-library/react';
import { renderAndCheckA11y } from '../../test-utils';
import { QuizPreview } from './QuizPreview';
import { QuestionType } from '../../types/quiz';
import type { Quiz } from '../../types/quiz';

const mockQuiz: Quiz = {
  id: '1',
  title: 'Introduction to Programming',
  description: 'Test your knowledge of basic programming concepts',
  questions: [
    {
      id: '1',
      type: QuestionType.SINGLE_CHOICE,
      title: 'What is a variable?',
      options: [
        { id: '1', text: 'A container for data', isCorrect: true },
        { id: '2', text: 'A function', isCorrect: false },
        { id: '3', text: 'A loop', isCorrect: false },
      ],
    },
    {
      id: '2',
      type: QuestionType.MULTIPLE_CHOICE,
      title: 'Which are programming languages?',
      options: [
        { id: '1', text: 'Python', isCorrect: true },
        { id: '2', text: 'HTML', isCorrect: false },
        { id: '3', text: 'JavaScript', isCorrect: true },
      ],
    },
    {
      id: '3',
      type: QuestionType.SHORT_TEXT,
      title: 'Explain what a function is',
    },
  ],
};

const emptyQuiz: Quiz = {
  id: '2',
  title: 'Empty Quiz',
  description: '',
  questions: [],
};

describe('QuizPreview', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with quiz', async () => {
      await renderAndCheckA11y(<QuizPreview quiz={mockQuiz} />);
    });

    it('should have no accessibility violations when empty', async () => {
      await renderAndCheckA11y(<QuizPreview quiz={emptyQuiz} />);
    });
  });

  describe('Quiz Header', () => {
    it('should display quiz title', () => {
      render(<QuizPreview quiz={mockQuiz} />);
      expect(
        screen.getByText('Introduction to Programming'),
      ).toBeInTheDocument();
    });

    it('should display quiz description', () => {
      render(<QuizPreview quiz={mockQuiz} />);
      expect(
        screen.getByText('Test your knowledge of basic programming concepts'),
      ).toBeInTheDocument();
    });

    it('should display "Untitled Quiz" when no title', () => {
      const quizWithoutTitle: Quiz = {
        ...mockQuiz,
        title: '',
        description: '',
      };
      render(<QuizPreview quiz={quizWithoutTitle} />);
      expect(screen.getByText('Untitled Quiz')).toBeInTheDocument();
    });
  });

  describe('Instructions', () => {
    it('should display instructions section', () => {
      render(<QuizPreview quiz={mockQuiz} />);
      expect(screen.getByText('Instructions')).toBeInTheDocument();
      expect(
        screen.getByText(/Read each question carefully/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/your answers will not be saved/i),
      ).toBeInTheDocument();
    });
  });

  describe('Questions Display', () => {
    it('should display all questions', () => {
      render(<QuizPreview quiz={mockQuiz} />);

      expect(screen.getByText('What is a variable?')).toBeInTheDocument();
      expect(
        screen.getByText('Which are programming languages?'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Explain what a function is'),
      ).toBeInTheDocument();
    });

    it('should display question numbers', () => {
      render(<QuizPreview quiz={mockQuiz} />);

      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Question 2 of 3')).toBeInTheDocument();
      expect(screen.getByText('Question 3 of 3')).toBeInTheDocument();
    });

    it('should render single choice question with radio buttons', () => {
      render(<QuizPreview quiz={mockQuiz} />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons.length).toBeGreaterThan(0);
      expect(screen.getByLabelText('A container for data')).toBeInTheDocument();
    });

    it('should render multiple choice question with checkboxes', () => {
      render(<QuizPreview quiz={mockQuiz} />);

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
      expect(screen.getByLabelText('Python')).toBeInTheDocument();
      expect(screen.getByText('Select all that apply')).toBeInTheDocument();
    });

    it('should render short text question with textarea', () => {
      render(<QuizPreview quiz={mockQuiz} />);

      expect(screen.getByLabelText(/your answer/i)).toBeInTheDocument();
    });

    it('should not show edit controls in preview mode', () => {
      render(<QuizPreview quiz={mockQuiz} />);

      expect(
        screen.queryByRole('button', { name: /remove question/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /add option/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no questions', () => {
      render(<QuizPreview quiz={emptyQuiz} />);

      expect(
        screen.getByText(/No questions in this quiz yet/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Add questions in Edit mode/i),
      ).toBeInTheDocument();
    });

    it('should not display instructions when empty', () => {
      render(<QuizPreview quiz={emptyQuiz} />);

      expect(screen.queryByText('Instructions')).not.toBeInTheDocument();
    });
  });

  describe('Footer', () => {
    it('should display footer note', () => {
      render(<QuizPreview quiz={mockQuiz} />);

      expect(
        screen.getByText(/This is a preview of your quiz/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Switch to Edit mode to make changes/i),
      ).toBeInTheDocument();
    });

    it('should not display footer when empty', () => {
      render(<QuizPreview quiz={emptyQuiz} />);

      expect(
        screen.queryByText(/This is a preview of your quiz/i),
      ).not.toBeInTheDocument();
    });
  });
});
