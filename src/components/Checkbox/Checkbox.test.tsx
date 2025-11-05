import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y, checkA11y } from '../../test-utils';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with default props', async () => {
      await renderAndCheckA11y(<Checkbox label="I agree to terms" />);
    });

    it('should have no accessibility violations with error', async () => {
      await renderAndCheckA11y(
        <Checkbox label="Accept terms" error="You must accept the terms" />,
      );
    });

    it('should have no accessibility violations with help text', async () => {
      await renderAndCheckA11y(
        <Checkbox
          label="Subscribe to newsletter"
          helpText="You can unsubscribe at any time"
        />,
      );
    });

    it('should have no accessibility violations when disabled', async () => {
      await renderAndCheckA11y(<Checkbox label="I agree to terms" disabled />);
    });

    it('should have no accessibility violations when required', async () => {
      await renderAndCheckA11y(<Checkbox label="Accept terms" required />);
    });

    it('should have no accessibility violations for all sizes', async () => {
      const { container } = render(
        <div>
          <Checkbox label="Small" size="sm" />
          <Checkbox label="Medium" size="md" />
          <Checkbox label="Large" size="lg" />
        </div>,
      );

      await checkA11y(container);
    });

    it('should have no accessibility violations when checked', async () => {
      await renderAndCheckA11y(<Checkbox label="I agree to terms" checked />);
    });
  });

  describe('Label Association', () => {
    it('should associate label with checkbox using htmlFor', () => {
      render(<Checkbox label="I agree to terms" />);
      const checkbox = screen.getByLabelText('I agree to terms');
      expect(checkbox).toBeInTheDocument();
    });

    it('should use provided id for association', () => {
      render(<Checkbox label="Accept terms" id="custom-checkbox-id" />);
      const checkbox = screen.getByLabelText('Accept terms');
      expect(checkbox).toHaveAttribute('id', 'custom-checkbox-id');
    });

    it('should generate unique id when not provided', () => {
      render(
        <div>
          <Checkbox label="First" />
          <Checkbox label="Second" />
        </div>,
      );

      const first = screen.getByLabelText('First');
      const second = screen.getByLabelText('Second');

      expect(first.id).toBeTruthy();
      expect(second.id).toBeTruthy();
      expect(first.id).not.toBe(second.id);
    });

    it('should show required indicator when required', () => {
      render(<Checkbox label="Accept terms" required />);
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message', () => {
      render(<Checkbox label="Accept terms" error="You must accept" />);
      expect(screen.getByText('You must accept')).toBeInTheDocument();
    });

    it('should mark checkbox as invalid when error is present', () => {
      render(<Checkbox label="Accept terms" error="You must accept" />);
      const checkbox = screen.getByLabelText('Accept terms');
      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    });

    it('should associate error with checkbox using aria-describedby', () => {
      render(<Checkbox label="Accept terms" error="You must accept" />);
      const checkbox = screen.getByLabelText('Accept terms');
      const errorId = checkbox.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('You must accept')).toHaveAttribute(
        'id',
        errorId,
      );
    });

    it('should have role="alert" on error message', () => {
      render(<Checkbox label="Accept terms" error="You must accept" />);
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('You must accept');
    });

    it('should apply error styling to checkbox', () => {
      render(<Checkbox label="Accept terms" error="You must accept" />);
      const checkbox = screen.getByLabelText('Accept terms');
      expect(checkbox).toHaveClass('border-destructive-500');
    });
  });

  describe('Help Text', () => {
    it('should display help text', () => {
      render(
        <Checkbox label="Subscribe" helpText="You can unsubscribe anytime" />,
      );
      expect(
        screen.getByText('You can unsubscribe anytime'),
      ).toBeInTheDocument();
    });

    it('should associate help text with checkbox using aria-describedby', () => {
      render(
        <Checkbox label="Subscribe" helpText="You can unsubscribe anytime" />,
      );
      const checkbox = screen.getByLabelText('Subscribe');
      const helpTextId = checkbox.getAttribute('aria-describedby');
      expect(helpTextId).toBeTruthy();
      expect(screen.getByText('You can unsubscribe anytime')).toHaveAttribute(
        'id',
        helpTextId,
      );
    });

    it('should hide help text when error is present', () => {
      render(
        <Checkbox
          label="Subscribe"
          helpText="You can unsubscribe anytime"
          error="Required"
        />,
      );
      expect(
        screen.queryByText('You can unsubscribe anytime'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size correctly', () => {
      render(<Checkbox label="Small" size="sm" />);
      const checkbox = screen.getByLabelText('Small');
      expect(checkbox).toHaveClass('w-4', 'h-4');
    });

    it('should render medium size correctly (default)', () => {
      render(<Checkbox label="Medium" size="md" />);
      const checkbox = screen.getByLabelText('Medium');
      expect(checkbox).toHaveClass('w-5', 'h-5');
    });

    it('should render large size correctly', () => {
      render(<Checkbox label="Large" size="lg" />);
      const checkbox = screen.getByLabelText('Large');
      expect(checkbox).toHaveClass('w-6', 'h-6');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Checkbox label="I agree" disabled />);
      const checkbox = screen.getByLabelText('I agree');
      expect(checkbox).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      render(<Checkbox label="I agree" disabled />);
      const checkbox = screen.getByLabelText('I agree');
      expect(checkbox).toHaveClass(
        'bg-neutral-100',
        'text-neutral-400',
        'cursor-not-allowed',
      );
    });

    it('should be required when required prop is true', () => {
      render(<Checkbox label="Accept terms" required />);
      const checkbox = screen.getByRole('checkbox', {
        name: /accept terms/i,
      });
      expect(checkbox).toBeRequired();
    });

    it('should be checked when checked prop is true', () => {
      render(<Checkbox label="I agree" checked readOnly />);
      const checkbox = screen.getByLabelText('I agree');
      expect(checkbox).toBeChecked();
    });

    it('should not be checked by default', () => {
      render(<Checkbox label="I agree" />);
      const checkbox = screen.getByLabelText('I agree');
      expect(checkbox).not.toBeChecked();
    });
  });

  describe('User Interactions', () => {
    it('should toggle checked state on click', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="I agree" />);

      const checkbox = screen.getByLabelText('I agree');
      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(checkbox).toBeChecked();

      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox label="I agree" onChange={handleChange} />);

      const checkbox = screen.getByLabelText('I agree');
      await user.click(checkbox);

      expect(handleChange).toHaveBeenCalled();
    });

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Checkbox label="I agree" disabled onChange={handleChange} />);

      const checkbox = screen.getByLabelText('I agree');
      await user.click(checkbox);

      expect(handleChange).not.toHaveBeenCalled();
      expect(checkbox).not.toBeChecked();
    });

    it('should be clickable via label', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="I agree" />);

      const checkbox = screen.getByLabelText('I agree');
      const label = screen.getByText('I agree');

      expect(checkbox).not.toBeChecked();
      await user.click(label);
      expect(checkbox).toBeChecked();
    });

    it('should support keyboard interaction (Space key)', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="I agree" />);

      const checkbox = screen.getByLabelText('I agree');
      checkbox.focus();

      expect(checkbox).not.toBeChecked();
      await user.keyboard(' ');
      expect(checkbox).toBeChecked();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to checkbox', () => {
      render(<Checkbox label="Custom" className="custom-checkbox-class" />);
      const checkbox = screen.getByLabelText('Custom');
      expect(checkbox).toHaveClass('custom-checkbox-class');
    });

    it('should apply wrapperClassName to wrapper div', () => {
      const { container } = render(
        <Checkbox label="Wrapper" wrapperClassName="custom-wrapper" />,
      );
      expect(container.firstChild).toHaveClass('custom-wrapper');
    });
  });

  describe('Forward Ref', () => {
    it('should forward ref to checkbox element', () => {
      const ref = jest.fn();
      render(<Checkbox label="Ref test" ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow focus via ref', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Checkbox label="Focus test" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      ref.current?.focus();
      expect(ref.current).toHaveFocus();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<Checkbox label="I agree to terms" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with all sizes', () => {
      const { container } = render(
        <div>
          <Checkbox label="Small" size="sm" />
          <Checkbox label="Medium" size="md" />
          <Checkbox label="Large" size="lg" />
        </div>,
      );
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when checked', () => {
      const { container } = render(
        <Checkbox label="I agree" checked readOnly />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when disabled', () => {
      const { container } = render(<Checkbox label="Disabled" disabled />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with error', () => {
      const { container } = render(
        <Checkbox label="Accept terms" error="You must accept the terms" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with help text', () => {
      const { container } = render(
        <Checkbox
          label="Subscribe"
          helpText="You can unsubscribe at any time"
        />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when required', () => {
      const { container } = render(<Checkbox label="Required" required />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
