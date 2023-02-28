import { updateData } from '@/api';
import { authService, storageService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { CustomModal } from '@/components/common/CustomModal';
const DetailImg = ({ item, imageUpload, setImageUpload, editImg }: any) => {
  const [isModalImgActive, setIsModalImgActive]: any = useState(false);
  const queryClient = useQueryClient(); // *쿼리 최신화하기
  const editFileInput: any = useRef(); //* Input Dom 접근하기

  useEffect(() => {
    const html = document.documentElement;
    if (isModalImgActive) {
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
  }, [isModalImgActive]);

  const onClickToggleImgModal = () => {
    setIsModalImgActive(true);
  };

  //* 파일 선택 버튼을 눌렀을때 실행하는 함수
  const onChangeEditImgUrl = (e: any) => {
    const theFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const { result }: any = finishedEvent.currentTarget;
      setImageUpload(result);
    };
  };

  //* useMutation 사용해서 데이터 수정하기
  const { mutate: onUpdateData } = useMutation(updateData);

  //* 게시물 사진 수정 버튼을 눌렀을때 실행하는 함수
  const onClickEdit = (data: any) => {
    if (imageUpload === null) {
      customAlert('이미지를 추가해주세요.');
    }

    const imageRef = ref(storageService, `images/${uuidv4()}`);
    uploadString(imageRef, imageUpload, 'data_url').then((response) => {
      getDownloadURL(response.ref).then((url) => {
        const response = url;
        editImg = {
          ...editImg,
          imgUrl: response,
        };

        onUpdateData(
          { ...data, imgUrl: response },
          {
            onSuccess: () => {
              setTimeout(
                () => queryClient.invalidateQueries('detailData'),
                500
              );
              customAlert('수정을 완료하였습니다!');
              setImageUpload(null);
            },
          }
        );
      });
    });
    queryClient.invalidateQueries('detailData');
  };

  if (authService.currentUser?.uid !== item.creator) {
    return (
      <StDetailImgContainer>
        <StDetailImg
          src={item.imgUrl}
          alt="image"
          onClick={onClickToggleImgModal}
        />
        {isModalImgActive ? (
          <CustomModal
            modal={isModalImgActive}
            setModal={setIsModalImgActive}
            width="300"
            height="300"
            element={<StDetailImg2 src={item.imgUrl} alt="image" />}
          />
        ) : (
          ''
        )}
      </StDetailImgContainer>
    );
  } else {
    return (
      <StDetailImgContainer>
        {imageUpload ? (
          <StDetailImg src={imageUpload} />
        ) : (
          <StDetailImg src={item.imgUrl} alt="image" />
        )}
        {imageUpload ? (
          <StDetailBtn onClick={() => onClickEdit({ id: item.id, ...editImg })}>
            게시물 사진 수정 〉
          </StDetailBtn>
        ) : (
          <StDetailBtn>
            게시물 사진 변경 〉
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={onChangeEditImgUrl}
              src={imageUpload}
              ref={editFileInput}
              alt="image"
              id="file"
              style={{ height: '100%', width: '100%', display: 'none' }}
            />
          </StDetailBtn>
        )}
      </StDetailImgContainer>
    );
  }
};

export default DetailImg;

const StDetailImgContainer = styled.div`
  background-color: #f1f1f1;
  height: 500px;
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StDetailImg = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: contain;
`;
const StDetailImg2 = styled.img`
  width: 550px;
  /* height: 600px; */
  cursor: pointer;
`;

const StDetailBtn = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: #feb819;
  color: white;
  cursor: pointer;
  width: 150px;
  height: 40px;
  bottom: 120px;
  font-size: 13px;
`;
