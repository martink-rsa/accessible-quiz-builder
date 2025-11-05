import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible input component with label, error states, and help text. Follows WCAG 2.2 Level AA guidelines with proper label association, error handling, and keyboard navigation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the input (required for accessibility)',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'HTML input type',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the input',
    },
    error: {
      control: 'text',
      description: 'Error message to display',
    },
    helpText: {
      control: 'text',
      description: 'Help text to display',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the input is required',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text input with label.
 */
export const Default: Story = {
  args: {
    label: 'Quiz Title',
    placeholder: 'Enter quiz title',
  },
};

/**
 * Email input with proper type for validation and keyboard.
 */
export const Email: Story = {
  args: {
    label: 'Student Email',
    type: 'email',
    placeholder: 'student@school.edu',
  },
};

/**
 * Number input for quiz settings.
 */
export const Number: Story = {
  args: {
    label: 'Points',
    type: 'number',
    placeholder: '10',
  },
};

/**
 * Input with help text to provide context.
 */
export const WithHelpText: Story = {
  args: {
    label: 'Question Text',
    helpText: 'Enter a clear and concise question',
    placeholder: 'What is the capital of France?',
  },
};

/**
 * Input with error message. Error takes precedence over help text.
 */
export const WithError: Story = {
  args: {
    label: 'Time Limit (minutes)',
    type: 'number',
    error: 'Time limit must be between 1 and 180 minutes',
    defaultValue: '0',
  },
};

/**
 * Required input with asterisk indicator.
 */
export const Required: Story = {
  args: {
    label: 'Quiz Title',
    required: true,
    placeholder: 'Introduction to Programming',
  },
};

/**
 * Disabled input that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    label: 'Quiz ID',
    disabled: true,
    defaultValue: 'QUIZ-12345',
  },
};

/**
 * Small size input for compact interfaces.
 */
export const Small: Story = {
  args: {
    label: 'Points',
    size: 'sm',
    type: 'number',
    placeholder: '10',
  },
};

/**
 * Medium size input (default).
 */
export const Medium: Story = {
  args: {
    label: 'Question Text',
    size: 'md',
    placeholder: 'Enter your question',
  },
};

/**
 * Large size input for prominent forms.
 */
export const Large: Story = {
  args: {
    label: 'Quiz Title',
    size: 'lg',
    placeholder: 'Introduction to Programming',
  },
};

/**
 * All input sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  args: { label: 'Sizes comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Input label="Points" size="sm" type="number" placeholder="10" />
      <Input
        label="Question Text"
        size="md"
        placeholder="Enter your question"
      />
      <Input
        label="Quiz Title"
        size="lg"
        placeholder="Introduction to Programming"
      />
    </div>
  ),
};

/**
 * Different input types displayed together.
 */
export const AllTypes: Story = {
  args: { label: 'Types comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Input
        label="Quiz Title"
        type="text"
        placeholder="Introduction to Programming"
      />
      <Input
        label="Student Email"
        type="email"
        placeholder="student@school.edu"
      />
      <Input label="Points" type="number" placeholder="10" />
      <Input label="Time Limit (minutes)" type="number" placeholder="60" />
    </div>
  ),
};

/**
 * Various input states displayed together.
 */
export const AllStates: Story = {
  args: { label: 'States comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Input label="Quiz Title" placeholder="Enter quiz title" />
      <Input
        label="Question Text"
        helpText="Enter a clear and concise question"
      />
      <Input
        label="Time Limit"
        type="number"
        error="Time limit must be between 1 and 180 minutes"
        defaultValue="0"
      />
      <Input
        label="Quiz Title"
        required
        placeholder="Introduction to Programming"
      />
      <Input label="Quiz ID" disabled defaultValue="QUIZ-12345" />
    </div>
  ),
};

/**
 * Example of a quiz creation form with validation.
 */
export const FormExample: Story = {
  args: { label: 'Form example' },
  render: () => (
    <form
      className="space-y-4"
      style={{ width: '400px' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Input
        label="Quiz Title"
        type="text"
        required
        placeholder="Introduction to Programming"
      />
      <Input
        label="Time Limit (minutes)"
        type="number"
        required
        helpText="Leave blank for no time limit"
        placeholder="60"
      />
      <Input
        label="Passing Score (%)"
        type="number"
        required
        helpText="Minimum score required to pass"
        placeholder="70"
      />
      <Input label="Total Points" type="number" required placeholder="100" />
    </form>
  ),
};
