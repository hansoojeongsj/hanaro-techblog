export type PostFormData = {
  id?: string;
  title: string;
  content: string;
  categoryId: string;
};

export type FormState = {
  error?: {
    title?: string;
    content?: string;
    categoryId?: string;
    auth?: string;
  };
  data?: {
    title?: string;
    content?: string;
    categoryId?: string;
  };
};
