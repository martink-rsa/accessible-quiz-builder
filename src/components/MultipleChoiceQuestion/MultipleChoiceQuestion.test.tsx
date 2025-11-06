import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderAndCheckA11y } from '@/test-utils';
import { QuestionType } from '@/types/quiz';
import type { MultipleChoiceQuestion as MultipleChoiceQuestionType } from '@/types/quiz';

import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';

const mockQuestion: MultipleChoiceQuestionType = {
  id: '1',
  type: QuestionType.MULTIPLE_CHOICE,
  title: 'Which are programming languages?',
  options: [
    { id: '1', text: 'Python', isCorrect: true },
    { id: '2', text: 'HTML', isCorrect: false },
    { id: '3', text: 'JavaScript', isCorrect: true },
  ],
};

describe('MultipleChoiceQuestion', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations in edit mode', async () => {
      await renderAndCheckA11y(
        <MultipleChoiceQuestion question={mockQuestion} />,
      );
    });

    it('should have no accessibility violations in preview mode', async () => {
      await renderAndCheckA11y(
        <MultipleChoiceQuestion question={mockQuestion} preview />,
      );
    });
  });

  describe('Edit Mode', () => {
    it('should render question title input', () => {
      render(<MultipleChoiceQuestion question={mockQuestion} />);
      expect(screen.getByLabelText(/question/i)).toHaveValue(
        'Which are programming languages?',
      );
    });

    it('should render all options', () => {
      render(<MultipleChoiceQuestion question={mockQuestion} />);
      expect(screen.getByDisplayValue('Python')).toBeInTheDocument();
      expect(screen.getByDisplayValue('HTML')).toBeInTheDocument();
      expect(screen.getByDisplayValue('JavaScript')).toBeInTheDocument();
    });

    it('should call onTitleChange when title is edited', async () => {
      const user = userEvent.setup();
      const handleTitleChange = jest.fn();

      render(
        <MultipleChoiceQuestion
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
        <MultipleChoiceQuestion
          question={mockQuestion}
          onOptionChange={handleOptionChange}
        />,
      );

      const optionInput = screen.getByDisplayValue('Python');
      await user.clear(optionInput);
      await user.type(optionInput, 'Java');

      expect(handleOptionChange).toHaveBeenCalled();
    });

    it('should call onToggleCorrect when correct answer is changed', async () => {
      const user = userEvent.setup();
      const handleToggleCorrect = jest.fn();

      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          onToggleCorrect={handleToggleCorrect}
        />,
      );

      const checkboxes = screen.getAllByRole('checkbox', { name: /mark/i });
      await user.click(checkboxes[1]); // Click second option

      expect(handleToggleCorrect).toHaveBeenCalled();
    });

    it('should call onAddOption when add button is clicked', async () => {
      const user = userEvent.setup();
      const handleAddOption = jest.fn();

      render(
        <MultipleChoiceQuestion
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
        <MultipleChoiceQuestion
          question={mockQuestion}
          onRemoveOption={handleRemoveOption}
        />,
      );

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      await user.click(removeButtons[0]);

      expect(handleRemoveOption).toHaveBeenCalled();
    });

    it('should disable remove button when only 2 options remain', () => {
      const questionWith2Options: MultipleChoiceQuestionType = {
        ...mockQuestion,
        options: mockQuestion.options.slice(0, 2),
      };

      render(<MultipleChoiceQuestion question={questionWith2Options} />);

      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      removeButtons.forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should show validation error when less than 2 options', () => {
      const questionWith1Option: MultipleChoiceQuestionType = {
        ...mockQuestion,
        options: [mockQuestion.options[0]],
      };

      render(<MultipleChoiceQuestion question={questionWith1Option} />);
      expect(screen.getByText('Add at least 2 options')).toBeInTheDocument();
    });

    it('should show validation error when no correct answer is selected', () => {
      const questionWithNoCorrect: MultipleChoiceQuestionType = {
        ...mockQuestion,
        options: mockQuestion.options.map((opt) => ({
          ...opt,
          isCorrect: false,
        })),
      };

      render(<MultipleChoiceQuestion question={questionWithNoCorrect} />);
      expect(
        screen.getByText('Mark at least one option as correct'),
      ).toBeInTheDocument();
    });

    it('should show valid status when question is valid', () => {
      render(<MultipleChoiceQuestion question={mockQuestion} />);
      expect(
        screen.getByText(/✓ Question is valid.*2 correct answers/),
      ).toBeInTheDocument();
    });

    it('should show singular "answer" when only one correct answer', () => {
      const questionWithOneCorrect: MultipleChoiceQuestionType = {
        ...mockQuestion,
        options: [
          { id: '1', text: 'Python', isCorrect: true },
          { id: '2', text: 'HTML', isCorrect: false },
        ],
      };

      render(<MultipleChoiceQuestion question={questionWithOneCorrect} />);
      expect(
        screen.getByText(/✓ Question is valid.*1 correct answer/),
      ).toBeInTheDocument();
    });

    it('should display error message when provided', () => {
      render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          error="This question is invalid"
        />,
      );
      expect(screen.getByText('This question is invalid')).toBeInTheDocument();
    });
  });

  describe('Preview Mode', () => {
    it('should render as fieldset with checkboxes', () => {
      render(<MultipleChoiceQuestion question={mockQuestion} preview />);

      // Should have fieldset and legend
      expect(screen.getByRole('group')).toBeInTheDocument();
      expect(
        screen.getByText('Which are programming languages?'),
      ).toBeInTheDocument();

      // Should have checkboxes for each option
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('should show "Select all that apply" instruction', () => {
      render(<MultipleChoiceQuestion question={mockQuestion} preview />);
      expect(screen.getByText('Select all that apply')).toBeInTheDocument();
    });

    it('should not show edit controls in preview mode', () => {
      render(<MultipleChoiceQuestion question={mockQuestion} preview />);

      expect(
        screen.queryByRole('button', { name: /add option/i }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /remove/i }),
      ).not.toBeInTheDocument();
    });

    it('should display all option labels', () => {
      render(<MultipleChoiceQuestion question={mockQuestion} preview />);

      expect(screen.getByLabelText('Python')).toBeInTheDocument();
      expect(screen.getByLabelText('HTML')).toBeInTheDocument();
      expect(screen.getByLabelText('JavaScript')).toBeInTheDocument();
    });

    it('should allow selecting multiple answers', async () => {
      const user = userEvent.setup();
      render(<MultipleChoiceQuestion question={mockQuestion} preview />);

      const pythonCheckbox = screen.getByLabelText('Python');
      const jsCheckbox = screen.getByLabelText('JavaScript');

      await user.click(pythonCheckbox);
      await user.click(jsCheckbox);

      expect(pythonCheckbox).toBeChecked();
      expect(jsCheckbox).toBeChecked();
    });

    it('should allow unchecking selected answers', async () => {
      const user = userEvent.setup();
      render(<MultipleChoiceQuestion question={mockQuestion} preview />);

      const pythonCheckbox = screen.getByLabelText('Python');

      await user.click(pythonCheckbox);
      expect(pythonCheckbox).toBeChecked();

      await user.click(pythonCheckbox);
      expect(pythonCheckbox).not.toBeChecked();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot in edit mode', () => {
      const { container } = render(
        <MultipleChoiceQuestion question={mockQuestion} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot in preview mode', () => {
      const { container } = render(
        <MultipleChoiceQuestion question={mockQuestion} preview />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with custom className', () => {
      const { container } = render(
        <MultipleChoiceQuestion
          question={mockQuestion}
          className="custom-class"
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
