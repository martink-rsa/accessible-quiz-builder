import { Button } from '@components/Button';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AlignCenter, AlignLeft, AlignRight, Edit, Eye } from 'lucide-react';
import { useState } from 'react';

import { ButtonGroup } from './ButtonGroup';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Accessible button group component for grouping related buttons visually and semantically. Uses role="group" for screen readers and provides proper visual grouping.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    'aria-label': {
      control: 'text',
      description: 'Accessible label for the button group (required)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic button group with two buttons
 */
export const Basic: Story = {
  args: {
    'aria-label': 'View mode',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="primary">Edit</Button>
      <Button variant="ghost">Preview</Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with icons and toggle behavior
 */
export const WithIcons: Story = {
  args: {
    'aria-label': 'View mode',
  },
  render: (args) => {
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');

    return (
      <ButtonGroup {...args}>
        <Button
          variant={mode === 'edit' ? 'primary' : 'ghost'}
          onClick={() => setMode('edit')}
          aria-pressed={mode === 'edit'}
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button
          variant={mode === 'preview' ? 'primary' : 'ghost'}
          onClick={() => setMode('preview')}
          aria-pressed={mode === 'preview'}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </ButtonGroup>
    );
  },
};

/**
 * Button group with three alignment options
 */
export const AlignmentGroup: Story = {
  args: {
    'aria-label': 'Text alignment',
  },
  render: (args) => {
    const [alignment, setAlignment] = useState<'left' | 'center' | 'right'>(
      'left',
    );

    return (
      <ButtonGroup {...args}>
        <Button
          variant={alignment === 'left' ? 'primary' : 'ghost'}
          onClick={() => setAlignment('left')}
          aria-pressed={alignment === 'left'}
          aria-label="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={alignment === 'center' ? 'primary' : 'ghost'}
          onClick={() => setAlignment('center')}
          aria-pressed={alignment === 'center'}
          aria-label="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={alignment === 'right' ? 'primary' : 'ghost'}
          onClick={() => setAlignment('right')}
          aria-pressed={alignment === 'right'}
          aria-label="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </ButtonGroup>
    );
  },
};

/**
 * Button group with small size buttons
 */
export const SmallButtons: Story = {
  args: {
    'aria-label': 'Actions',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary" size="sm">
        Save
      </Button>
      <Button variant="ghost" size="sm">
        Cancel
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Button group with large size buttons
 */
export const LargeButtons: Story = {
  args: {
    'aria-label': 'Quiz actions',
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="primary" size="lg">
        Start Quiz
      </Button>
      <Button variant="secondary" size="lg">
        Review
      </Button>
    </ButtonGroup>
  ),
};

/**
 * Multiple button groups displayed together
 */
export const MultipleGroups: Story = {
  args: {
    'aria-label': 'View mode',
  },
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup aria-label="View mode">
        <Button variant="primary">Edit</Button>
        <Button variant="ghost">Preview</Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Actions">
        <Button variant="secondary">Save</Button>
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </ButtonGroup>
    </div>
  ),
};
