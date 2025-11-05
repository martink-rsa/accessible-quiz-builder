import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y } from '../../test-utils';
import { QuestionList } from './QuestionList';
import { QuestionType } from '../../types/quiz';
import type { Question } from '../../types/quiz';

const mockQuestions: Question[] = [
  {
    id: '1',
    type: QuestionType.SINGLE_CHOICE,
    title: 'Question 1',
    options: [
      { id: '1', text: 'Option 1', isCorrect: true },
      { id: '2', text: 'Option 2', isCorrect: false },
    ],
  },
  {
    id: '2',
    type: QuestionType.SHORT_TEXT,
    title: 'Question 2',
  },
];

const mockHandlers = {
  onAddQuestion: jest.fn(),
  onRemoveQuestion: jest.fn(),
  onUpdateQuestion: jest.fn(),
  onAddOption: jest.fn(),
  onRemoveOption: jest.fn(),
  onUpdateOption: jest.fn(),
  onToggleOptionCorrect: jest.fn(),
};

describe('QuestionList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations with questions', async () => {
      await renderAndCheckA11y(
        <QuestionList questions={mockQuestions} {...mockHandlers} />,
      );
    });

    it('should have no accessibility violations when empty', async () => {
      await renderAndCheckA11y(
        <QuestionList questions={[]} {...mockHandlers} />,
      );
    });
  });

  describe('Question Display', () => {
    it('should render all questions', () => {
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      expect(screen.getAllByText(/Question 1/)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Question 2/)[0]).toBeInTheDocument();
    });

    it('should display question numbers correctly', () => {
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      expect(screen.getAllByText(/Question 1/)[0]).toBeInTheDocument();
      expect(screen.getByDisplayValue('Single Choice')).toBeInTheDocument();
      expect(screen.getAllByText(/Question 2/)[0]).toBeInTheDocument();
      expect(screen.getByDisplayValue('Short Text')).toBeInTheDocument();
    });

    it('should show empty state when no questions', () => {
      render(<QuestionList questions={[]} {...mockHandlers} />);

      expect(screen.getByText(/No questions yet/i)).toBeInTheDocument();
    });
  });

  describe('Add Question', () => {
    it('should show add question button in empty state', () => {
      render(<QuestionList questions={[]} {...mockHandlers} />);

      expect(
        screen.getByRole('button', { name: /add first question/i }),
      ).toBeInTheDocument();
    });

    it('should show add question button when questions exist', () => {
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      expect(
        screen.getByRole('button', { name: /add new question/i }),
      ).toBeInTheDocument();
    });

    it('should call onAddQuestion with single choice question immediately', async () => {
      const user = userEvent.setup();
      render(<QuestionList questions={[]} {...mockHandlers} />);

      const addButton = screen.getByRole('button', {
        name: /add first question/i,
      });
      await user.click(addButton);

      expect(mockHandlers.onAddQuestion).toHaveBeenCalledWith(
        expect.objectContaining({
          type: QuestionType.SINGLE_CHOICE,
          title: '',
          options: expect.arrayContaining([
            expect.objectContaining({ text: '', isCorrect: false }),
          ]),
        }),
      );
    });

    it('should not show type selector on add', async () => {
      const user = userEvent.setup();
      render(<QuestionList questions={[]} {...mockHandlers} />);

      await user.click(
        screen.getByRole('button', { name: /add first question/i }),
      );

      // Type selector should not appear
      expect(
        screen.queryByText('Select Question Type:'),
      ).not.toBeInTheDocument();
    });
  });

  describe('Remove Question', () => {
    it('should call onRemoveQuestion when remove button is clicked', async () => {
      const user = userEvent.setup();
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      const removeButtons = screen.getAllByRole('button', {
        name: /remove question/i,
      });
      await user.click(removeButtons[0]);

      expect(mockHandlers.onRemoveQuestion).toHaveBeenCalledWith('1');
    });
  });

  describe('Update Question', () => {
    it('should call onUpdateQuestion when question title changes', async () => {
      const user = userEvent.setup();
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      const titleInput = screen.getByDisplayValue('Question 1');
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated title');

      expect(mockHandlers.onUpdateQuestion).toHaveBeenCalled();
    });
  });

  describe('Option Management', () => {
    it('should call onAddOption when add option button is clicked', async () => {
      const user = userEvent.setup();
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      const addOptionButton = screen.getByRole('button', {
        name: /add option/i,
      });
      await user.click(addOptionButton);

      expect(mockHandlers.onAddOption).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          text: '',
          isCorrect: false,
        }),
      );
    });

    it('should call onUpdateOption when option text changes', async () => {
      const user = userEvent.setup();
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      const optionInput = screen.getByDisplayValue('Option 1');
      await user.clear(optionInput);
      await user.type(optionInput, 'Updated option');

      expect(mockHandlers.onUpdateOption).toHaveBeenCalled();
    });

    it('should call onToggleOptionCorrect when correct checkbox is toggled', async () => {
      const user = userEvent.setup();
      render(<QuestionList questions={mockQuestions} {...mockHandlers} />);

      const correctRadios = screen.getAllByRole('radio', { name: /mark/i });
      // Click the second radio button (first one is already checked)
      await user.click(correctRadios[1]);

      expect(mockHandlers.onToggleOptionCorrect).toHaveBeenCalledWith('1', '2');
    });

    it('should call onRemoveOption when remove option button is clicked', async () => {
      const user = userEvent.setup();

      // Create a question with 3 options so remove button is enabled
      const questionWith3Options: Question[] = [
        {
          id: '1',
          type: QuestionType.SINGLE_CHOICE,
          title: 'Question 1',
          options: [
            { id: '1', text: 'Option 1', isCorrect: true },
            { id: '2', text: 'Option 2', isCorrect: false },
            { id: '3', text: 'Option 3', isCorrect: false },
          ],
        },
      ];

      render(
        <QuestionList questions={questionWith3Options} {...mockHandlers} />,
      );

      const removeOptionButtons = screen.getAllByRole('button', {
        name: /remove option/i,
      });
      await user.click(removeOptionButtons[0]);

      expect(mockHandlers.onRemoveOption).toHaveBeenCalledWith('1', '1');
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with questions', () => {
      const { container } = render(
        <QuestionList questions={mockQuestions} {...mockHandlers} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with empty list', () => {
      const { container } = render(
        <QuestionList questions={[]} {...mockHandlers} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
