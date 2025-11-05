import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y } from '../../test-utils';
import { QuestionEditor } from './QuestionEditor';
import { QuestionType } from '../../types/quiz';
import type {
  SingleChoiceQuestion,
  MultipleChoiceQuestion,
  ShortTextQuestion,
} from '../../types/quiz';

const singleChoiceQuestion: SingleChoiceQuestion = {
  id: '1',
  type: QuestionType.SINGLE_CHOICE,
  title: 'What is 2 + 2?',
  options: [
    { id: '1', text: '3', isCorrect: false },
    { id: '2', text: '4', isCorrect: true },
  ],
};

const multipleChoiceQuestion: MultipleChoiceQuestion = {
  id: '2',
  type: QuestionType.MULTIPLE_CHOICE,
  title: 'Which are even numbers?',
  options: [
    { id: '1', text: '2', isCorrect: true },
    { id: '2', text: '3', isCorrect: false },
    { id: '3', text: '4', isCorrect: true },
  ],
};

const shortTextQuestion: ShortTextQuestion = {
  id: '3',
  type: QuestionType.SHORT_TEXT,
  title: 'Explain your answer.',
};

describe('QuestionEditor', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with single choice question', async () => {
      await renderAndCheckA11y(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );
    });

    it('should have no accessibility violations with multiple choice question', async () => {
      await renderAndCheckA11y(
        <QuestionEditor
          question={multipleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );
    });

    it('should have no accessibility violations with short text question', async () => {
      await renderAndCheckA11y(
        <QuestionEditor
          question={shortTextQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );
    });
  });

  describe('Question Header', () => {
    it('should display question number and type dropdown in edit mode', () => {
      render(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onTypeChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );

      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Question 1 type')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Single Choice')).toBeInTheDocument();
    });

    it('should display correct selected type for multiple choice', () => {
      render(
        <QuestionEditor
          question={multipleChoiceQuestion}
          questionNumber={2}
          onTitleChange={jest.fn()}
          onTypeChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );

      expect(screen.getByText('Question 2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Multiple Choice')).toBeInTheDocument();
    });

    it('should display correct selected type for short text', () => {
      render(
        <QuestionEditor
          question={shortTextQuestion}
          questionNumber={3}
          onTitleChange={jest.fn()}
          onTypeChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );

      expect(screen.getByText('Question 3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Short Text')).toBeInTheDocument();
    });

    it('should not display question header in preview mode', () => {
      render(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
          preview
        />,
      );

      expect(screen.queryByText('Question 1')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: /remove/i }),
      ).not.toBeInTheDocument();
    });

    it('should call onTypeChange when dropdown value changes', async () => {
      const user = userEvent.setup();
      const handleTypeChange = jest.fn();

      render(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onTypeChange={handleTypeChange}
          onRemove={jest.fn()}
        />,
      );

      const dropdown = screen.getByLabelText('Question 1 type');
      await user.selectOptions(dropdown, QuestionType.MULTIPLE_CHOICE);

      expect(handleTypeChange).toHaveBeenCalledWith(
        QuestionType.MULTIPLE_CHOICE,
      );
    });
  });

  describe('Remove Question', () => {
    it('should call onRemove when remove button is clicked', async () => {
      const user = userEvent.setup();
      const handleRemove = jest.fn();

      render(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={handleRemove}
        />,
      );

      const removeButton = screen.getByRole('button', {
        name: /remove question 1/i,
      });
      await user.click(removeButton);

      expect(handleRemove).toHaveBeenCalled();
    });
  });

  describe('Single Choice Question', () => {
    it('should render SingleChoiceQuestion component', () => {
      render(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );

      expect(screen.getByDisplayValue('What is 2 + 2?')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    });

    it('should call onTitleChange for single choice question', async () => {
      const user = userEvent.setup();
      const handleTitleChange = jest.fn();

      render(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={handleTitleChange}
          onRemove={jest.fn()}
        />,
      );

      const titleInput = screen.getByDisplayValue('What is 2 + 2?');
      await user.clear(titleInput);
      await user.type(titleInput, 'New title');

      expect(handleTitleChange).toHaveBeenCalled();
    });
  });

  describe('Multiple Choice Question', () => {
    it('should render MultipleChoiceQuestion component', () => {
      render(
        <QuestionEditor
          question={multipleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );

      expect(
        screen.getByDisplayValue('Which are even numbers?'),
      ).toBeInTheDocument();
      expect(screen.getByDisplayValue('2')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3')).toBeInTheDocument();
      expect(screen.getByDisplayValue('4')).toBeInTheDocument();
    });
  });

  describe('Short Text Question', () => {
    it('should render ShortTextQuestion component', () => {
      render(
        <QuestionEditor
          question={shortTextQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
        />,
      );

      expect(
        screen.getByDisplayValue('Explain your answer.'),
      ).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when provided', () => {
      render(
        <QuestionEditor
          question={singleChoiceQuestion}
          questionNumber={1}
          onTitleChange={jest.fn()}
          onRemove={jest.fn()}
          error="Invalid question"
        />,
      );

      expect(screen.getByText('Invalid question')).toBeInTheDocument();
    });
  });
});
