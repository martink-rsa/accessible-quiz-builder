import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y } from '../../test-utils';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { QuestionType } from '../../types/quiz';
import type { SingleChoiceQuestion as SingleChoiceQuestionType } from '../../types/quiz';

const mockQuestion: SingleChoiceQuestionType = {
  id: '1',
  type: QuestionType.SINGLE_CHOICE,
  title: 'What is the capital of France?',
  options: [
    { id: '1', text: 'Paris', isCorrect: true },
    { id: '2', text: 'London', isCorrect: false },
    { id: '3', text: 'Berlin', isCorrect: false },
  ],
};

describe('SingleChoiceQuestion', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations in edit mode', async () => {
      await renderAndCheckA11y(
        <SingleChoiceQuestion question={mockQuestion} />,
      );
    });

    it('should have no accessibility violations in preview mode', async () => {
      await renderAndCheckA11y(
        <SingleChoiceQuestion question={mockQuestion} preview />,
      );
    });
  });

  describe('Edit Mode', () => {
    it('should render question title input', () => {
      render(<SingleChoiceQuestion question={mockQuestion} />);
      expect(screen.getByLabelText(/question/i)).toHaveValue(
        'What is the capital of France?',
      );
    });

    it('should render all options', () => {
      render(<SingleChoiceQuestion question={mockQuestion} />);
      expect(screen.getByDisplayValue('Paris')).toBeInTheDocument();
      expect(screen.getByDisplayValue('London')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Berlin')).toBeInTheDocument();
    });

    it('should call onTitleChange when title is edited', async () => {
      const user = userEvent.setup();
      const handleTitleChange = jest.fn();

      render(
        <SingleChoiceQuestion
          question={mockQuestion}
          onTitleChange={handleTitleChange}
        />,
      );

      const titleInput = screen.getByLabelText(/question/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'New question');

      expect(handleTitleChange).toHaveBeenCalled();
    });

    it('should call onOptionChange when option text is edited', async () => {
      const user = userEvent.setup();
      const handleOptionChange = jest.fn();

      render(
        <SingleChoiceQuestion
          question={mockQuestion}
          onOptionChange={handleOptionChange}
        />,
      );

      const optionInput = screen.getByDisplayValue('Paris');
      await user.clear(optionInput);
      await user.type(optionInput, 'Rome');

      expect(handleOptionChange).toHaveBeenCalled();
    });

    it('should call onToggleCorrect when correct answer is changed', async () => {
      const user = userEvent.setup();
      const handleToggleCorrect = jest.fn();

      render(
        <SingleChoiceQuestion
          question={mockQuestion}
          onToggleCorrect={handleToggleCorrect}
        />,
      );

      const radioButtons = screen.getAllByRole('radio', { name: /mark/i });
      await user.click(radioButtons[1]); // Click second option

      expect(handleToggleCorrect).toHaveBeenCalled();
    });

    it('should call onAddOption when add button is clicked', async () => {
      const user = userEvent.setup();
      const handleAddOption = jest.fn();

      render(
        <SingleChoiceQuestion
          question={mockQuestion}
          onAddOption={handleAddOption}
        />,
      );

      const addButton = screen.getByRole('button', { name: /add option/i });
      await user.click(addButton);

      expect(handleAddOption).toHaveBeenCalled();
    });

    it('should call onRemoveOption when remove button is clicked', async () => {
      const user = userEvent.setup();
      const handleRemoveOption = jest.fn();

      render(
        <SingleChoiceQuestion
          question={mockQuestion}
          onRemoveOption={handleRemoveOption}
        />,
      );

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(handleRemoveOption).toHaveBeenCalled();
    });

    it('should disable remove button when only 2 options remain', () => {
      const questionWith2Options: SingleChoiceQuestionType = {
        ...mockQuestion,
        options: mockQuestion.options.slice(0, 2),
      };

      render(<SingleChoiceQuestion question={questionWith2Options} />);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      removeButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should show validation error when less than 2 options', () => {
      const questionWith1Option: SingleChoiceQuestionType = {
        ...mockQuestion,
        options: [mockQuestion.options[0]],
      };

      render(<SingleChoiceQuestion question={questionWith1Option} />);
      expect(screen.getByText('Add at least 2 options')).toBeInTheDocument();
    });

    it('should show validation error when no correct answer is selected', () => {
      const questionWithNoCorrect: SingleChoiceQuestionType = {
        ...mockQuestion,
        options: mockQuestion.options.map((opt) => ({
          ...opt,
          isCorrect: false,
        })),
      };

      render(<SingleChoiceQuestion question={questionWithNoCorrect} />);
      expect(
        screen.getByText('Mark exactly one option as correct'),
      ).toBeInTheDocument();
    });

    it('should show valid status when question is valid', () => {
      render(<SingleChoiceQuestion question={mockQuestion} />);
      expect(screen.getByText('✓ Question is valid')).toBeInTheDocument();
    });

    it('should display error message when provided', () => {
      render(
        <SingleChoiceQuestion
          question={mockQuestion}
          error="This question is invalid"
        />,
      );
      expect(screen.getByText('This question is invalid')).toBeInTheDocument();
    });
  });

  describe('Preview Mode', () => {
    it('should render as fieldset with radio buttons', () => {
      render(<SingleChoiceQuestion question={mockQuestion} preview />);

      // Should have fieldset and legend
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(
        screen.getByText('What is the capital of France?'),
      ).toBeInTheDocument();

      // Should have radio buttons for each option
      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons).toHaveLength(3);
    });

    it('should not show edit controls in preview mode', () => {
      render(<SingleChoiceQuestion question={mockQuestion} preview />);

      expect(
        screen.queryByRole('button', { name: /add option/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /remove/i }),
      ).not.toBeInTheDocument();
    });

    it('should display all option labels', () => {
      render(<SingleChoiceQuestion question={mockQuestion} preview />);

      expect(screen.getByLabelText('Paris')).toBeInTheDocument();
      expect(screen.getByLabelText('London')).toBeInTheDocument();
      expect(screen.getByLabelText('Berlin')).toBeInTheDocument();
    });

    it('should allow selecting an answer', async () => {
      const user = userEvent.setup();
      render(<SingleChoiceQuestion question={mockQuestion} preview />);

      const parisRadio = screen.getByLabelText('Paris');
      await user.click(parisRadio);

      expect(parisRadio).toBeChecked();
    });

    it('should allow only one selection at a time', async () => {
      const user = userEvent.setup();
      render(<SingleChoiceQuestion question={mockQuestion} preview />);

      const parisRadio = screen.getByLabelText('Paris');
      const londonRadio = screen.getByLabelText('London');

      await user.click(parisRadio);
      expect(parisRadio).toBeChecked();
      expect(londonRadio).not.toBeChecked();

      await user.click(londonRadio);
      expect(parisRadio).not.toBeChecked();
      expect(londonRadio).toBeChecked();
    });
  });
});
