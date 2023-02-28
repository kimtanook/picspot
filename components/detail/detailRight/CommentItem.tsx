import { deleteComment } from '@/api';
import { authService } from '@/firebase';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';

function CommentItem({
  item,
  postId,
}: {
  item: CommentItemType;
  postId: string | string[] | undefined;
}) {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(deleteComment);

  const onClickDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      mutate(
        { postId, commentId: item.id },
        {
          onSuccess: () => {
            setTimeout(() => queryClient.invalidateQueries('comments'), 500);
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
      <StComment>
        <div>{item.contents}</div>
        {authService.currentUser?.uid === item.creatorUid ? (
          <Stbutton onClick={onClickDelete}>삭제</Stbutton>
        ) : null}
      </StComment>
    </StCommentContainer>
  );
}

export default CommentItem;

const StCommentContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  background-color: #f8f8f8;
  border-radius: 10px;
  height: 40px;
  :hover {
    transition: 0.3s;
    background-color: #4cb2f6;
    color: white;
  }
`;

const StImage = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const StName = styled.div`
  width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const StComment = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Stbutton = styled.div`
  background-color: #1882ff;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  width: 50px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  margin-right: 10px;
`;
