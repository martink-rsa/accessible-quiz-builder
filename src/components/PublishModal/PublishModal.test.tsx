import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderAndCheckA11y } from '@/test-utils';

import { PublishModal } from './PublishModal';

// Mock clipboard API - ensure it exists
if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: jest.fn(),
    },
    configurable: true,
    writable: true,
  });
}

// Mock window.open
const mockWindowOpen = jest.fn();
window.open = mockWindowOpen;

// Mock Math.random to return consistent values for snapshot tests
const mockMathRandom = jest.spyOn(Math, 'random');

// Clipboard mock spy
let mockWriteText: jest.SpyInstance;

describe('PublishModal', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    quizTitle: 'My Test Quiz',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on clipboard.writeText and mock it to resolve
    mockWriteText = jest
      .spyOn(navigator.clipboard, 'writeText')
      .mockResolvedValue();
    // Reset Math.random to return a consistent sequence
    // This generates the hash "ABCflrx3" consistently
    let callCount = 0;
    mockMathRandom.mockImplementation(() => {
      const values = [0.0, 0.03, 0.04, 0.5, 0.6, 0.7, 0.8, 0.9];
      return values[callCount++ % values.length];
    });
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  afterAll(() => {
    mockMathRandom.mockRestore();
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations when open', async () => {
      await renderAndCheckA11y(<PublishModal {...defaultProps} />);
    });

    it('should have accessible quiz URL input with label', () => {
      render(<PublishModal {...defaultProps} />);

      const input = screen.getByLabelText(/quiz url/i);
      expect(input).toBeInTheDocument();
    });

    it('should have accessible copy button with aria-label', () => {
      render(<PublishModal {...defaultProps} />);

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });
      expect(copyButton).toBeInTheDocument();
    });

    it('should update aria-label when URL is copied', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });
      await user.click(copyButton);

      await waitFor(() => {
        const copiedButton = screen.getByRole('button', {
          name: /url copied/i,
        });
        expect(copiedButton).toBeInTheDocument();
      });
    });
  });

  describe('Rendering', () => {
    it('should render when isOpen is true', () => {
      render(<PublishModal {...defaultProps} />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Publish Quiz')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
      render(<PublishModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render success icon', () => {
      const { container } = render(<PublishModal {...defaultProps} />);

      const successIcon = container.querySelector('.bg-green-100');
      expect(successIcon).toBeInTheDocument();
    });

    it('should render sharing message', () => {
      render(<PublishModal {...defaultProps} />);

      expect(
        screen.getByText(/your quiz is ready to share/i),
      ).toBeInTheDocument();
    });

    it('should render quiz URL input field', () => {
      render(<PublishModal {...defaultProps} />);

      const input = screen.getByLabelText(/quiz url/i) as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input.value).toMatch(
        /^https:\/\/accessible-quiz-builder\.com\/q\/[A-Za-z0-9]{8}$/,
      );
      expect(input).toHaveAttribute('readonly');
    });

    it('should render Copy button', () => {
      render(<PublishModal {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /copy url to clipboard/i }),
      ).toBeInTheDocument();
    });

    it('should render all social media share buttons', () => {
      render(<PublishModal {...defaultProps} />);

      expect(
        screen.getByRole('button', { name: /twitter/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /facebook/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /linkedin/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /email/i }),
      ).toBeInTheDocument();
    });

    it('should render Done button', () => {
      render(<PublishModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    });
  });

  describe('Quiz URL Generation', () => {
    it('should generate URL with correct format', () => {
      render(<PublishModal {...defaultProps} />);

      const input = screen.getByLabelText(/quiz url/i) as HTMLInputElement;
      expect(input.value).toMatch(
        /^https:\/\/accessible-quiz-builder\.com\/q\/[A-Za-z0-9]{8}$/,
      );
    });

    it('should maintain same URL within component lifecycle', () => {
      const { rerender } = render(<PublishModal {...defaultProps} />);
      const firstUrl = (screen.getByLabelText(/quiz url/i) as HTMLInputElement)
        .value;

      rerender(<PublishModal {...defaultProps} quizTitle="Updated Title" />);
      const secondUrl = (screen.getByLabelText(/quiz url/i) as HTMLInputElement)
        .value;

      expect(firstUrl).toBe(secondUrl);
    });
  });

  describe('Copy URL Functionality', () => {
    it('should copy URL to clipboard when Copy button is clicked', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });
      const input = screen.getByLabelText(/quiz url/i) as HTMLInputElement;
      const quizUrl = input.value;

      await user.click(copyButton);

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalledWith(quizUrl);
      });
    });

    it('should show success state after copying', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });
      await user.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/copied!/i)).toBeInTheDocument();
      });
    });

    it('should reset copied state after 2 seconds', async () => {
      jest.useFakeTimers();

      render(<PublishModal {...defaultProps} />);

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });

      // Click using fireEvent instead of userEvent with fake timers
      copyButton.click();

      await waitFor(() => {
        expect(screen.getByText(/copied!/i)).toBeInTheDocument();
      });

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(screen.queryByText(/copied!/i)).not.toBeInTheDocument();
        expect(screen.getByText(/copy/i)).toBeInTheDocument();
      });

      jest.useRealTimers();
    });

    it('should handle clipboard errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const clipboardError = new Error('Clipboard failed');
      mockWriteText.mockRejectedValueOnce(clipboardError);

      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });
      await user.click(copyButton);

      // Wait for the async clipboard operation to complete and error to be logged
      await waitFor(
        () => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            'Failed to copy URL:',
            clipboardError,
          );
        },
        { timeout: 3000 },
      );

      consoleErrorSpy.mockRestore();
      mockWriteText.mockImplementation(() => Promise.resolve());
    });
  });

  describe('Social Media Sharing', () => {
    it('should open Twitter share dialog with correct URL', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const twitterButton = screen.getByRole('button', { name: /twitter/i });
      const quizUrl = (screen.getByLabelText(/quiz url/i) as HTMLInputElement)
        .value;

      await user.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://twitter.com/intent/tweet'),
        '_blank',
        'width=600,height=400',
      );
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(quizUrl)),
        '_blank',
        'width=600,height=400',
      );
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('My Test Quiz')),
        '_blank',
        'width=600,height=400',
      );
    });

    it('should open Facebook share dialog with correct URL', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const facebookButton = screen.getByRole('button', { name: /facebook/i });
      const quizUrl = (screen.getByLabelText(/quiz url/i) as HTMLInputElement)
        .value;

      await user.click(facebookButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://www.facebook.com/sharer/sharer.php'),
        '_blank',
        'width=600,height=400',
      );
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(quizUrl)),
        '_blank',
        'width=600,height=400',
      );
    });

    it('should open LinkedIn share dialog with correct URL', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const linkedinButton = screen.getByRole('button', { name: /linkedin/i });
      const quizUrl = (screen.getByLabelText(/quiz url/i) as HTMLInputElement)
        .value;

      await user.click(linkedinButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(
          'https://www.linkedin.com/sharing/share-offsite/',
        ),
        '_blank',
        'width=600,height=400',
      );
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(quizUrl)),
        '_blank',
        'width=600,height=400',
      );
    });

    it('should open Email share with correct mailto link', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const emailButton = screen.getByRole('button', { name: /email/i });
      const quizUrl = (screen.getByLabelText(/quiz url/i) as HTMLInputElement)
        .value;

      await user.click(emailButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('mailto:'),
        '_blank',
        'width=600,height=400',
      );
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('My Test Quiz')),
        '_blank',
        'width=600,height=400',
      );
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(
          `Take this quiz: ${encodeURIComponent(quizUrl)}`,
        ),
        '_blank',
        'width=600,height=400',
      );
    });

    it('should use default title when quizTitle is empty', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} quizTitle="" />);

      const twitterButton = screen.getByRole('button', { name: /twitter/i });
      await user.click(twitterButton);

      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent('Check out this quiz!')),
        '_blank',
        'width=600,height=400',
      );
    });
  });

  describe('Input Interactions', () => {
    it('should select all text when URL input is clicked', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const input = screen.getByLabelText(/quiz url/i) as HTMLInputElement;

      // Mock select method
      const selectSpy = jest.fn();
      input.select = selectSpy;

      await user.click(input);

      expect(selectSpy).toHaveBeenCalled();
    });

    it('should be readonly and not allow editing', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const input = screen.getByLabelText(/quiz url/i) as HTMLInputElement;
      const originalValue = input.value;

      await user.type(input, 'test');

      expect(input.value).toBe(originalValue);
    });
  });

  describe('Modal Interactions', () => {
    it('should call onClose when Done button is clicked', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const doneButton = screen.getByRole('button', { name: /done/i });
      await user.click(doneButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when modal close button is clicked', async () => {
      const user = userEvent.setup();
      render(<PublishModal {...defaultProps} />);

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Snapshots', () => {
    it('should match snapshot when open', () => {
      const { container } = render(<PublishModal {...defaultProps} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot when closed', () => {
      const { container } = render(
        <PublishModal {...defaultProps} isOpen={false} />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot with empty quiz title', () => {
      const { container } = render(
        <PublishModal {...defaultProps} quizTitle="" />,
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should match snapshot in copied state', async () => {
      const user = userEvent.setup();
      const { container } = render(<PublishModal {...defaultProps} />);

      const copyButton = screen.getByRole('button', {
        name: /copy url to clipboard/i,
      });
      await user.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText(/copied!/i)).toBeInTheDocument();
      });

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
