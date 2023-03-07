import { updateData } from '@/api';
import { authService, storageService } from '@/firebase';
import { customAlert, customConfirm } from '@/utils/alerts';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { CustomModal } from '@/components/common/CustomModal';
import { useRecoilState } from 'recoil';
import { editAtom } from '@/atom';
import { logEvent } from '@/utils/amplitude';
import imageCompression from 'browser-image-compression';

const DetailImg = ({ item }: any) => {
  let editImg = { imgUrl: '' }; //* 이미지 수정 시 보내주는 데이터

  const [imageUpload, setImageUpload]: any = useState(null);

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
  const onChangeEditImgUrl = async (e: any) => {
    const options = {
      maxSizeMB: 1, //* 허용하는 최대 사이즈 지정
      maxWidthOrHeight: 500, //* 허용하는 최대 width, height 값 지정
      useWebWorker: true, //* webworker 사용 여부
    };

    const theFile = e.target.files[0];

    try {
      const compressedFile = await imageCompression(theFile, options);
      // console.log('compressedFile: ', compressedFile);

      const reader = new FileReader();
      // reader?.readAsDataURL(theFile);
      reader?.readAsDataURL(compressedFile);
      reader.onloadend = (finishedEvent) => {
        const {
          currentTarget: { result },
        }: any = finishedEvent;
        setImageUpload(result);
      };
    } catch (error) {
      console.log(error);
    }
  };

  //* useMutation 사용해서 데이터 수정하기
  const { mutate: onUpdateData } = useMutation(updateData);

  //* 게시물 사진 수정 버튼을 눌렀을때 실행하는 함수
  const onClickEdit = (data: any) => {
    if (imageUpload === null) {
      customAlert('이미지를 추가해주세요.');
    }

    // const imageRef = ref(storageService, `images/${uuidv4()}`);
    const imageRef = ref(storageService, `image/${uuidv4()}`);
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
              customConfirm('수정을 완료하였습니다!');
              setImageUpload(null);
              logEvent('게시물 사진 수정 버튼', { from: 'detail page' });
            },
          }
        );
      });
    });
    queryClient.invalidateQueries('detailData');
  };

  if (authService.currentUser?.uid !== item.creator) {
    return (
      <DetailImgContainer>
        <DetailImgBox>
          <Image
            src={item.imgUrl}
            alt="UploadImage"
            layout="fill"
            style={{ objectFit: 'contain' }}
            onClick={onClickToggleImgModal}
            priority={true}
          />
        </DetailImgBox>
        {isModalImgActive ? (
          <CustomModal
            modal={isModalImgActive}
            setModal={setIsModalImgActive}
            width="300"
            height="300"
            element={<DetailImg2 src={item.imgUrl} alt="image" />}
          />
        ) : (
          ''
        )}
      </DetailImgContainer>
    );
  } else {
    return (
      <DetailImgContainer>
        {imageUpload ? (
          <DetailImgBox>
            <Image
              src={imageUpload}
              alt="UploadImage"
              layout="fill"
              style={{ objectFit: 'contain' }}
              priority={true}
            />
          </DetailImgBox>
        ) : (
          <DetailImgBox>
            <Image
              src={item.imgUrl}
              alt="MyImage"
              layout="fill"
              style={{ objectFit: 'contain' }}
              priority={true}
            />
          </DetailImgBox>
        )}
        {imageUpload ? (
          <DetailBtn onClick={() => onClickEdit({ id: item.id, ...editImg })}>
            게시물 사진 수정 〉
          </DetailBtn>
        ) : (
          <DetailBtn>
            게시물 사진 변경 〉
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={onChangeEditImgUrl}
              src={imageUpload}
              ref={editFileInput}
              alt="image"
              id="file"
              style={{ height: '100%', width: '100%', display: 'none' }}
            />
          </DetailBtn>
        )}
      </DetailImgContainer>
    );
  }
};

export default DetailImg;

const DetailImgContainer = styled.div`
  background-color: #f1f1f1;
  height: 530px;
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media ${(props) => props.theme.mobile} {
    height: 350px;
  }
`;

const DetailImgBox = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  position: relative;
`;

const DetailImg2 = styled.img`
  width: 550px;
  cursor: pointer;
  @media ${(props) => props.theme.mobile} {
    width: 300px;
    height: 400px;
    object-fit: contain;
  }
`;

const DetailBtn = styled.label`
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
  @media ${(props) => props.theme.mobile} {
    top: 400px;
    bottom: 0px;
  }
`;
