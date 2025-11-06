import { Facebook, Twitter, Linkedin, Github, Instagram } from 'lucide-react';

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
      className={`bg-white border-t border-neutral-200 py-8 ${className}`}
      role="contentinfo"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo-black-square.png"
              alt="QUIZU - Accessible Quiz Builder"
              className="w-12 h-12"
            />
          </div>

          <nav aria-label="Social media links">
            <ul className="flex items-center gap-4">
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <li key={name}>
                  <a
                    href={url}
                    aria-label={`Visit our ${name} page`}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
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
