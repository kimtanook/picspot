import styled from 'styled-components';
import { useRouter } from 'next/router';
import { deletePostModalAtom, deleteItem } from '@/atom';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { storageService } from '@/firebase';
import { deleteObject, ref } from 'firebase/storage';
import { useMutation } from 'react-query';
import { deleteData, visibleReset } from '@/api';
import Swal from 'sweetalert2';
// type Post = {
//   id: string|undefined;
//   imgPath: string|undefined;
// };
const CompletePostModal = ({
  item,
  setDeleteModal,
  deleteModal,
}: any): JSX.Element => {
  // const [deleteModal, setDeleteModal] = useRecoilState(deleteModalAtom);
  const router = useRouter();

  // 모달 창 뒤에 누르면 닫힘
  useEffect(() => {
    const html = document.documentElement;
    if (deleteModal) {
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
  }, [deleteModal]);

  //* useMutation 사용해서 데이터 삭제하기
  const { mutate: onDeleteData } = useMutation(deleteData);
  const [delteItemData] = useRecoilState<any>(deleteItem);
  console.log(delteItemData);
  const onClickDelete = async () => {
    // event.stopPropagation();
    // DeletePost(item);
    // deleteModal(fa
    // lse);
    const imageRef = ref(storageService, `images/${delteItemData?.imgPath}`);
    // console.log(delteItemData?.imgPath);
    // console.log(delteItemData);
    const docId: any = delteItemData?.id;
    // await deleteObject(imageRef)
    //   .then(() => {
    //     Swal.fire({
    //       title: '게시물을 삭제했습니다',
    //     });
    //     console.log('스토리지를 파일을 삭제를 성공했습니다');
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     console.log('스토리지 파일 삭제를 실패했습니다');
    //   });
    onDeleteData(docId, {
      onSuccess: () => {
        setDeleteModal(!deleteModal);
        router.push('/main?city=제주전체');
      },
      onError(error, variables, context) {
        console.log(error);
      },
    });
    visibleReset();
  };

  return (
    <ModalStyled
      // 배경화면 누르면 취소
      onClick={() => {
        setDeleteModal(!deleteModal);
      }}
    >
      <div className="modalBody" onClick={(e) => e.stopPropagation()}>
        <DeleteContainer>
          <Text>게시물을 정말 삭제하시겠습니까?</Text>
          <DeleteCancleButton
            onClick={() => {
              setDeleteModal(!deleteModal);
            }}
          >
            취소
          </DeleteCancleButton>
          <PostDeleteButton onClick={() => onClickDelete()}>
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
    @media ${(props) => props.theme.mobile} {
      width: 100%;
      height: 30000px;
    }
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
  }
`;
export default CompletePostModal;
