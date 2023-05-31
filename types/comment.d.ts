declare interface CommentItemType {
  [key: string]: string;
}
interface postId {
  [key: string]: string | string[] | undefined;
}
declare interface AddComment {
  submitCommentData: {
    [key: string]: string | string[] | null | number | undefined;
  };
}
declare interface DeleteComment {
  [key: string]: string | string[] | undefined;
}
