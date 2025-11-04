import { forwardRef, TextareaHTMLAttributes, useId } from 'react';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Label text for the textarea (required for accessibility)
   */
  label: string;

  /**
   * Error message to display below the textarea
   */
  error?: string;

  /**
   * Help text to display below the textarea
   */
  helpText?: string;

  /**
   * Visual size of the textarea
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional class name for the textarea wrapper
   */
  wrapperClassName?: string;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

/**
 * Accessible Textarea component with label, error states, and help text
 *
 * Features:
 * - Required label with proper association
 * - Error states with aria-invalid and aria-describedby
 * - Help text support with aria-describedby
 * - Disabled state properly announced
 * - Focus indicators with WCAG AA compliance
 * - Resizable (vertical by default)
 * - Required field indicator
 *
 * @example
 * ```tsx
 * <Textarea
 *   label="Description"
 *   placeholder="Enter a description"
 *   rows={4}
 *   required
 * />
 *
 * <Textarea
 *   label="Comments"
 *   error="Comments must be at least 10 characters"
 *   rows={3}
 * />
 *
 * <Textarea
 *   label="Feedback"
 *   helpText="Share your thoughts"
 *   rows={5}
 * />
 * ```
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helpText,
      size = 'md',
      wrapperClassName = '',
      className = '',
      required,
      disabled,
      id: providedId,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helpTextId = `${id}-help`;

    // Build aria-describedby based on what's present
    const describedByIds = [];
    if (error) describedByIds.push(errorId);
    if (helpText) describedByIds.push(helpTextId);
    const ariaDescribedBy =
      describedByIds.length > 0 ? describedByIds.join(' ') : undefined;

    const textareaClasses = [
      'w-full',
      'border',
      'rounded-md',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      'resize-y',
      sizeStyles[size],
      error
        ? 'border-destructive-500 focus:ring-destructive-500 focus:border-destructive-500'
        : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500',
      disabled
        ? 'bg-neutral-100 text-neutral-500 cursor-not-allowed'
        : 'bg-white text-neutral-900',
      className,
    ].join(' ');

    return (
      <div className={wrapperClassName}>
        <label
          htmlFor={id}
          className="block text-sm font-medium text-neutral-700 mb-1.5"
        >
          {label}
          {required && (
            <span className="text-destructive-600 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={ariaDescribedBy}
          className={textareaClasses}
          {...props}
        />

        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-destructive-600"
            role="alert"
          >
            {error}
          </p>
        )}

        {helpText && !error && (
          <p id={helpTextId} className="mt-1.5 text-sm text-neutral-600">
            {helpText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
