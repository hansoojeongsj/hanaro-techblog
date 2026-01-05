export type CategoryData = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
};

export type PostCardData = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: Date;
  writerId: string;
  writer: string;
  writerImage?: string | null;
  likes: number;
  commentCount: number;
  categoryId: string;
  category: CategoryData;
};
