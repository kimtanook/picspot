import { addComment, getComment } from '@/api';
import { AuthCurrentUser, editBtnToggleAtom } from '@/atom';
import { authService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import { logEvent } from '@amplitude/analytics-browser';
import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useMediaQuery } from 'react-responsive';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import CommentItem from './CommentItem';

const CommentList = ({ postId }: postId) => {
  const [inputCount, setInputCount] = useState(0);
  const [editBtnToggle, setEditBtnToggle] = useRecoilState(editBtnToggleAtom);
  const [currentUser, setCurrentUser] = useRecoilState(AuthCurrentUser);
  const user = authService.currentUser;
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const { data, isLoading } = useQuery(['comments', postId], getComment);
  const { isLoading: commentLoading, mutate: commentMutate } =
    useMutation(addComment);
  const isMobile = useMediaQuery({ maxWidth: 823 });
  const isPc = useMediaQuery({ minWidth: 824 });
  const submitCommentData = {
    creatorUid: authService.currentUser?.uid,
    contents: comment,
    createdAt: Date.now(),
    postId: postId,
  };

  const onSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return customAlert('로그인 후 댓글을 남겨보세요!');
    } else if (comment.length > 30) {
      customAlert('댓글이 30자를 초과했어요.');
      return;
    } else if (comment) {
      commentMutate(
        { submitCommentData },
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
        {data?.map((item: CommentItemType) => (
          <CommentItem key={uuidv4()} item={item} postId={postId} />
        ))}
      </CommentBox>
      {!editBtnToggle && (
        <Form onSubmit={onSubmitComment}>
          <Input
            onChange={(e) => {
              setComment(e.target.value);
              setInputCount(e.target.value.length);
            }}
            value={comment}
            placeholder={
              currentUser || user
                ? '댓글을 남겨보세요!'
                : '로그인 후 댓글을 남겨보세요!'
            }
            disabled={currentUser || user ? false : true}
          />
          {isPc && (
            <InputBtnContainer>
              <span style={{ color: '#8E8E93', paddingTop: 6, width: 50 }}>
                {inputCount} /30
              </span>
              <InputBtn>댓글 등록</InputBtn>
            </InputBtnContainer>
          )}
          {isMobile && (
            <InputBtnContainer>
              <span style={{ color: '#8E8E93', paddingTop: 6, width: 40 }}>
                {inputCount} /30
              </span>
              <InputBtn>
                <InputBtnImg src="/comment-check.png" alt="comment-check" />
              </InputBtn>
            </InputBtnContainer>
          )}
        </Form>
      )}
    </CommentContainer>
  );
};
export default CommentList;

const CommentContainer = styled.div`
  @media ${(props) => props.theme.mobile} {
    width: 350px;
    height: 120px;
    margin: auto;
    display: flex;
    flex-direction: column-reverse;
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
  @media ${(props) => props.theme.mobile} {
    position: absolute;
    width: 350px;
    height: 50px;
    top: 58%;
  }
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
  @media ${(props) => props.theme.mobile} {
    padding: 0px;
  }
`;

const InputBtn = styled.button`
  cursor: pointer;
  background-color: #4cb2f6;
  color: white;
  border-radius: 10px;
  width: 80px;
  height: 30px;
  text-align: center;
  margin-left: 10px;
  border: transparent;
  margin-right: 10px;
  @media ${(props) => props.theme.mobile} {
    width: 39px;
    height: 29px;
    margin-left: 0px;
  }
`;
const InputBtnImg = styled.img`
  width: 40px;
  height: 30px;
  text-align: center;
  border: transparent;
  width: 20px;
  height: 20px;
  margin-top: 4px;
`;
