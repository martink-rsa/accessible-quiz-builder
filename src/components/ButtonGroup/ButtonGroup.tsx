import { ReactNode } from 'react';

export interface ButtonGroupProps {
  /**
   * The buttons to display in the group
   */
  children?: ReactNode;

  /**
   * Accessible label for the button group
   */
  'aria-label': string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Accessible ButtonGroup component for grouping related buttons
 *
 * Features:
 * - Groups related buttons visually and semantically
 * - Uses role="group" for screen readers
 * - Requires aria-label for accessibility
 * - Visual grouping with connected borders
 * - Proper focus management
 *
 * @example
 * ```tsx
 * <ButtonGroup aria-label="View mode">
 *   <Button variant="primary" aria-pressed={mode === 'edit'}>
 *     Edit
 *   </Button>
 *   <Button variant="ghost" aria-pressed={mode === 'preview'}>
 *     Preview
 *   </Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = ({
  children,
  'aria-label': ariaLabel,
  className = '',
}: ButtonGroupProps) => {
  if (!ariaLabel) {
    console.warn('ButtonGroup: aria-label is required for accessibility');
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex shadow-sm [&>*]:rounded-none [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md ${className}`}
    >
      {children}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';
