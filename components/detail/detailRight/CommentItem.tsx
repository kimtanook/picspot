import { deleteComment, getCommentUser } from '@/api';
import DataError from '@/components/common/DataError';
import DataLoading from '@/components/common/DataLoading';
import { authService } from '@/firebase';
import { logEvent } from '@/utils/amplitude';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';

function CommentItem({
  item,
  postId,
}: {
  item: CommentItemType;
  postId: string | string[] | undefined;
}) {
  const {
    data: commentItem,
    isLoading,
    isError,
  } = useQuery(['CommentUser', item.creatorUid], getCommentUser);
  // console.log('commentItem: ', commentItem);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(deleteComment);
  const isMobile = useMediaQuery({ maxWidth: 823 });
  const isPc = useMediaQuery({ minWidth: 824 });

  const onClickDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      mutate(
        { postId, commentId: item.id },
        {
          onSuccess: () => {
            setTimeout(() => queryClient.invalidateQueries('comments'), 500);
            logEvent('댓글 삭제 버튼', { from: 'detail page' });
          },
        }
      );
    }
  };

  if (isLoading) {
    return <DataLoading />;
  }

  if (isError) {
    return <DataError />;
  }

  return (
    <CommentContainer>
      <Image2 src={commentItem?.userImg} />
      <Name>{commentItem?.userName}</Name>
      <Comment>
        <div>{item?.contents}</div>
        <DeleteMyComment>
          <TipBar src="/bar.png" alt="image" />
          {authService.currentUser?.uid === item.creatorUid ? (
            <>
              {isPc && <Button onClick={onClickDelete}>삭제하기</Button>}
              {isMobile && <Button onClick={onClickDelete}>삭제</Button>}
            </>
          ) : null}
        </DeleteMyComment>
      </Comment>
    </CommentContainer>
  );
}

export default CommentItem;

const CommentContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  background-color: 0px;
  /* border-radius: 10px; */
  height: 40px;
  margin-right: 10px;
`;

const Image2 = styled.img`
  border-radius: 50%;
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const Name = styled.div`
  width: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  /* margin-right: 10px; */
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 16px;
  font-family: 'Noto Sans CJK KR';
`;

const Comment = styled.div`
  flex-direction: row;
  justify-content: space-between;
  display: flex;

  /* justify-content: flex-end; */
  align-items: center;
  width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-family: 'Noto Sans CJK KR';
`;

const DeleteMyComment = styled.div`
  display: flex;
  flex-direction: row;
`;

const TipBar = styled.img`
  width: 2px;
  height: 24px;
  display: flex;
  justify-content: flex-end;
  margin-left: 10px;
  margin-right: 10px;
  @media ${(props) => props.theme.mobile} {
    width: 2px;
    margin-left: 0px;
    margin-right: 0px;
  }
`;
const Button = styled.div`
  color: #d9d9d9;
  cursor: pointer;
  width: 60px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row-reverse;
  padding: 15px;
  border-radius: 10px;
  background-color: transparent;
  font-size: 14px;
  font-family: 'Noto Sans CJK KR';
  :hover {
    transition: 0.3s;
    background-color: #4cb2f6;
    color: white;
  }
`;
