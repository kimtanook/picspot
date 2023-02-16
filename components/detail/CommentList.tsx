import { addComment, getComment } from '@/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CommentItem from './CommentItem';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, FormEvent, useState } from 'react';
import { authService } from '@/firebase';

const CommentList = ({ postId }: postId) => {
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const { data, isLoading } = useQuery(['comments', postId], getComment);
  const { isLoading: commentLoading, mutate: commentMutate } =
    useMutation(addComment);

  const onChangeComment = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const submitCommentData = {
    creatorUid: authService.currentUser?.uid,
    creator: authService.currentUser?.email,
    contents: comment,
    createdAt: Date.now(),
  };

  const onSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authService.currentUser) {
      return alert('로그인 후 댓글을 남겨보세요!');
    } else if (comment) {
      commentMutate(
        { postId, submitCommentData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries('comments');
          },
        }
      );
      setComment('');
    } else {
      alert('댓글을 입력해주세요!');
    }
  };

  if (isLoading) {
    return <div>로딩중입니다</div>;
  }
  return (
    <div>
      <div>CommentList component</div>
      <form onSubmit={onSubmitComment}>
        <input
          onChange={onChangeComment}
          value={comment}
          placeholder={
            authService.currentUser
              ? '댓글을 남겨보세요!'
              : '로그인 후 댓글을 남겨보세요!'
          }
          disabled={authService.currentUser ? false : true}
        />
        <button>작성</button>
      </form>
      {data.map((item: commentItemType) => (
        <CommentItem key={uuidv4()} item={item} postId={postId} />
      ))}
    </div>
  );
};
export default CommentList;
