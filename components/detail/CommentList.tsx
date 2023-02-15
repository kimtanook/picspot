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
    commentMutate(
      { postId, submitCommentData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries('comments');
        },
      }
    );
    setComment('');
  };
  console.log('postId : ', postId);
  console.log('comment : ', comment);
  console.log('authService.currentUser : ', authService.currentUser);

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
          placeholder="댓글을 남겨보세요!"
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
