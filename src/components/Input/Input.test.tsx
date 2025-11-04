import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y, checkA11y } from '../../test-utils';
import { Input } from './Input';

describe('Input', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with default props', async () => {
      await renderAndCheckA11y(<Input label="Username" />);
    });

    it('should have no accessibility violations with error', async () => {
      await renderAndCheckA11y(
        <Input label="Email" error="Invalid email address" />,
      );
    });

    it('should have no accessibility violations with help text', async () => {
      await renderAndCheckA11y(
        <Input label="Password" helpText="Must be at least 8 characters" />,
      );
    });

    it('should have no accessibility violations when disabled', async () => {
      await renderAndCheckA11y(<Input label="Username" disabled />);
    });

    it('should have no accessibility violations when required', async () => {
      await renderAndCheckA11y(<Input label="Email" required />);
    });

    it('should have no accessibility violations for all sizes', async () => {
      const { container } = render(
        <div>
          <Input label="Small" size="sm" />
          <Input label="Medium" size="md" />
          <Input label="Large" size="lg" />
        </div>,
      );

      await checkA11y(container);
    });

    it('should have no accessibility violations for different input types', async () => {
      const { container } = render(
        <div>
          <Input label="Text" type="text" />
          <Input label="Email" type="email" />
          <Input label="Password" type="password" />
          <Input label="Number" type="number" />
          <Input label="Tel" type="tel" />
        </div>,
      );

      await checkA11y(container);
    });
  });

  describe('Label Association', () => {
    it('should associate label with input using htmlFor', () => {
      render(<Input label="Username" />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeInTheDocument();
    });

    it('should use provided id for association', () => {
      render(<Input label="Email" id="custom-email-id" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('id', 'custom-email-id');
    });

    it('should generate unique id when not provided', () => {
      render(
        <div>
          <Input label="First" />
          <Input label="Second" />
        </div>,
      );

      const first = screen.getByLabelText('First');
      const second = screen.getByLabelText('Second');

      expect(first.id).toBeTruthy();
      expect(second.id).toBeTruthy();
      expect(first.id).not.toBe(second.id);
    });

    it('should show required indicator when required', () => {
      render(<Input label="Email" required />);
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message', () => {
      render(<Input label="Email" error="Invalid email" />);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });

    it('should mark input as invalid when error is present', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should associate error with input using aria-describedby', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByLabelText('Email');
      const errorId = input.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Invalid email')).toHaveAttribute('id', errorId);
    });

    it('should have role="alert" on error message', () => {
      render(<Input label="Email" error="Invalid email" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Invalid email');
    });

    it('should apply error styling to input', () => {
      render(<Input label="Email" error="Invalid email" />);
      const input = screen.getByLabelText('Email');
      expect(input).toHaveClass('border-destructive-500');
    });
  });

  describe('Help Text', () => {
    it('should display help text', () => {
      render(<Input label="Password" helpText="Must be 8+ characters" />);
      expect(screen.getByText('Must be 8+ characters')).toBeInTheDocument();
    });

    it('should associate help text with input using aria-describedby', () => {
      render(<Input label="Password" helpText="Must be 8+ characters" />);
      const input = screen.getByLabelText('Password');
      const helpTextId = input.getAttribute('aria-describedby');
      expect(helpTextId).toBeTruthy();
      expect(screen.getByText('Must be 8+ characters')).toHaveAttribute(
        'id',
        helpTextId,
      );
    });

    it('should hide help text when error is present', () => {
      render(
        <Input
          label="Password"
          helpText="Must be 8+ characters"
          error="Too short"
        />,
      );
      expect(
        screen.queryByText('Must be 8+ characters'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Too short')).toBeInTheDocument();
    });

    it('should associate both error and help text when both present', () => {
      const { rerender } = render(
        <Input label="Password" helpText="Must be 8+ characters" />,
      );

      const input = screen.getByLabelText('Password');
      const initialDescribedBy = input.getAttribute('aria-describedby');
      expect(initialDescribedBy).toContain('help');

      rerender(<Input label="Password" error="Too short" />);
      const errorDescribedBy = input.getAttribute('aria-describedby');
      expect(errorDescribedBy).toContain('error');
    });
  });

  describe('Sizes', () => {
    it('should render small size correctly', () => {
      render(<Input label="Small" size="sm" />);
      const input = screen.getByLabelText('Small');
      expect(input).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should render medium size correctly (default)', () => {
      render(<Input label="Medium" size="md" />);
      const input = screen.getByLabelText('Medium');
      expect(input).toHaveClass('px-4', 'py-2', 'text-base');
    });

    it('should render large size correctly', () => {
      render(<Input label="Large" size="lg" />);
      const input = screen.getByLabelText('Large');
      expect(input).toHaveClass('px-4', 'py-3', 'text-lg');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input label="Username" disabled />);
      const input = screen.getByLabelText('Username');
      expect(input).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      render(<Input label="Username" disabled />);
      const input = screen.getByLabelText('Username');
      expect(input).toHaveClass(
        'bg-neutral-100',
        'text-neutral-500',
        'cursor-not-allowed',
      );
    });

    it('should be required when required prop is true', () => {
      render(<Input label="Email" required />);
      const input = screen.getByRole('textbox', { name: /email/i });
      expect(input).toBeRequired();
    });
  });

  describe('Input Types', () => {
    it('should render text input by default', () => {
      render(<Input label="Text" />);
      expect(screen.getByLabelText('Text')).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input label="Email" type="email" />);
      expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input label="Password" type="password" />);
      expect(screen.getByLabelText('Password')).toHaveAttribute(
        'type',
        'password',
      );
    });

    it('should render number input', () => {
      render(<Input label="Age" type="number" />);
      expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
    });
  });

  describe('User Interactions', () => {
    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<Input label="Username" />);

      const input = screen.getByLabelText('Username');
      await user.type(input, 'johndoe');

      expect(input).toHaveValue('johndoe');
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input label="Username" onChange={handleChange} />);

      const input = screen.getByLabelText('Username');
      await user.type(input, 'a');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should not accept input when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input label="Username" disabled onChange={handleChange} />);

      const input = screen.getByLabelText('Username');
      await user.type(input, 'test');

      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue('');
    });

    it('should support placeholder text', () => {
      render(<Input label="Email" placeholder="email@example.com" />);
      expect(
        screen.getByPlaceholderText('email@example.com'),
      ).toBeInTheDocument();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to input', () => {
      render(<Input label="Custom" className="custom-input-class" />);
      const input = screen.getByLabelText('Custom');
      expect(input).toHaveClass('custom-input-class');
    });

    it('should apply wrapperClassName to wrapper div', () => {
      const { container } = render(
        <Input label="Wrapper" wrapperClassName="custom-wrapper" />,
      );
      expect(container.firstChild).toHaveClass('custom-wrapper');
    });
  });

  describe('Forward Ref', () => {
    it('should forward ref to input element', () => {
      const ref = jest.fn();
      render(<Input label="Ref test" ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });
  });
});
