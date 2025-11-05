import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y } from '../../test-utils';
import { ShortTextQuestion } from './ShortTextQuestion';
import { QuestionType } from '../../types/quiz';
import type { ShortTextQuestion as ShortTextQuestionType } from '../../types/quiz';

const mockQuestion: ShortTextQuestionType = {
  id: '1',
  type: QuestionType.SHORT_TEXT,
  title: 'Explain the concept of polymorphism in programming.',
};

describe('ShortTextQuestion', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations in edit mode', async () => {
      await renderAndCheckA11y(<ShortTextQuestion question={mockQuestion} />);
    });

    it('should have no accessibility violations in preview mode', async () => {
      await renderAndCheckA11y(
        <ShortTextQuestion question={mockQuestion} preview />,
      );
    });
  });

  describe('Edit Mode', () => {
    it('should render question title input', () => {
      render(<ShortTextQuestion question={mockQuestion} />);
      expect(screen.getByLabelText(/question/i)).toHaveValue(
        'Explain the concept of polymorphism in programming.',
      );
    });

    it('should call onTitleChange when title is edited', async () => {
      const user = userEvent.setup();
      const handleTitleChange = jest.fn();

      render(
        <ShortTextQuestion
          question={mockQuestion}
          onTitleChange={handleTitleChange}
        />,
      );

      const titleInput = screen.getByPlaceholderText('Enter your question');
      await user.clear(titleInput);
      await user.type(titleInput, 'New question');

      expect(handleTitleChange).toHaveBeenCalled();
    });

    it('should show help text for short text questions', () => {
      render(<ShortTextQuestion question={mockQuestion} />);
      expect(
        screen.getByText(
          'Students will provide a text response to this question',
        ),
      ).toBeInTheDocument();
    });

    it('should show preview when question has title', () => {
      render(<ShortTextQuestion question={mockQuestion} />);
      expect(screen.getByText('Preview:')).toBeInTheDocument();
      expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    });

    it('should not show preview when question title is empty', () => {
      const emptyQuestion: ShortTextQuestionType = {
        ...mockQuestion,
        title: '',
      };

      render(<ShortTextQuestion question={emptyQuestion} />);
      expect(screen.queryByText('Preview:')).not.toBeInTheDocument();
    });

    it('should show valid status when question has title', () => {
      render(<ShortTextQuestion question={mockQuestion} />);
      expect(screen.getByText('✓ Question is valid')).toBeInTheDocument();
    });

    it('should not show valid status when question title is empty', () => {
      const emptyQuestion: ShortTextQuestionType = {
        ...mockQuestion,
        title: '',
      };

      render(<ShortTextQuestion question={emptyQuestion} />);
      expect(screen.queryByText('✓ Question is valid')).not.toBeInTheDocument();
    });

    it('should display error message when provided', () => {
      render(
        <ShortTextQuestion
          question={mockQuestion}
          error="This question is invalid"
        />,
      );
      expect(screen.getByText('This question is invalid')).toBeInTheDocument();
    });

    it('should show disabled textarea in preview section', () => {
      render(<ShortTextQuestion question={mockQuestion} />);
      const textareas = screen.getAllByRole('textbox', {
        name: /student answer area/i,
      });
      expect(textareas[0]).toBeDisabled();
    });
  });

  describe('Preview Mode', () => {
    it('should render question title as label', () => {
      render(<ShortTextQuestion question={mockQuestion} preview />);
      expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    });

    it('should render textarea for student answer', () => {
      render(<ShortTextQuestion question={mockQuestion} preview />);
      const textarea = screen.getByLabelText(/your answer/i);
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute(
        'placeholder',
        'Type your answer here...',
      );
    });

    it('should not show edit controls in preview mode', () => {
      render(<ShortTextQuestion question={mockQuestion} preview />);
      expect(
        screen.queryByPlaceholderText('Enter your question'),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Preview:')).not.toBeInTheDocument();
    });

    it('should allow typing in the answer textarea', async () => {
      const user = userEvent.setup();
      render(<ShortTextQuestion question={mockQuestion} preview />);

      const textarea = screen.getByLabelText(/your answer/i);
      await user.type(
        textarea,
        'Polymorphism allows objects to take many forms',
      );

      expect(textarea).toHaveValue(
        'Polymorphism allows objects to take many forms',
      );
    });

    it('should render textarea with correct rows', () => {
      render(<ShortTextQuestion question={mockQuestion} preview />);
      const textarea = screen.getByLabelText(/your answer/i);
      expect(textarea).toHaveAttribute('rows', '4');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(
        <ShortTextQuestion question={mockQuestion} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
