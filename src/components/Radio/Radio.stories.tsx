import type { Meta, StoryObj } from '@storybook/react-vite';

import { Radio } from './Radio';

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible radio button component with label, error states, and help text. Follows WCAG 2.2 Level AA guidelines with proper label association, error handling, and keyboard navigation support. Radio buttons should be used in groups with the same name attribute to allow only one selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description:
        'Label text for the radio button (required for accessibility)',
    },
    name: {
      control: 'text',
      description:
        'Name attribute for grouping radio buttons (required for radio group behavior)',
    },
    value: {
      control: 'text',
      description: 'Value of the radio button',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Visual size of the radio button',
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
      description: 'Whether the radio button is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the radio button is required',
    },
    checked: {
      control: 'boolean',
      description: 'Whether the radio button is checked (controlled)',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default radio button with label.
 */
export const Default: Story = {
  args: {
    name: 'difficulty',
    label: 'Easy',
    value: 'easy',
  },
};

/**
 * Radio button with help text to provide context.
 */
export const WithHelpText: Story = {
  args: {
    name: 'difficulty',
    label: 'Medium',
    value: 'medium',
    helpText: 'Recommended for beginners',
  },
};

/**
 * Radio button with error message.
 */
export const WithError: Story = {
  args: {
    name: 'difficulty',
    label: 'Expert',
    value: 'expert',
    error: 'This difficulty level is not available',
  },
};

/**
 * Required radio button with asterisk indicator.
 */
export const Required: Story = {
  args: {
    name: 'difficulty',
    label: 'Easy',
    value: 'easy',
    required: true,
  },
};

/**
 * Disabled radio button that cannot be interacted with.
 */
export const Disabled: Story = {
  args: {
    name: 'difficulty',
    label: 'Locked difficulty',
    value: 'locked',
    disabled: true,
  },
};

/**
 * Checked radio button (controlled state).
 */
export const Checked: Story = {
  args: {
    name: 'difficulty',
    label: 'Easy',
    value: 'easy',
    checked: true,
  },
};

/**
 * Small size radio button for compact interfaces.
 */
export const Small: Story = {
  args: {
    name: 'size',
    label: 'Paris',
    value: 'paris',
    size: 'sm',
  },
};

/**
 * Medium size radio button (default).
 */
export const Medium: Story = {
  args: {
    name: 'size',
    label: 'London',
    value: 'london',
    size: 'md',
  },
};

/**
 * Large size radio button for prominent forms.
 */
export const Large: Story = {
  args: {
    name: 'size',
    label: 'Tokyo',
    value: 'tokyo',
    size: 'lg',
  },
};

/**
 * All radio button sizes displayed together for comparison.
 */
export const AllSizes: Story = {
  args: { label: 'Sizes comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Radio name="city-sizes" label="Small - Paris" value="paris" size="sm" />
      <Radio
        name="city-sizes"
        label="Medium - London"
        value="london"
        size="md"
      />
      <Radio name="city-sizes" label="Large - Tokyo" value="tokyo" size="lg" />
    </div>
  ),
};

/**
 * Various radio button states displayed together.
 */
export const AllStates: Story = {
  args: { label: 'States comparison' },
  render: () => (
    <div className="space-y-4" style={{ width: '400px' }}>
      <Radio name="states" label="Default" value="default" />
      <Radio
        name="states"
        label="With help text"
        value="help"
        helpText="Additional context"
      />
      <Radio
        name="states"
        label="With error"
        value="error"
        error="Not available"
      />
      <Radio name="states" label="Required" value="required" required />
      <Radio name="states" label="Disabled" value="disabled" disabled />
      <Radio name="states" label="Checked" value="checked" checked readOnly />
    </div>
  ),
};

/**
 * Example of a single choice question
 */
export const SingleChoiceExample: Story = {
  args: { label: 'Single choice example' },
  render: () => (
    <fieldset className="space-y-4" style={{ width: '500px' }}>
      <legend className="mb-4 text-lg font-semibold">
        What is the best programming language?
      </legend>
      <Radio name="language" label="Python" value="python" />
      <Radio name="language" label="JavaScript" value="javascript" />
      <Radio name="language" label="Java" value="java" />
      <Radio name="language" label="C#" value="csharp" />
    </fieldset>
  ),
};

/**
 * Example of quiz question with correct answer marked (builder view).
 */
export const QuizBuilderExample: Story = {
  args: { label: 'Quiz builder example' },
  render: () => (
    <fieldset className="space-y-4" style={{ width: '500px' }}>
      <legend className="mb-2 text-lg font-semibold">
        What is the best programming language?
      </legend>
      <p className="mb-4 text-sm text-neutral-600">Mark the correct answer</p>
      <Radio
        name="language"
        label="Python"
        value="python"
        helpText="Correct answer"
        checked
        readOnly
      />
      <Radio name="language" label="JavaScript" value="javascript" />
      <Radio name="language" label="Java" value="java" />
      <Radio name="language" label="C#" value="csharp" />
    </fieldset>
  ),
};

/**
 * Example of difficulty selection with fieldset.
 */
export const DifficultySelectionExample: Story = {
  args: { label: 'Difficulty selection example' },
  render: () => (
    <form
      className="space-y-4"
      style={{ width: '500px' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset>
        <legend className="mb-4 text-xl font-bold">
          Select Quiz Difficulty
        </legend>
        <div className="space-y-3">
          <Radio
            name="difficulty"
            label="Easy"
            value="easy"
            helpText="10 questions, 30 minutes"
          />
          <Radio
            name="difficulty"
            label="Medium"
            value="medium"
            helpText="15 questions, 45 minutes (Recommended)"
          />
          <Radio
            name="difficulty"
            label="Hard"
            value="hard"
            helpText="20 questions, 60 minutes"
          />
          <Radio
            name="difficulty"
            label="Expert"
            value="expert"
            helpText="25 questions, 90 minutes"
          />
        </div>
      </fieldset>
    </form>
  ),
};

/**
 * Example with required radio group.
 */
export const RequiredGroupExample: Story = {
  args: { label: 'Required group example' },
  render: () => (
    <form
      className="space-y-4"
      style={{ width: '500px' }}
      onSubmit={(e) => e.preventDefault()}
    >
      <fieldset>
        <legend className="mb-1 text-lg font-semibold">
          Choose your answer{' '}
          <span className="text-destructive-600" aria-label="required">
            *
          </span>
        </legend>
        <p className="mb-4 text-sm text-neutral-600">
          You must select one option
        </p>
        <div className="space-y-3">
          <Radio name="answer" label="Option A" value="a" required />
          <Radio name="answer" label="Option B" value="b" required />
          <Radio name="answer" label="Option C" value="c" required />
          <Radio name="answer" label="Option D" value="d" required />
        </div>
      </fieldset>
    </form>
  ),
};
