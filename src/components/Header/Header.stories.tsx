import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta = {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithShadow: Story = {
  args: {
    className: 'shadow-lg',
  },
};

export const CustomStyling: Story = {
  args: {
    className: 'bg-neutral-100 border-neutral-300',
  },
};
