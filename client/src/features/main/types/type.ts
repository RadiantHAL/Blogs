export type BlogMedia = {
  url: string;
  fileId: string;
  name: string;
  mimeType: string;
};

export type BlogUser = {
  _id: string;
  username: string;
  email?: string;
};

export type Blog = {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  media: BlogMedia[];
  user: BlogUser | string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBlogData = {
  title: string;
  content: string;
  tags: string[];
  media?: BlogMedia[];
};

export type SearchForm = {
  search: string;
};