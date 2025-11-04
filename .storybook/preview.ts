import type { Preview } from '@storybook/react-vite';
import '../src/index.css'; // Import Tailwind CSS and global styles

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Configure a11y addon
    a11y: {
      config: {
        rules: [
          {
            // Configure WCAG 2.1 Level AA rules
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export default preview;
