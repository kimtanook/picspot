import { deleteComment } from '@/api';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

function CommentItem({
  item,
  postId,
}: {
  item: commentItemType;
  postId: string | string[] | undefined;
}) {
  // console.log('item.userImg: ', item.userImg);
  // console.log('item.userName: ', item.userName);

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
    <StCommentContainer>
      <StImage src={item.userImg} />
      <StName>{item.userName}</StName>
      <StComment>{item?.contents}</StComment>
      {/* <div>
        {authService.currentUser?.uid === item.creatorUid ? (
          <button onClick={onClickDelete}>삭제</button>
        ) : null}
      </div> */}
    </StCommentContainer>
  );
}

export default CommentItem;

const StCommentContainer = styled.div`
  display: flex;
  margin-top: 10px;
  background-color: #f8f8f8;
  height: 30px;
`;

const StImage = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const StName = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const StComment = styled.div`
  display: flex;
  align-items: center;
`;
