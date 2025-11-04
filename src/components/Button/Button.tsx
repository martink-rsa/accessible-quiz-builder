import { ButtonHTMLAttributes, forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Size of the button
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Whether the button is in a loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether this is an icon-only button (requires aria-label)
   * @default false
   */
  iconOnly?: boolean;
}

const baseStyles =
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500',
  secondary:
    'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700 focus-visible:ring-secondary-500',
  ghost:
    'bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 focus-visible:ring-neutral-500',
  destructive:
    'bg-destructive-600 text-white hover:bg-destructive-700 active:bg-destructive-800 focus-visible:ring-destructive-500',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-base rounded-md gap-2',
  lg: 'px-6 py-3 text-lg rounded-lg gap-2.5',
};

const iconOnlySizeStyles: Record<ButtonSize, string> = {
  sm: 'p-1.5 rounded-md',
  md: 'p-2 rounded-md',
  lg: 'p-3 rounded-lg',
};

/**
 * Accessible Button component with multiple variants
 *
 * Features:
 * - Semantic HTML button element
 * - Keyboard accessible (Enter/Space)
 * - Focus visible indicators
 * - Loading state support
 * - Multiple variants (primary, secondary, ghost, destructive)
 * - Icon-only mode with required aria-label
 * - Proper WCAG AA contrast ratios
 *
 * @example
 * ```tsx
 * <Button variant="primary">Click me</Button>
 * <Button variant="secondary" size="lg">Large button</Button>
 * <Button variant="ghost" disabled>Disabled</Button>
 * <Button iconOnly aria-label="Close dialog">
 *   <XIcon />
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      iconOnly = false,
      disabled,
      className = '',
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    if (iconOnly && !props['aria-label']) {
      console.warn(
        'Button: iconOnly buttons must have an aria-label for accessibility',
      );
    }

    const isDisabled = disabled || loading;

    const classes = [
      baseStyles,
      variantStyles[variant],
      iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
      className,
    ].join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={classes}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
