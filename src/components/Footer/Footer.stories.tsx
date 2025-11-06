import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';

const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A fully accessible footer component with logo, social media links, and copyright information. Follows WCAG 2.2 Level AA guidelines with proper semantic HTML, keyboard navigation, and focus indicators.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Footer>;

/**
 * Default footer with all elements
 */
export const Default: Story = {
  args: {},
};

/**
 * Footer with custom styling
 */
export const CustomStyling: Story = {
  args: {
    className: 'bg-neutral-100',
  },
};

/**
 * Footer in a page context
 */
export const InPageContext: Story = {
  render: () => (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-8 bg-neutral-50">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Page Content</h1>
          <p className="text-neutral-700">
            This demonstrates how the footer appears at the bottom of a page.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  ),
};
