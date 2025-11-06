import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderAndCheckA11y } from '@/test-utils';

import { Modal } from './Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Test Modal',
    children: <p>Modal content</p>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = '';
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations when open', async () => {
      await renderAndCheckA11y(<Modal {...defaultProps} />);
    });

    it('should have correct ARIA attributes', () => {
      render(<Modal {...defaultProps} />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    });

    it('should have accessible close button', () => {
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('should have properly labeled title', () => {
      render(<Modal {...defaultProps} title="Custom Title" />);

      const title = screen.getByText('Custom Title');
      expect(title).toHaveAttribute('id', 'modal-title');
    });
  });

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<Modal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<Modal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render title correctly', () => {
      render(<Modal {...defaultProps} title="My Custom Title" />);

      expect(screen.getByText('My Custom Title')).toBeInTheDocument();
    });

    it('should render children content', () => {
      render(
        <Modal {...defaultProps}>
          <div>
            <h3>Child heading</h3>
            <p>Child content</p>
          </div>
        </Modal>,
      );

      expect(screen.getByText('Child heading')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    it('should render backdrop', () => {
      const { container } = render(<Modal {...defaultProps} />);

      const backdrop = container.querySelector('.bg-black\\/50');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('States', () => {
    it('should prevent body scrolling when modal is open', () => {
      render(<Modal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');
    });

    it('should restore body scrolling when modal is closed', () => {
      const { rerender } = render(<Modal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<Modal {...defaultProps} isOpen={false} />);

      expect(document.body.style.overflow).toBe('');
    });

    it('should clean up body overflow on unmount', () => {
      const { unmount } = render(<Modal {...defaultProps} />);

      expect(document.body.style.overflow).toBe('hidden');

      unmount();

      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('Interactions', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const { container } = render(<Modal {...defaultProps} />);

      const backdrop = container.querySelector('.bg-black\\/50');
      await user.click(backdrop!);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Escape key is pressed', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when Escape is pressed and modal is closed', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} isOpen={false} />);

      await user.keyboard('{Escape}');

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should not call onClose when clicking modal content', async () => {
      const user = userEvent.setup();
      render(<Modal {...defaultProps} />);

      const content = screen.getByText('Modal content');
      await user.click(content);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Focus Management', () => {
    it('should focus modal when opened', () => {
      const { container } = render(<Modal {...defaultProps} />);

      const modalContent = container.querySelector('[tabindex="-1"]');
      expect(modalContent).toHaveFocus();
    });

    it('should store and restore previous focus', () => {
      const { rerender } = render(
        <div>
          <button>Previous Button</button>
          <Modal {...defaultProps} isOpen={false} />
        </div>,
      );

      const previousButton = screen.getByText('Previous Button');
      previousButton.focus();
      expect(previousButton).toHaveFocus();

      // Open modal
      rerender(
        <div>
          <button>Previous Button</button>
          <Modal {...defaultProps} isOpen={true} />
        </div>,
      );

      // Modal should now be focused
      const modalContent = screen
        .getByRole('dialog')
        .querySelector('[tabindex="-1"]');
      expect(modalContent).toHaveFocus();

      // Close modal
      rerender(
        <div>
          <button>Previous Button</button>
          <Modal {...defaultProps} isOpen={false} />
        </div>,
      );

      // Previous button should be focused again
      expect(previousButton).toHaveFocus();
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot when open', () => {
      const { container } = render(<Modal {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when closed', () => {
      const { container } = render(<Modal {...defaultProps} isOpen={false} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with custom title', () => {
      const { container } = render(
        <Modal {...defaultProps} title="Custom Modal Title" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with complex children', () => {
      const { container } = render(
        <Modal {...defaultProps}>
          <div>
            <h3>Heading</h3>
            <p>Paragraph text</p>
            <button>Action Button</button>
          </div>
        </Modal>,
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
