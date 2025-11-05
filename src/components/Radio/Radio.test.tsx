import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y, checkA11y } from '../../test-utils';
import { Radio } from './Radio';

describe('Radio', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with default props', async () => {
      await renderAndCheckA11y(<Radio name="test" label="Easy" value="easy" />);
    });

    it('should have no accessibility violations with error', async () => {
      await renderAndCheckA11y(
        <Radio
          name="test"
          label="Hard"
          value="hard"
          error="This option is not available"
        />,
      );
    });

    it('should have no accessibility violations with help text', async () => {
      await renderAndCheckA11y(
        <Radio
          name="test"
          label="Medium"
          value="medium"
          helpText="Recommended for beginners"
        />,
      );
    });

    it('should have no accessibility violations when disabled', async () => {
      await renderAndCheckA11y(
        <Radio name="test" label="Expert" value="expert" disabled />,
      );
    });

    it('should have no accessibility violations when required', async () => {
      await renderAndCheckA11y(
        <Radio name="test" label="Easy" value="easy" required />,
      );
    });

    it('should have no accessibility violations for all sizes', async () => {
      const { container } = render(
        <div>
          <Radio name="size-test" label="Small" value="sm" size="sm" />
          <Radio name="size-test" label="Medium" value="md" size="md" />
          <Radio name="size-test" label="Large" value="lg" size="lg" />
        </div>,
      );

      await checkA11y(container);
    });

    it('should have no accessibility violations when checked', async () => {
      await renderAndCheckA11y(
        <Radio name="test" label="Easy" value="easy" checked readOnly />,
      );
    });

    it('should have no accessibility violations for radio group', async () => {
      const { container } = render(
        <fieldset>
          <legend>Difficulty Level</legend>
          <Radio name="difficulty" label="Easy" value="easy" />
          <Radio name="difficulty" label="Medium" value="medium" />
          <Radio name="difficulty" label="Hard" value="hard" />
        </fieldset>,
      );

      await checkA11y(container);
    });
  });

  describe('Label Association', () => {
    it('should associate label with radio using htmlFor', () => {
      render(<Radio name="test" label="Easy" value="easy" />);
      const radio = screen.getByLabelText('Easy');
      expect(radio).toBeInTheDocument();
    });

    it('should use provided id for association', () => {
      render(
        <Radio
          name="test"
          label="Medium"
          value="medium"
          id="custom-radio-id"
        />,
      );
      const radio = screen.getByLabelText('Medium');
      expect(radio).toHaveAttribute('id', 'custom-radio-id');
    });

    it('should generate unique id when not provided', () => {
      render(
        <div>
          <Radio name="test" label="First" value="first" />
          <Radio name="test" label="Second" value="second" />
        </div>,
      );

      const first = screen.getByLabelText('First');
      const second = screen.getByLabelText('Second');

      expect(first.id).toBeTruthy();
      expect(second.id).toBeTruthy();
      expect(first.id).not.toBe(second.id);
    });

    it('should show required indicator when required', () => {
      render(<Radio name="test" label="Easy" value="easy" required />);
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('should display error message', () => {
      render(
        <Radio name="test" label="Hard" value="hard" error="Not available" />,
      );
      expect(screen.getByText('Not available')).toBeInTheDocument();
    });

    it('should mark radio as invalid when error is present', () => {
      render(
        <Radio name="test" label="Hard" value="hard" error="Not available" />,
      );
      const radio = screen.getByLabelText('Hard');
      expect(radio).toHaveAttribute('aria-invalid', 'true');
    });

    it('should associate error with radio using aria-describedby', () => {
      render(
        <Radio name="test" label="Hard" value="hard" error="Not available" />,
      );
      const radio = screen.getByLabelText('Hard');
      const errorId = radio.getAttribute('aria-describedby');
      expect(errorId).toBeTruthy();
      expect(screen.getByText('Not available')).toHaveAttribute('id', errorId);
    });

    it('should have role="alert" on error message', () => {
      render(
        <Radio name="test" label="Hard" value="hard" error="Not available" />,
      );
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Not available');
    });

    it('should apply error styling to radio', () => {
      render(
        <Radio name="test" label="Hard" value="hard" error="Not available" />,
      );
      const radio = screen.getByLabelText('Hard');
      expect(radio).toHaveClass('border-destructive-500');
    });
  });

  describe('Help Text', () => {
    it('should display help text', () => {
      render(
        <Radio
          name="test"
          label="Medium"
          value="medium"
          helpText="Recommended for beginners"
        />,
      );
      expect(screen.getByText('Recommended for beginners')).toBeInTheDocument();
    });

    it('should associate help text with radio using aria-describedby', () => {
      render(
        <Radio
          name="test"
          label="Medium"
          value="medium"
          helpText="Recommended for beginners"
        />,
      );
      const radio = screen.getByLabelText('Medium');
      const helpTextId = radio.getAttribute('aria-describedby');
      expect(helpTextId).toBeTruthy();
      expect(screen.getByText('Recommended for beginners')).toHaveAttribute(
        'id',
        helpTextId,
      );
    });

    it('should hide help text when error is present', () => {
      render(
        <Radio
          name="test"
          label="Medium"
          value="medium"
          helpText="Recommended for beginners"
          error="Required"
        />,
      );
      expect(
        screen.queryByText('Recommended for beginners'),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Required')).toBeInTheDocument();
    });
  });

  describe('Sizes', () => {
    it('should render small size correctly', () => {
      render(<Radio name="test" label="Small" value="sm" size="sm" />);
      const radio = screen.getByLabelText('Small');
      expect(radio).toHaveClass('w-4', 'h-4');
    });

    it('should render medium size correctly (default)', () => {
      render(<Radio name="test" label="Medium" value="md" size="md" />);
      const radio = screen.getByLabelText('Medium');
      expect(radio).toHaveClass('w-5', 'h-5');
    });

    it('should render large size correctly', () => {
      render(<Radio name="test" label="Large" value="lg" size="lg" />);
      const radio = screen.getByLabelText('Large');
      expect(radio).toHaveClass('w-6', 'h-6');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Radio name="test" label="Easy" value="easy" disabled />);
      const radio = screen.getByLabelText('Easy');
      expect(radio).toBeDisabled();
    });

    it('should apply disabled styling', () => {
      render(<Radio name="test" label="Easy" value="easy" disabled />);
      const radio = screen.getByLabelText('Easy');
      expect(radio).toHaveClass(
        'bg-neutral-100',
        'text-neutral-400',
        'cursor-not-allowed',
      );
    });

    it('should be required when required prop is true', () => {
      render(<Radio name="test" label="Easy" value="easy" required />);
      const radio = screen.getByRole('radio', { name: /easy/i });
      expect(radio).toBeRequired();
    });

    it('should be checked when checked prop is true', () => {
      render(<Radio name="test" label="Easy" value="easy" checked readOnly />);
      const radio = screen.getByLabelText('Easy');
      expect(radio).toBeChecked();
    });

    it('should not be checked by default', () => {
      render(<Radio name="test" label="Easy" value="easy" />);
      const radio = screen.getByLabelText('Easy');
      expect(radio).not.toBeChecked();
    });
  });

  describe('Radio Group Behavior', () => {
    it('should allow only one radio to be selected in a group', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Radio name="difficulty" label="Easy" value="easy" />
          <Radio name="difficulty" label="Medium" value="medium" />
          <Radio name="difficulty" label="Hard" value="hard" />
        </div>,
      );

      const easy = screen.getByLabelText('Easy');
      const medium = screen.getByLabelText('Medium');
      const hard = screen.getByLabelText('Hard');

      await user.click(easy);
      expect(easy).toBeChecked();
      expect(medium).not.toBeChecked();
      expect(hard).not.toBeChecked();

      await user.click(medium);
      expect(easy).not.toBeChecked();
      expect(medium).toBeChecked();
      expect(hard).not.toBeChecked();

      await user.click(hard);
      expect(easy).not.toBeChecked();
      expect(medium).not.toBeChecked();
      expect(hard).toBeChecked();
    });

    it('should have same name attribute in a group', () => {
      render(
        <div>
          <Radio name="difficulty" label="Easy" value="easy" />
          <Radio name="difficulty" label="Medium" value="medium" />
        </div>,
      );

      const easy = screen.getByLabelText('Easy');
      const medium = screen.getByLabelText('Medium');

      expect(easy).toHaveAttribute('name', 'difficulty');
      expect(medium).toHaveAttribute('name', 'difficulty');
    });
  });

  describe('User Interactions', () => {
    it('should call onChange handler', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Radio name="test" label="Easy" value="easy" onChange={handleChange} />,
      );

      const radio = screen.getByLabelText('Easy');
      await user.click(radio);

      expect(handleChange).toHaveBeenCalled();
    });

    it('should not toggle when disabled', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(
        <Radio
          name="test"
          label="Easy"
          value="easy"
          disabled
          onChange={handleChange}
        />,
      );

      const radio = screen.getByLabelText('Easy');
      await user.click(radio);

      expect(handleChange).not.toHaveBeenCalled();
      expect(radio).not.toBeChecked();
    });

    it('should be clickable via label', async () => {
      const user = userEvent.setup();
      render(<Radio name="test" label="Easy" value="easy" />);

      const radio = screen.getByLabelText('Easy');
      const label = screen.getByText('Easy');

      expect(radio).not.toBeChecked();
      await user.click(label);
      expect(radio).toBeChecked();
    });

    it('should support keyboard interaction (Space key)', async () => {
      const user = userEvent.setup();
      render(<Radio name="test" label="Easy" value="easy" />);

      const radio = screen.getByLabelText('Easy');
      radio.focus();

      expect(radio).not.toBeChecked();
      await user.keyboard(' ');
      expect(radio).toBeChecked();
    });

    it('should have proper value attribute', () => {
      render(<Radio name="test" label="Easy" value="easy" />);
      const radio = screen.getByLabelText('Easy');
      expect(radio).toHaveAttribute('value', 'easy');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to radio', () => {
      render(
        <Radio
          name="test"
          label="Custom"
          value="custom"
          className="custom-radio-class"
        />,
      );
      const radio = screen.getByLabelText('Custom');
      expect(radio).toHaveClass('custom-radio-class');
    });

    it('should apply wrapperClassName to wrapper div', () => {
      const { container } = render(
        <Radio
          name="test"
          label="Wrapper"
          value="wrapper"
          wrapperClassName="custom-wrapper"
        />,
      );
      expect(container.firstChild).toHaveClass('custom-wrapper');
    });
  });

  describe('Forward Ref', () => {
    it('should forward ref to radio element', () => {
      const ref = jest.fn();
      render(<Radio name="test" label="Ref test" value="test" ref={ref} />);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLInputElement);
    });

    it('should allow focus via ref', () => {
      const ref = { current: null };
      render(<Radio name="test" label="Focus test" value="test" ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      (ref.current as unknown as HTMLInputElement).focus();
      expect(ref.current).toHaveFocus();
    });
  });
});
