import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import { Footer } from './Footer';

expect.extend(toHaveNoViolations);

describe('Footer', () => {
  it('renders without crashing', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('displays the logo with proper alt text', () => {
    render(<Footer />);
    const logo = screen.getByAltText('QUIZU - Accessible Quiz Builder');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/logo-black-square.png');
  });

  it('displays current year in copyright', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} QUIZU`)),
    ).toBeInTheDocument();
  });

  it('displays accessibility statement in copyright', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Built with accessibility in mind/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Follows WCAG 2.2 Level AA guidelines/),
    ).toBeInTheDocument();
  });

  it('renders social media navigation with proper label', () => {
    render(<Footer />);
    expect(
      screen.getByRole('navigation', { name: 'Social media links' }),
    ).toBeInTheDocument();
  });

  it('renders all social media links', () => {
    render(<Footer />);
    const socialPlatforms = [
      'Facebook',
      'Twitter',
      'LinkedIn',
      'GitHub',
      'Instagram',
    ];

    socialPlatforms.forEach((platform) => {
      const link = screen.getByLabelText(`Visit our ${platform} page`);
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#');
    });
  });

  it('social links have proper focus indicators', () => {
    render(<Footer />);
    const firstLink = screen.getByLabelText('Visit our Facebook page');
    expect(firstLink).toHaveClass('focus-visible:ring-2');
  });

  it('applies custom className when provided', () => {
    const { container } = render(<Footer className="custom-class" />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('custom-class');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Footer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('maintains semantic HTML structure', () => {
    render(<Footer />);
    const footer = screen.getByRole('contentinfo');
    expect(footer.tagName).toBe('FOOTER');
  });
});
