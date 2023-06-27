export interface Blog {
  id: string;
  author: string;
  url: string;
  title: string;
  likes: number;
}

export type NewBlog = Omit<Blog, 'id'>;

export type UpdateBlog = Partial<Omit<NewBlog, 'likes'>>;

export interface BlogService {
  getAll: () => Promise<Blog[]>;
  getById: (id: string) => Promise<Blog | undefined | null>;
  addOne: (newBlog: NewBlog) => Promise<Blog>;
  deleteOne: (id: string) => Promise<Blog | undefined | null>;
  updateOne: (id: string, update: UpdateBlog) => Promise<Blog | undefined | null>;
}
