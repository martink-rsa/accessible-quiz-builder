import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible textarea component for multi-line text input with label, error states, and help text. Follows WCAG 2.2 Level AA guidelines with proper label association, error handling, and keyboard navigation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the textarea (required for accessibility)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the textarea',
    },
    rows: {
      control: 'number',
      description: 'Number of visible rows',
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
      description: 'Whether the textarea is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the textarea is required',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default textarea with label.
 */
export const Default: Story = {
  args: {
    label: 'Question Text',
    placeholder: 'Enter your question here...',
  },
};

/**
 * Textarea with help text to provide context.
 */
export const WithHelpText: Story = {
  args: {
    label: 'Quiz Instructions',
    helpText:
      'Provide clear instructions for students (maximum 500 characters)',
    placeholder: 'Read each question carefully and select the best answer...',
    rows: 5,
  },
};

/**
 * Textarea with error message. Error takes precedence over help text.
 */
export const WithError: Story = {
  args: {
    label: 'Answer Explanation',
    error: 'Explanation must be at least 20 characters long',
    defaultValue: 'Too brief',
    rows: 4,
  },
};

/**
 * Required textarea with asterisk indicator.
 */
export const Required: Story = {
  args: {
    label: 'Question Text',
    required: true,
    placeholder: 'Enter the question text...',
    rows: 6,
  },
};

/**
 * Disabled textarea that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    label: 'Student Answer',
    disabled: true,
    defaultValue:
      'A variable is a container that can hold a value.\nIt can be a number, a string, or a boolean.',
    rows: 3,
  },
};

/**
 * Small size textarea for compact interfaces.
 */
export const Small: Story = {
  args: {
    label: 'Hint',
    size: 'sm',
    placeholder: 'Add a hint for students...',
    rows: 3,
  },
};

/**
 * Medium size textarea (default).
 */
export const Medium: Story = {
  args: {
    label: 'Answer Explanation',
    size: 'md',
    placeholder: 'Explain the correct answer...',
    rows: 4,
  },
};

/**
 * Large size textarea for prominent forms.
 */
export const Large: Story = {
  args: {
    label: 'Question Text',
    size: 'lg',
    placeholder: 'Enter your question...',
    rows: 5,
  },
};

/**
 * Textarea with custom rows for long-form content.
 */
export const CustomRows: Story = {
  args: {
    label: 'Essay Question',
    rows: 10,
    placeholder:
      'Enter your essay question here. Students will need to provide a detailed response...',
  },
};

/**
 * All textarea sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  args: { label: 'Sizes comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '500px' }}>
      <Textarea label="Hint" size="sm" placeholder="Add a hint..." rows={3} />
      <Textarea
        label="Answer Explanation"
        size="md"
        placeholder="Explain the correct answer..."
        rows={3}
      />
      <Textarea
        label="Question Text"
        size="lg"
        placeholder="Enter your question..."
        rows={3}
      />
    </div>
  ),
};

/**
 * Various textarea states displayed together.
 */
export const AllStates: Story = {
  args: { label: 'States comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '500px' }}>
      <Textarea
        label="Question Text"
        placeholder="Enter your question..."
        rows={3}
      />
      <Textarea
        label="Quiz Instructions"
        helpText="Provide clear instructions for students"
        rows={3}
      />
      <Textarea
        label="Answer Explanation"
        error="Explanation must be at least 20 characters"
        defaultValue="Too brief"
        rows={3}
      />
      <Textarea
        label="Question Text"
        required
        placeholder="Enter the question text..."
        rows={3}
      />
      <Textarea
        label="Student Answer"
        disabled
        defaultValue="A variable is a container that can hold a value. It can be a number, a string, or a boolean."
        rows={3}
      />
    </div>
  ),
};

/**
 * Example of a question creation form.
 */
export const QuestionForm: Story = {
  args: { label: 'Question form' },
  render: () => (
    <form
      className="space-y-4"
      style={{ width: '500px' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <Textarea
        label="Question Text"
        required
        helpText="Enter a clear and concise question"
        placeholder="What is a variable?"
        rows={4}
      />
      <Textarea
        label="Correct Answer Explanation"
        required
        helpText="Explain why this is the correct answer"
        placeholder="A variable is a container that can hold a value. It can be a number, a string, or a boolean."
        rows={4}
      />
      <Textarea
        label="Additional Notes"
        helpText="Any additional context or resources (optional)"
        placeholder="Students should review the concept of variables..."
        rows={5}
      />
    </form>
  ),
};

/**
 * Example showing character counter for quiz instructions.
 */
export const WithCharacterCount: Story = {
  args: { label: 'Character count' },
  render: () => {
    const maxLength = 500;
    return (
      <Textarea
        label="Quiz Instructions"
        helpText={`Maximum ${maxLength} characters`}
        placeholder="Read each question carefully and select the best answer. You have 60 minutes to complete this quiz..."
        maxLength={maxLength}
        rows={5}
      />
    );
  },
};
