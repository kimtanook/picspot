import { addComment, getComment } from '@/api';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CommentItem from './CommentItem';
import { v4 as uuidv4 } from 'uuid';
import { FormEvent, useState } from 'react';
import { authService } from '@/firebase';
import styled from 'styled-components';
import { customAlert } from '@/utils/alerts';
import { logEvent } from '@amplitude/analytics-browser';

const CommentList = ({ postId }: postId) => {
  const [inputCount, setInputCount] = useState(0);

  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const { data, isLoading } = useQuery(['comments', postId], getComment);
  const { isLoading: commentLoading, mutate: commentMutate } =
    useMutation(addComment);

  const submitCommentData = {
    creatorUid: authService.currentUser?.uid,
    contents: comment,
    createdAt: Date.now(),
  };

  const onSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!authService.currentUser) {
      return customAlert('로그인 후 댓글을 남겨보세요!');
    } else if (comment.length > 30) {
      customAlert('댓글이 30자를 초과했어요.');
      return;
    } else if (comment) {
      commentMutate(
        { postId, submitCommentData },
        {
          onSuccess: () => {
            queryClient.invalidateQueries('comments');
            logEvent('댓글 등록 버튼', { from: 'detail page' });
          },
        }
      );
      setComment('');
    } else {
      customAlert('댓글을 입력해주세요!');
    }
  };

  if (isLoading) {
    return <div>로딩중입니다</div>;
  }
  return (
    <CommentContainer>
      <CommentBox>
        {data.map((item: CommentItemType) => (
          <CommentItem key={uuidv4()} item={item} postId={postId} />
        ))}
      </CommentBox>
      <Form onSubmit={onSubmitComment}>
        <Input
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
        <InputBtnContainer>
          <span style={{ color: '#8E8E93', paddingTop: 6, width: 50 }}>
            {inputCount} /30
          </span>
          <InputBtn>댓글 등록</InputBtn>
        </InputBtnContainer>
      </Form>
    </CommentContainer>
  );
};
export default CommentList;

const CommentContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
    width: 350px;
    height: 120px;
    margin: auto;
    margin-top: 10px;
  }
`;

const CommentBox = styled.div`
  height: 150px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  background-color: transparent;
`;

const Form = styled.form`
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  background-color: #f8f8f8;
  height: 50px;
  align-items: center;
  margin-top: 10px;
`;

const Input = styled.input`
  background-color: #f8f8f8;
  border: transparent;
  height: 40px;
  width: 70%;
  margin-left: 20px;
  :focus-visible {
    outline: none;
  }
`;

const InputBtnContainer = styled.div`
  display: flex;
`;

const InputBtn = styled.button`
  cursor: pointer;
  background-color: #4cb2f6;
  color: white;
  border-radius: 5px;
  width: 80px;
  height: 30px;
  text-align: center;
  margin-left: 10px;
  border: transparent;
  margin-right: 10px;
`;
