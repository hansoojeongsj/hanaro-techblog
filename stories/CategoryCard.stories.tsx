import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { CategoryWithLatest } from '@/app/(blog)/categories/category.service';
import { CategoryCard } from '@/components/blog/CategoryCard';

const mockCategory: CategoryWithLatest = {
  id: '1',
  name: 'React',
  slug: 'react',
  description: '리액트 관련 개념과 실전 예제들을 다룹니다.',
  postCount: 12,
  latestPostTitle: 'useEffect 완벽 정리',
};

const meta: Meta<typeof CategoryCard> = {
  title: 'Blog/CategoryCard',
  component: CategoryCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    category: mockCategory,
  },
};

export const NoPosts: Story = {
  args: {
    category: {
      ...mockCategory,
      postCount: 0,
      latestPostTitle: undefined,
    },
  },
};

export const NoDescription: Story = {
  args: {
    category: {
      ...mockCategory,
      description: '',
    },
  },
};
