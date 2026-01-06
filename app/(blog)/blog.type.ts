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
  content?: string;
  createdAt: Date;
  writerId: string;
  writer: string;
  writerImage?: string | null;
  likes: number;
  commentCount: number;
  categoryId?: string;
  category?: CategoryData;
};

export type CurrentUser = {
  id: number | null;
  name: string;
  image: string | null;
  role: 'ADMIN' | 'USER';
};

export type Comment = {
  id: string;
  writerId: number;
  content: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  parentId?: string | null;

  isDeleted: boolean;
  isWriterDeleted: boolean;

  author: {
    name: string;
    avatar?: string;
  };
};

export type PostDetail = {
  id: number;
  title: string;
  content: string;
  writerId: number;
  writer: { name: string; image: string | null };
  category: { id: number; name: string } | null;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  isLiked: boolean;
  formattedDate: string;
  formattedComments: Comment[];
  isWriterDeleted: boolean;
};
