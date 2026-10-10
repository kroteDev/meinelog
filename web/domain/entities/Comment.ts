export type CommentableType = "Task";

export interface Comment {
  id: string;
  description: string;
  userId: number;
  commentableType: CommentableType;
  commentableId: string;
  createdAt: Date;
  updatedAt: Date;
}
