import { render, screen } from '@testing-library/react';
import { renderAndCheckA11y, checkA11y } from '../../test-utils';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../Button';

describe('ButtonGroup', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with default props', async () => {
      await renderAndCheckA11y(
        <ButtonGroup aria-label="Actions">
          <Button>Edit</Button>
          <Button>Preview</Button>
        </ButtonGroup>,
      );
    });

    it('should have no accessibility violations with multiple buttons', async () => {
      const { container } = render(
        <ButtonGroup aria-label="View options">
          <Button variant="primary">Edit</Button>
          <Button variant="ghost">Preview</Button>
          <Button variant="secondary">Share</Button>
        </ButtonGroup>,
      );

      await checkA11y(container);
    });

    it('should have no accessibility violations with toggle buttons', async () => {
      await renderAndCheckA11y(
        <ButtonGroup aria-label="View mode">
          <Button variant="primary" aria-pressed={true}>
            Edit
          </Button>
          <Button variant="ghost" aria-pressed={false}>
            Preview
          </Button>
        </ButtonGroup>,
      );
    });

    it('should warn when aria-label is missing', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      render(
        // @ts-expect-error - testing missing required prop
        <ButtonGroup>
          <Button>Edit</Button>
          <Button>Preview</Button>
        </ButtonGroup>,
      );

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ButtonGroup: aria-label is required for accessibility',
      );

      consoleWarnSpy.mockRestore();
    });

    it('should have proper role attribute', () => {
      render(
        <ButtonGroup aria-label="Actions">
          <Button>Edit</Button>
          <Button>Preview</Button>
        </ButtonGroup>,
      );

      const group = screen.getByRole('group', { name: /actions/i });
      expect(group).toBeInTheDocument();
    });

    it('should have accessible name from aria-label', () => {
      render(
        <ButtonGroup aria-label="View mode options">
          <Button>Edit</Button>
          <Button>Preview</Button>
        </ButtonGroup>,
      );

      expect(
        screen.getByRole('group', { name: /view mode options/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Rendering', () => {
    it('should render children correctly', () => {
      render(
        <ButtonGroup aria-label="Actions">
          <Button>Edit</Button>
          <Button>Preview</Button>
        </ButtonGroup>,
      );

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /preview/i }),
      ).toBeInTheDocument();
    });

    it('should render multiple buttons', () => {
      render(
        <ButtonGroup aria-label="Actions">
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </ButtonGroup>,
      );

      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    it('should apply custom className', () => {
      render(
        <ButtonGroup aria-label="Actions" className="custom-class">
          <Button>Edit</Button>
          <Button>Preview</Button>
        </ButtonGroup>,
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('custom-class');
    });

    it('should apply default styling classes', () => {
      render(
        <ButtonGroup aria-label="Actions">
          <Button>Edit</Button>
          <Button>Preview</Button>
        </ButtonGroup>,
      );

      const group = screen.getByRole('group');
      expect(group).toHaveClass('inline-flex', 'shadow-sm');
    });

    it('should preserve button props', () => {
      render(
        <ButtonGroup aria-label="Actions">
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="destructive">Delete</Button>
        </ButtonGroup>,
      );

      const disabledButton = screen.getByRole('button', { name: /disabled/i });
      expect(disabledButton).toBeDisabled();
      expect(disabledButton).toHaveClass('bg-primary-600');

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toHaveClass('bg-destructive-600');
    });
  });

  describe('Button variants in group', () => {
    it('should render with different button variants', () => {
      render(
        <ButtonGroup aria-label="Mixed variants">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </ButtonGroup>,
      );

      expect(screen.getByRole('button', { name: /primary/i })).toHaveClass(
        'bg-primary-600',
      );
      expect(screen.getByRole('button', { name: /secondary/i })).toHaveClass(
        'bg-secondary-500',
      );
      expect(screen.getByRole('button', { name: /ghost/i })).toHaveClass(
        'bg-transparent',
      );
    });

    it('should render with different button sizes', () => {
      render(
        <ButtonGroup aria-label="Sized buttons">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </ButtonGroup>,
      );

      expect(screen.getByRole('button', { name: /small/i })).toHaveClass(
        'px-3',
        'py-1.5',
      );
      expect(screen.getByRole('button', { name: /medium/i })).toHaveClass(
        'px-4',
        'py-2',
      );
      expect(screen.getByRole('button', { name: /large/i })).toHaveClass(
        'px-6',
        'py-3',
      );
    });
  });

  describe('Toggle button behavior', () => {
    it('should support toggle buttons with aria-pressed', () => {
      render(
        <ButtonGroup aria-label="View mode">
          <Button aria-pressed={true}>Active</Button>
          <Button aria-pressed={false}>Inactive</Button>
        </ButtonGroup>,
      );

      const buttons = screen.getAllByRole('button');
      const activeButton = buttons[0];
      const inactiveButton = buttons[1];

      expect(activeButton).toHaveTextContent('Active');
      expect(activeButton).toHaveAttribute('aria-pressed', 'true');
      expect(inactiveButton).toHaveTextContent('Inactive');
      expect(inactiveButton).toHaveAttribute('aria-pressed', 'false');
    });

    it('should work with mixed pressed states', () => {
      render(
        <ButtonGroup aria-label="Options">
          <Button aria-pressed={true}>Option 1</Button>
          <Button aria-pressed={false}>Option 2</Button>
          <Button aria-pressed={false}>Option 3</Button>
        </ButtonGroup>,
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('aria-pressed', 'true');
      expect(buttons[1]).toHaveAttribute('aria-pressed', 'false');
      expect(buttons[2]).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('Integration with icons', () => {
    it('should render buttons with icon children', () => {
      render(
        <ButtonGroup aria-label="View mode">
          <Button>
            <svg data-testid="edit-icon" />
            Edit
          </Button>
          <Button>
            <svg data-testid="preview-icon" />
            Preview
          </Button>
        </ButtonGroup>,
      );

      expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
      expect(screen.getByTestId('preview-icon')).toBeInTheDocument();
    });
  });
});
