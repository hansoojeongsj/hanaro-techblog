import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  CategoryBadge,
  type CategoryBadgeCategory,
} from '@/components/blog/CategoryBadge';

const mockCategory: CategoryBadgeCategory = {
  id: 1,
  name: 'React',
  slug: 'react',
  postCount: 12,
};

const meta: Meta<typeof CategoryBadge> = {
  title: 'Blog/CategoryBadge',
  component: CategoryBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: mockCategory,
  },
};

export const WithCount: Story = {
  args: {
    category: mockCategory,
    showCount: true,
  },
};

export const Small: Story = {
  args: {
    category: mockCategory,
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    category: mockCategory,
    size: 'lg',
  },
};
