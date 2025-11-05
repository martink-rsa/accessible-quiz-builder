import { useState } from 'react';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';
import { Copy, Check, Twitter, Facebook, Linkedin, Mail } from 'lucide-react';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizTitle: string;
}

// Generate a short random hash for the quiz URL
function generateShortHash(): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < 8; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return hash;
}

export function PublishModal({
  isOpen,
  onClose,
  quizTitle,
}: PublishModalProps) {
  const [quizUrl] = useState(
    () => `https://accessible-quiz-builder.com/q/${generateShortHash()}`,
  );
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(quizUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleShare = (
    platform: 'twitter' | 'facebook' | 'linkedin' | 'email',
  ) => {
    const encodedUrl = encodeURIComponent(quizUrl);
    const encodedTitle = encodeURIComponent(
      quizTitle || 'Check out this quiz!',
    );

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=Take this quiz: ${encodedUrl}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Quiz">
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-gray-700">
            Your quiz is ready to share! Use the link below to let others take
            your quiz.
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="quiz-url"
            className="block text-sm font-medium text-gray-700"
          >
            Quiz URL
          </label>
          <div className="flex gap-2">
            <input
              id="quiz-url"
              type="text"
              value={quizUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              onClick={handleCopyUrl}
              variant={copied ? 'primary' : 'secondary'}
              size="md"
              aria-label={copied ? 'URL copied' : 'Copy URL to clipboard'}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Share on social media
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleShare('twitter')}
              variant="secondary"
              size="md"
              className="justify-center"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </Button>
            <Button
              onClick={() => handleShare('facebook')}
              variant="secondary"
              size="md"
              className="justify-center"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </Button>
            <Button
              onClick={() => handleShare('linkedin')}
              variant="secondary"
              size="md"
              className="justify-center"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Button>
            <Button
              onClick={() => handleShare('email')}
              variant="secondary"
              size="md"
              className="justify-center"
            >
              <Mail className="w-4 h-4" />
              Email
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="primary"
            size="md"
            className="w-full justify-center"
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
