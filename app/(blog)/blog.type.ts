export type User = {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: 'USER' | 'ADMIN';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  isDeleted: boolean;
  writerId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  id: number;
  content: string;
  isDeleted: boolean;
  writerId: number;
  postId: number;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
  writer: WriterProfile;
  children?: Comment[];
  isWriterDeleted: boolean;
};

export type WriterProfile = Pick<User, 'id' | 'name' | 'image' | 'isDeleted'>;

export type CategoryData = Pick<Category, 'id' | 'name' | 'slug'>;

export type CategoryWithCount = CategoryData & {
  _count: {
    posts: number;
  };
};
export type PostCardData = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;

  writer: WriterProfile;
  category: CategoryData;

  _count: {
    comments: number;
    postLikes: number;
  };
};

export type CommentData = Comment & {
  writer: WriterProfile;
  children?: CommentData[];
  isWriterDeleted: boolean;
};

export type PostDetailData = Post & {
  writer: WriterProfile;
  category: CategoryData;

  likesCount: number;
  isLiked: boolean;
  formattedDate: string;

  formattedComments: CommentData[];

  isWriterDeleted: boolean;
};

export type GrassData = {
  date: string;
  count: number;
  createdCount: number;
  updatedCount: number;
  level: number;
};

export type CurrentUser = {
  id: number;
  name: string;
  image: string | null;
  role: 'ADMIN' | 'USER';
};
