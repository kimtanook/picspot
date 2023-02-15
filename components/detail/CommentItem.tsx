import { deleteComment } from '@/api';
import { authService } from '@/firebase';
import { signOut } from 'firebase/auth';
import React, { MouseEvent } from 'react';
import { useMutation, useQueryClient } from 'react-query';

function CommentItem({
  item,
  postId,
}: {
  item: commentItemType;
  postId: string | string[] | undefined;
}) {
  console.log('authService.currentUser  : ', authService.currentUser);
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(deleteComment);

  const onClickDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      mutate(
        { postId, commentId: item.id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries('comments');
          },
        }
      );
    }
  };
  if (isLoading) {
    return <div>삭제중입니다.</div>;
  }
  return (
    <div>
      <div>{item?.contents}</div>
      <div>
        {authService.currentUser?.uid === item.creatorUid ? (
          <button onClick={onClickDelete}>삭제</button>
        ) : null}
      </div>
    </div>
  );
}

export default CommentItem;
