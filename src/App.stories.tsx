import type { Meta, StoryObj } from '@storybook/react-vite';
import App from '@/App';

/**
 * The main App component for the Accessible Quiz Builder.
 *
 * This component demonstrates:
 * - Accessible toggle buttons with aria-pressed attributes
 * - Mode switching between Edit and Preview
 * - Aria-live regions for dynamic content updates
 * - WCAG 2.2 Level AA compliance
 */
const meta: Meta<typeof App> = {
  title: 'App',
  component: App,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          {
            // Ensure buttons have accessible names
            id: 'button-name',
            enabled: true,
          },
          {
            // Check color contrast
            id: 'color-contrast',
            enabled: true,
          },
          {
            // Ensure landmark regions are used correctly
            id: 'region',
            enabled: true,
          },
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof App>;

export const Default: Story = {};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Click the Edit and Preview buttons to toggle between modes. Notice the aria-pressed attribute changes, and the content updates in the aria-live region.',
      },
    },
  },
};
