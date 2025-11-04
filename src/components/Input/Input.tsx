import { forwardRef, InputHTMLAttributes, useId } from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Label text for the input (required for accessibility)
   */
  label: string;

  /**
   * Error message to display below the input
   */
  error?: string;

  /**
   * Help text to display below the input
   */
  helpText?: string;

  /**
   * Visual size of the input
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Additional class name for the input wrapper
   */
  wrapperClassName?: string;
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-4 py-3 text-lg',
};

/**
 * Accessible Input component with label, error states, and help text
 *
 * Features:
 * - Required label with proper association
 * - Error states with aria-invalid and aria-describedby
 * - Help text support with aria-describedby
 * - Disabled state properly announced
 * - Focus indicators with WCAG AA compliance
 * - Support for text, email, password, and other HTML input types
 * - Required field indicator
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="Enter your email"
 *   required
 * />
 *
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 *
 * <Input
 *   label="Username"
 *   helpText="Choose a unique username"
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
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
      type = 'text',
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

    const inputClasses = [
      'w-full',
      'border',
      'rounded-md',
      'transition-colors',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-offset-2',
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

        <input
          ref={ref}
          id={id}
          type={type}
          required={required}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={ariaDescribedBy}
          className={inputClasses}
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

Input.displayName = 'Input';
