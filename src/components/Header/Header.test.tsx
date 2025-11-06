import { render, screen } from '@testing-library/react';
import { renderAndCheckA11y } from '@/test-utils';
import { Header } from './Header';

describe('Header', () => {
  describe('Accessibility', () => {
    it('should have no accessibility violations with default props', async () => {
      await renderAndCheckA11y(<Header />);
    });

    it('should have proper landmark role', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
    });

    it('should have accessible logo with alt text', () => {
      render(<Header />);
      const logo = screen.getByAltText(/QUIZU - Accessible Quiz Builder/i);
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src');
    });

    it('should have no accessibility violations with custom className', async () => {
      await renderAndCheckA11y(<Header className="shadow-lg" />);
    });
  });

  describe('Rendering', () => {
    it('should render with default styles', () => {
      render(<Header />);
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header).toHaveClass('bg-white', 'border-b', 'border-neutral-200');
    });

    it('should apply custom className', () => {
      render(<Header className="custom-class" />);
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('custom-class');
    });

    it('should render logo with correct styling', () => {
      render(<Header />);
      const logo = screen.getByAltText(/QUIZU - Accessible Quiz Builder/i);
      expect(logo).toHaveClass('h-12');
    });

    it('should forward additional props to header element', () => {
      render(<Header data-testid="custom-header" />);
      const header = screen.getByTestId('custom-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot with default props', () => {
      const { container } = render(<Header />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with custom className', () => {
      const { container } = render(<Header className="shadow-lg" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
