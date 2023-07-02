export interface BlogType {
  id: number;
  author: string;
  url: string;
  title: string;
  likes: number;
}

export type NewBlogType = Omit<BlogType, 'id'>;

export type UpdateBlogType = Pick<NewBlogType, 'likes'>;
