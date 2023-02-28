import { addComment, getComment } from '@/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CommentItem from './CommentItem';
import { v4 as uuidv4 } from 'uuid';
import { ChangeEvent, FormEvent, useState } from 'react';
import { authService } from '@/firebase';
import styled from 'styled-components';
import { customAlert } from '@/utils/alerts';

const CommentList = ({ postId }: postId) => {
  const [inputCount, setInputCount] = useState(0);

  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const { data, isLoading } = useQuery(['comments', postId], getComment);
  const { isLoading: commentLoading, mutate: commentMutate } =
    useMutation(addComment);

  const submitCommentData = {
    creatorUid: authService.currentUser?.uid,
    userName: authService.currentUser?.displayName,
    userImg: authService.currentUser?.photoURL,
    contents: comment,
    createdAt: Date.now(),
  };

  const onSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authService.currentUser) {
      return alert('로그인 후 댓글을 남겨보세요!');
    } else if (comment.length > 30) {
      customAlert('30자를 초과했어요.');
      return;
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
    <StCommentContainer>
      <StCommentBox>
        {data.map((item: CommentItemType) => (
          <CommentItem key={uuidv4()} item={item} postId={postId} />
        ))}
      </StCommentBox>
      <StForm onSubmit={onSubmitComment}>
        <StInput
          onChange={(e) => {
            setComment(e.target.value);
            setInputCount(e.target.value.length);
          }}
          value={comment}
          placeholder={
            authService.currentUser
              ? '댓글을 남겨보세요!'
              : '로그인 후 댓글을 남겨보세요!'
          }
          disabled={authService.currentUser ? false : true}
        />
        <StInputBtnContainer>
          <span style={{ color: '#8E8E93', paddingTop: 6, width: 50 }}>
            {inputCount} /30
          </span>
          <StInputBtn>댓글 등록</StInputBtn>
        </StInputBtnContainer>
      </StForm>
    </StCommentContainer>
  );
};
export default CommentList;

const StCommentContainer = styled.div``;

const StCommentBox = styled.div`
  height: 150px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const StForm = styled.form`
  display: flex;
  justify-content: space-between;
  background-color: #f8f8f8;
  height: 50px;
  align-items: center;
  margin-top: 10px;
`;

const StInput = styled.input`
  background-color: #f8f8f8;
  border: transparent;
  height: 20px;
  width: 70%;
  padding-left: 20px;
`;

const StInputBtnContainer = styled.div`
  display: flex;
`;

const StInputBtn = styled.button`
  cursor: pointer;
  background-color: #1882ff;
  color: white;
  border-radius: 5px;
  width: 80px;
  height: 30px;
  text-align: center;
  margin-left: 10px;
  border: transparent;
  margin-right: 10px;
`;
