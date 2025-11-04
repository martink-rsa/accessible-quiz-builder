import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderAndCheckA11y, checkA11y } from '../../test-utils';
import { Button } from './Button';

describe('Button', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with default props', async () => {
      await renderAndCheckA11y(<Button>Click me</Button>);
    });

    it('should have no accessibility violations for all variants', async () => {
      const { container } = render(
        <div>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
        </div>,
      );

      await checkA11y(container);
    });

    it('should have no accessibility violations for all sizes', async () => {
      const { container } = render(
        <div>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>,
      );

      await checkA11y(container);
    });

    it('should have no accessibility violations when disabled', async () => {
      await renderAndCheckA11y(<Button disabled>Disabled button</Button>);
    });

    it('should have no accessibility violations when loading', async () => {
      await renderAndCheckA11y(<Button loading>Loading button</Button>);
    });

    it('should have no accessibility violations for icon-only button with aria-label', async () => {
      await renderAndCheckA11y(
        <Button iconOnly aria-label="Close">
          <span>×</span>
        </Button>,
      );
    });

    it('should warn when icon-only button lacks aria-label', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        <Button iconOnly>
          <span>×</span>
        </Button>,
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Button: iconOnly buttons must have an aria-label for accessibility',
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Rendering', () => {
    it('should render with default variant (primary)', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button', { name: /default button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-primary-600');
    });

    it('should render all variants correctly', () => {
      const { rerender } = render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-secondary-500');

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-transparent');

      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-destructive-600');
    });

    it('should render all sizes correctly', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'px-3',
        'py-1.5',
        'text-sm',
      );

      rerender(<Button size="md">Medium</Button>);
      expect(screen.getByRole('button')).toHaveClass(
        'px-4',
        'py-2',
        'text-base',
      );

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-lg');
    });

    it('should render children correctly', () => {
      render(<Button>Test Content</Button>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should be disabled when loading prop is true', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should show loading spinner when loading', () => {
      render(<Button loading>Loading</Button>);
      const spinner = screen.getByRole('button').querySelector('svg');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have correct type attribute', () => {
      const { rerender } = render(<Button type="button">Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');

      rerender(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

      rerender(<Button type="reset">Reset</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>,
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not call onClick when loading', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Button loading onClick={handleClick}>
          Loading
        </Button>,
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should be keyboard accessible (Enter key)', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible (Space key)', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<Button onClick={handleClick}>Keyboard</Button>);

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon-only buttons', () => {
    it('should render icon-only button with proper styling', () => {
      render(
        <Button iconOnly aria-label="Delete">
          <span>×</span>
        </Button>,
      );

      const button = screen.getByRole('button', { name: /delete/i });
      expect(button).toHaveClass('p-2'); // Icon-only padding
      expect(button).not.toHaveClass('px-4'); // Regular padding
    });

    it('should have accessible name from aria-label', () => {
      render(
        <Button iconOnly aria-label="Close dialog">
          <span>×</span>
        </Button>,
      );

      expect(
        screen.getByRole('button', { name: /close dialog/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Forward ref', () => {
    it('should forward ref to button element', () => {
      const ref = jest.fn();

      render(<Button ref={ref}>Ref test</Button>);

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
