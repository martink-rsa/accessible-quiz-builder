import { HTMLAttributes } from 'react';

import logo from '../../../assets/logo-black-rectangle.png';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  /**
   * Additional CSS classes to apply to the header
   */
  className?: string;
}

/**
 * Accessible Header component with logo
 *
 * Features:
 * - Semantic HTML header element with banner landmark role
 * - Responsive logo with proper alt text
 * - WCAG AA compliant
 * - Flexible styling with Tailwind CSS
 *
 * @example
 * ```tsx
 * <Header />
 * <Header className="shadow-lg" />
 * ```
 */
export const Header = ({ className = '', ...props }: HeaderProps) => {
  const classes = [
    'bg-white border-b border-neutral-200 px-6 py-4',
    className,
  ].join(' ');

  return (
    <header className={classes} {...props}>
      <div className="mx-auto max-w-5xl">
        <img
          src={logo}
          alt="QUIZU - Accessible Quiz Builder"
          className="h-12"
        />
      </div>
    </header>
  );
};

Header.displayName = 'Header';
