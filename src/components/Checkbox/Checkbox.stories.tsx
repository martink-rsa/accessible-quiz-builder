import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible checkbox component with label, error states, and help text. Follows WCAG 2.2 Level AA guidelines with proper label association, error handling, and keyboard navigation support.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text for the checkbox (required for accessibility)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the checkbox',
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
      description: 'Whether the checkbox is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the checkbox is required',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the checkbox is checked (controlled)',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default checkbox with label.
 */
export const Default: Story = {
  args: {
    label: 'I agree to the terms and conditions',
  },
};

/**
 * Checkbox with help text to provide context.
 */
export const WithHelpText: Story = {
  args: {
    label: 'Subscribe to newsletter',
    helpText: 'You can unsubscribe at any time',
  },
};

/**
 * Checkbox with error message.
 */
export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue',
  },
};

/**
 * Required checkbox with asterisk indicator.
 */
export const Required: Story = {
  args: {
    label: 'I confirm the information is correct',
    required: true,
  },
};

/**
 * Disabled checkbox that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    label: 'Email notifications (unavailable)',
    disabled: true,
  },
};

/**
 * Checked checkbox (controlled state).
 */
export const Checked: Story = {
  args: {
    label: 'Remember me',
    checked: true,
  },
};

/**
 * Small size checkbox for compact interfaces.
 */
export const Small: Story = {
  args: {
    label: 'This is a correct answer',
    size: 'sm',
  },
};

/**
 * Medium size checkbox (default).
 */
export const Medium: Story = {
  args: {
    label: 'This is a correct answer',
    size: 'md',
  },
};

/**
 * Large size checkbox for prominent forms.
 */
export const Large: Story = {
  args: {
    label: 'This is a correct answer',
    size: 'lg',
  },
};

/**
 * All checkbox sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  args: { label: 'Sizes comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Checkbox label="Small - This is a correct answer" size="sm" />
      <Checkbox label="Medium - This is a correct answer" size="md" />
      <Checkbox label="Large - This is a correct answer" size="lg" />
    </div>
  ),
};

/**
 * Various checkbox states displayed together.
 */
export const AllStates: Story = {
  args: { label: 'States comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Checkbox label="I agree to the terms and conditions" />
      <Checkbox
        label="Subscribe to newsletter"
        helpText="You can unsubscribe at any time"
      />
      <Checkbox
        label="Accept terms and conditions"
        error="You must accept the terms to continue"
      />
      <Checkbox label="I confirm the information is correct" required />
      <Checkbox label="Email notifications (unavailable)" disabled />
      <Checkbox label="Remember me" checked readOnly />
    </div>
  ),
};

/**
 * Example of multiple choice question options with checkboxes.
 */
export const MultipleChoiceExample: Story = {
  args: { label: 'Multiple choice example' },
  render: () => (
    <div className="space-y-4" style={{ width: '500px' }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Which of the following are programming languages?
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          Select all correct answers
        </p>
      </div>
      <Checkbox label="Python" />
      <Checkbox label="JavaScript" />
      <Checkbox label="HTML" />
      <Checkbox label="CSS" />
      <Checkbox label="Java" />
    </div>
  ),
};

/**
 * Example of quiz question options with some marked as correct (builder view).
 */
export const QuizBuilderExample: Story = {
  args: { label: 'Quiz builder example' },
  render: () => (
    <div className="space-y-4" style={{ width: '500px' }}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Which of the following are programming languages?
        </h3>
        <p className="text-sm text-neutral-600 mb-4">
          Mark all correct answers
        </p>
      </div>
      <Checkbox
        label="Python"
        helpText="Mark as correct answer"
        checked
        readOnly
      />
      <Checkbox label="JavaScript" helpText="Mark as correct answer" />
      <Checkbox label="HTML" helpText="Mark as correct answer" />
      <Checkbox label="CSS" helpText="Mark as correct answer" />
      <Checkbox
        label="Java"
        helpText="Mark as correct answer"
        checked
        readOnly
      />
    </div>
  ),
};

/**
 * Example of a consent form with validation.
 */
export const ConsentFormExample: Story = {
  args: { label: 'Consent form example' },
  render: () => (
    <form
      className="space-y-4"
      style={{ width: '500px' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold">Quiz Submission</h2>
        <p className="text-sm text-neutral-600 mt-1">
          Please review and accept the following before submitting
        </p>
      </div>
      <Checkbox
        label="I have reviewed all my answers"
        required
        helpText="Make sure to check all questions before submitting"
      />
      <Checkbox
        label="I understand this is my final submission"
        required
        helpText="You cannot edit your answers after submission"
      />
      <Checkbox label="I agree to the academic integrity policy" required />
      <Checkbox label="Send me a copy of my results via email" />
    </form>
  ),
};
