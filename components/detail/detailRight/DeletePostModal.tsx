import styled from 'styled-components';
import { useRouter } from 'next/router';
import { deletePostModalAtom, deleteAtom } from '@/atom';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { storageService } from '@/firebase';
import { useMutation, useQueryClient } from 'react-query';
import { deleteData, visibleReset } from '@/api';
import { deleteObject, ref } from 'firebase/storage';

const DeletePostModal = () => {
  const queryClient = useQueryClient(); // * 쿼리 최신화하기

  const [deletePostData, setDeletePostData] = useRecoilState(deleteAtom);
  const [deletePostModal, setDeletePostModal] =
    useRecoilState(deletePostModalAtom);
  const router = useRouter();

  // 모달 창 뒤에 누르면 닫힘
  useEffect(() => {
    const html = document.documentElement;
    if (deletePostModal) {
      html.style.overflowY = 'hidden';
      html.style.overflowX = 'hidden';
    } else {
      html.style.overflowY = 'auto';
      html.style.overflowX = 'auto';
    }
    return () => {
      html.style.overflowY = 'auto';
      html.style.overflowX = 'auto';
    };
  }, [deletePostModal]);

  //* useMutation 사용해서 데이터 삭제하기
  const { mutate: onDeleteData } = useMutation(deleteData);

  const onClickDelete = async (data: any) => {
    console.log('data: ', data);
    const imageRef = ref(storageService, `images/${data?.imgPath}`);
    const docId: any = data?.id;

    onDeleteData(docId, {
      onSuccess: () => {
        deleteObject(imageRef);
        setDeletePostModal(!deletePostModal);
        router.push('/main?city=제주전체');
        queryClient.invalidateQueries('infiniteData');
      },
      onError(error) {
        console.log(error);
      },
    });
    visibleReset();
  };

  return (
    <ModalStyled
      // 배경화면 누르면 취소
      onClick={() => {
        setDeletePostModal(!deletePostModal);
      }}
    >
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        <DeleteContainer>
          <Text>게시물을 정말 삭제하시겠습니까?</Text>
          <DeleteCancleButton
            onClick={() => {
              setDeletePostModal(!deletePostModal);
            }}
          >
            취소
          </DeleteCancleButton>
          <PostDeleteButton onClick={() => onClickDelete(deletePostData)}>
            게시물 삭제하기
          </PostDeleteButton>
        </DeleteContainer>
      </div>
    </ModalStyled>
  );
};
const ModalStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: gray;
  display: flex;
  z-index: 1000000;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  @media ${(props) => props.theme.mobile} {
    background-color: white;
  }
  .modalBody {
    position: relative;
    color: black;
    padding: 30px 30px 30px 30px;
    z-index: 13;
    text-align: left;
    background-color: rgb(255, 255, 255);
    box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
    overflow-y: auto;
  }
`;
const DeleteContainer = styled.div``;

const Text = styled.div`
  display: 1px solid;
  font-size: 24px;
  font-weight: bold;
  font-family: Noto Sans CJK KR;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 90px;
  @media ${(props) => props.theme.mobile} {
    margin-top: 20px;
  }
`;

const DeleteCancleButton = styled.button`
  display: 1px solid blue;
  font-size: 14px;
  font-weight: bold;
  font-family: Noto Sans CJK KR;
  width: 395px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: transparent;
  margin-top: 100px;
  transition: 0.1s;
  background-color: #1882ff;
  color: white;
  font-size: 15px;
  &:hover {
    cursor: pointer;
  }
  @media ${(props) => props.theme.mobile} {
    width: 300px;
  }
`;
const PostDeleteButton = styled.button`
  display: 1px solidpink;
  font-size: 14px;
  font-weight: bold;
  font-family: Noto Sans CJK KR;
  width: 395px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 40px;
  border: transparent;
  transition: 0.1s;
  background-color: #5b5b5f;
  color: white;
  &:hover {
    cursor: pointer;
  }
  @media ${(props) => props.theme.mobile} {
    width: 300px;
  }
`;
export default DeletePostModal;
