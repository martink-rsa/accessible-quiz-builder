import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';

import logoSquare from '../../../assets/logo-black-square.png';

export interface FooterProps {
  /**
   * Optional additional CSS classes
   */
  className?: string;
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'Twitter', icon: Twitter, url: '#' },
  { name: 'LinkedIn', icon: Linkedin, url: '#' },
  { name: 'GitHub', icon: Github, url: '#' },
  { name: 'Instagram', icon: Instagram, url: '#' },
];

/**
 * Accessible Footer component with logo, social links, and copyright
 *
 * Features:
 * - Semantic HTML footer element
 * - Keyboard accessible navigation
 * - Focus visible indicators
 * - ARIA labels for social links
 * - Proper heading hierarchy
 * - WCAG AA contrast ratios
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer({ className = '' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`border-t border-neutral-200 bg-white py-8 ${className}`}
      role="contentinfo"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-6 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={logoSquare}
              alt="QUIZU - Accessible Quiz Builder"
              className="h-12 w-12"
            />
          </div>

          <nav aria-label="Social media links">
            <ul className="flex items-center gap-4">
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <li key={name}>
                  <a
                    href={url}
                    aria-label={`Visit our ${name} page`}
                    className="focus-visible:ring-primary-500 inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <p className="text-center text-sm text-neutral-600">
            &copy; {currentYear} QUIZU. Built with accessibility in mind.
            Follows WCAG 2.2 Level AA guidelines.
          </p>
        </div>
      </div>
    </footer>
  );
}
