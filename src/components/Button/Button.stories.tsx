import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible button component with multiple variants, sizes, and states. Follows WCAG 2.2 Level AA guidelines with proper contrast ratios and keyboard navigation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
      description: 'Visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether this is an icon-only button',
    },
    children: {
      control: 'text',
      description: 'Button content',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary buttons are used for the main call-to-action on a page.
 * They have the highest visual prominence.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Submit Answer',
  },
};

/**
 * Secondary buttons are used for less prominent actions.
 * They provide a warm, encouraging alternative to primary buttons.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Save Draft',
  },
};

/**
 * Ghost buttons are transparent and used for tertiary actions.
 * They have the least visual prominence.
 */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Cancel',
  },
};

/**
 * Destructive buttons are used for delete or dangerous actions.
 * They have a red color to warn users about the consequences.
 */
export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Quiz',
  },
};

/**
 * Small size buttons for compact interfaces.
 */
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Add Question',
  },
};

/**
 * Medium size buttons (default).
 */
export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Next Question',
  },
};

/**
 * Large size buttons for prominent actions.
 */
export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Start Quiz',
  },
};

/**
 * Disabled buttons cannot be interacted with.
 * They have reduced opacity and pointer-events are disabled.
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Submit Answer',
  },
};

/**
 * Loading buttons show a spinner and are disabled during async operations.
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Saving Quiz...',
  },
};

/**
 * Icon-only buttons must have an aria-label for accessibility.
 * They use special padding to maintain a square shape.
 */
export const IconOnly: Story = {
  args: {
    iconOnly: true,
    'aria-label': 'Delete question',
    children: '×',
  },
};

/**
 * All button variants displayed together for comparison.
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">Submit Answer</Button>
      <Button variant="secondary">Save Draft</Button>
      <Button variant="ghost">Cancel</Button>
      <Button variant="destructive">Delete Quiz</Button>
    </div>
  ),
};

/**
 * All button sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Add Question</Button>
      <Button size="md">Next Question</Button>
      <Button size="lg">Start Quiz</Button>
    </div>
  ),
};

/**
 * All button states displayed together for comparison.
 */
export const AllStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button>Submit Answer</Button>
      <Button disabled>Submit Answer</Button>
      <Button loading>Saving Quiz...</Button>
    </div>
  ),
};

/**
 * Example of buttons with icon and text.
 */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        Add Question
      </Button>
      <Button variant="destructive">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Delete Question
      </Button>
    </div>
  ),
};

/**
 * Interactive example to test button behavior.
 */
export const Interactive: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Submit Answer',
    onClick: () => alert('Answer submitted!'),
  },
};
