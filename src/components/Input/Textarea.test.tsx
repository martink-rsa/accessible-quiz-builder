import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y, checkA11y } from '@/test-utils';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with default props', async () => {
      await renderAndCheckA11y(<Textarea label="Comments" />);
    });

    it('should have no accessibility violations with error', async () => {
      await renderAndCheckA11y(
        <Textarea label="Description" error="Too short" />,
      );
    });

    it('should have no accessibility violations with help text', async () => {
      await renderAndCheckA11y(
        <Textarea label="Feedback" helpText="Share your thoughts" />,
      );
    });

    it('should have no accessibility violations when disabled', async () => {
      await renderAndCheckA11y(<Textarea label="Comments" disabled />);
    });

    it('should have no accessibility violations when required', async () => {
      await renderAndCheckA11y(<Textarea label="Description" required />);
    });

    it('should have no accessibility violations for all sizes', async () => {
      const { container } = render(
        <div>
          <Textarea label="Small" size="sm" />
          <Textarea label="Medium" size="md" />
          <Textarea label="Large" size="lg" />
        </div>,
      );

      await checkA11y(container);
    });
  });

  describe('Label Association', () => {
    it('should associate label with textarea using htmlFor', () => {
      render(<Textarea label="Comments" />);
      const textarea = screen.getByLabelText('Comments');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should use provided id for association', () => {
      render(<Textarea label="Feedback" id="custom-textarea-id" />);
      const textarea = screen.getByLabelText('Feedback');
      expect(textarea).toHaveAttribute('id', 'custom-textarea-id');
    });

    it('should generate unique id when not provided', () => {
      render(
        <div>
          <Textarea label="First" />
          <Textarea label="Second" />
        </div>,
      );

      const first = screen.getByLabelText('First');
      const second = screen.getByLabelText('Second');

      expect(first.id).toBeTruthy();
      expect(second.id).toBeTruthy();
      expect(first.id).not.toBe(second.id);
    });

    it('should show required indicator when required', () => {
      render(<Textarea label="Description" required />);
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message', () => {
      render(
        <Textarea label="Comments" error="Must be at least 10 characters" />,
      );
      expect(
        screen.getByText('Must be at least 10 characters'),
      ).toBeInTheDocument();
    });

    it('should mark textarea as invalid when error is present', () => {
      render(<Textarea label="Comments" error="Too short" />);
      const textarea = screen.getByLabelText('Comments');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });

    it('should associate error with textarea using aria-describedby', () => {
      render(<Textarea label="Comments" error="Too short" />);
      const textarea = screen.getByLabelText('Comments');
      const errorId = textarea.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Too short')).toHaveAttribute('id', errorId);
    });

    it('should have role="alert" on error message', () => {
      render(<Textarea label="Comments" error="Too short" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Too short');
    });

    it('should apply error styling to textarea', () => {
      render(<Textarea label="Comments" error="Too short" />);
      const textarea = screen.getByLabelText('Comments');
      expect(textarea).toHaveClass('border-destructive-500');
    });
  });

  describe('Help Text', () => {
    it('should display help text', () => {
      render(<Textarea label="Comments" helpText="Maximum 500 characters" />);
      expect(screen.getByText('Maximum 500 characters')).toBeInTheDocument();
    });

    it('should associate help text with textarea using aria-describedby', () => {
      render(<Textarea label="Comments" helpText="Maximum 500 characters" />);
      const textarea = screen.getByLabelText('Comments');
      const helpTextId = textarea.getAttribute('aria-describedby');
      expect(helpTextId).toBeTruthy();
      expect(screen.getByText('Maximum 500 characters')).toHaveAttribute(
        'id',
        helpTextId,
      );
    });

    it('should hide help text when error is present', () => {
      render(
        <Textarea
          label="Comments"
          helpText="Maximum 500 characters"
          error="Too long"
        />,
      );
      expect(
        screen.queryByText('Maximum 500 characters'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Too long')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size correctly', () => {
      render(<Textarea label="Small" size="sm" />);
      const textarea = screen.getByLabelText('Small');
      expect(textarea).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should render medium size correctly (default)', () => {
      render(<Textarea label="Medium" size="md" />);
      const textarea = screen.getByLabelText('Medium');
      expect(textarea).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should render large size correctly', () => {
      render(<Textarea label="Large" size="lg" />);
      const textarea = screen.getByLabelText('Large');
      expect(textarea).toHaveClass('px-4', 'py-3', 'text-lg');
    });
  });

  describe('Rows', () => {
    it('should render with default rows (4)', () => {
      render(<Textarea label="Default" />);
      expect(screen.getByLabelText('Default')).toHaveAttribute('rows', '4');
    });

    it('should render with custom rows', () => {
      render(<Textarea label="Custom" rows={10} />);
      expect(screen.getByLabelText('Custom')).toHaveAttribute('rows', '10');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Textarea label="Comments" disabled />);
      const textarea = screen.getByLabelText('Comments');
      expect(textarea).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      render(<Textarea label="Comments" disabled />);
      const textarea = screen.getByLabelText('Comments');
      expect(textarea).toHaveClass(
        'bg-neutral-100',
        'text-neutral-500',
        'cursor-not-allowed',
      );
    });

    it('should be required when required prop is true', () => {
      render(<Textarea label="Description" required />);
      const textarea = screen.getByRole('textbox', { name: /description/i });
      expect(textarea).toBeRequired();
    });

    it('should be resizable vertically', () => {
      render(<Textarea label="Resizable" />);
      const textarea = screen.getByLabelText('Resizable');
      expect(textarea).toHaveClass('resize-y');
    });
  });

  describe('User Interactions', () => {
    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<Textarea label="Comments" />);

      const textarea = screen.getByLabelText('Comments');
      await user.type(textarea, 'This is a comment');

      expect(textarea).toHaveValue('This is a comment');
    });

    it('should accept multi-line input', async () => {
      const user = userEvent.setup();
      render(<Textarea label="Comments" />);

      const textarea = screen.getByLabelText('Comments');
      await user.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');

      expect(textarea).toHaveValue('Line 1\nLine 2\nLine 3');
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Textarea label="Comments" onChange={handleChange} />);

      const textarea = screen.getByLabelText('Comments');
      await user.type(textarea, 'a');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Textarea label="Comments" disabled onChange={handleChange} />);

      const textarea = screen.getByLabelText('Comments');
      await user.type(textarea, 'test');

      expect(handleChange).not.toHaveBeenCalled();
      expect(textarea).toHaveValue('');
    });

    it('should support placeholder text', () => {
      render(
        <Textarea label="Comments" placeholder="Enter your comments here" />,
      );
      expect(
        screen.getByPlaceholderText('Enter your comments here'),
      ).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to textarea', () => {
      render(<Textarea label="Custom" className="custom-textarea-class" />);
      const textarea = screen.getByLabelText('Custom');
      expect(textarea).toHaveClass('custom-textarea-class');
    });

    it('should apply wrapperClassName to wrapper div', () => {
      const { container } = render(
        <Textarea label="Wrapper" wrapperClassName="custom-wrapper" />,
      );
      expect(container.firstChild).toHaveClass('custom-wrapper');
    });
  });

  describe('Forward Ref', () => {
    it('should forward ref to textarea element', () => {
      const ref = jest.fn();
      render(<Textarea label="Ref test" ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLTextAreaElement);
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<Textarea label="Comments" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { container } = render(<Textarea label="Disabled" disabled />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error', () => {
      const { container } = render(
        <Textarea label="Description" error="Description is required" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with help text', () => {
      const { container } = render(
        <Textarea label="Bio" helpText="Tell us about yourself" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when required', () => {
      const { container } = render(<Textarea label="Required" required />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with value', () => {
      const { container } = render(
        <Textarea label="Notes" value="Some notes here" readOnly />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with placeholder', () => {
      const { container } = render(
        <Textarea label="Comments" placeholder="Enter your comments here" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with custom rows', () => {
      const { container } = render(<Textarea label="Large" rows={10} />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
