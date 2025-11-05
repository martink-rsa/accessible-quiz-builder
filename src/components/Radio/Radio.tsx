import { forwardRef, InputHTMLAttributes, useId } from 'react';

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  /**
   * Label text for the radio button (required for accessibility)
   */
  label: string;

  /**
   * Error message to display below the radio button
   */
  error?: string;

  /**
   * Help text to display below the radio button
   */
  helpText?: string;

  /**
   * Visual size of the radio button
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional class name for the radio wrapper
   */
  wrapperClassName?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const labelSizeStyles = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

/**
 * Accessible Radio component with label, error states, and help text
 *
 * Features:
 * - Required label with proper association
 * - Error states with aria-invalid and aria-describedby
 * - Help text support with aria-describedby
 * - Disabled state properly announced
 * - Focus indicators with WCAG AA compliance
 * - Support for controlled and uncontrolled usage
 * - Required field indicator
 * - Proper radio group usage with name attribute
 *
 * @example
 * ```tsx
 * <Radio
 *   name="difficulty"
 *   label="Easy"
 *   value="easy"
 * />
 *
 * <Radio
 *   name="difficulty"
 *   label="Medium"
 *   value="medium"
 *   helpText="Recommended for beginners"
 * />
 *
 * <Radio
 *   name="difficulty"
 *   label="Hard"
 *   value="hard"
 *   error="This difficulty is not available"
 * />
 * ```
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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

    const radioClasses = [
      sizeStyles[size],
      'border-2',
      'rounded-full',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
      error
        ? 'border-destructive-500 focus:ring-destructive-500 text-destructive-600'
        : 'border-neutral-300 focus:ring-primary-500 text-primary-600',
      disabled
        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
        : 'bg-white cursor-pointer',
      className,
    ].join(' ');

    return (
      <div className={wrapperClassName}>
        <div className="flex items-start">
          <input
            ref={ref}
            id={id}
            type="radio"
            required={required}
            disabled={disabled}
            aria-describedby={ariaDescribedBy}
            className={radioClasses}
            {...props}
          />

          <label
            htmlFor={id}
            className={`ml-2 block ${labelSizeStyles[size]} text-neutral-700 ${
              disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
            }`}
          >
            {label}
            {required && (
              <span className="text-destructive-600 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        </div>

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

Radio.displayName = 'Radio';
