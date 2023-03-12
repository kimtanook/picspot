import { updateData } from '@/api';
import { authService, storageService } from '@/firebase';
import { customAlert } from '@/utils/alerts';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import styled from 'styled-components';
import { CustomModal } from '@/components/common/CustomModal';
import { logEvent } from '@/utils/amplitude';
import imageCompression from 'browser-image-compression';
import Swal from 'sweetalert2';
import { useRecoilState } from 'recoil';
import { editBtnToggleAtom, imageUploadAtom } from '@/atom';

type ItemProps = {
  item: ItemType;
};

const DetailImg = ({ item }: ItemProps) => {
  //! global state
  const [editBtnToggle, setEditBtnToggle] = useRecoilState(editBtnToggleAtom);
  const [imageUpload, setImageUpload] = useRecoilState(imageUploadAtom);

  const [isModalImgActive, setIsModalImgActive] = useState(false);

  const editFileInput = useRef<HTMLInputElement>(null); //* Input Dom 접근하기

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
  const onChangeEditImgUrl = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const options = {
      maxSizeMB: 1, //* 허용하는 최대 사이즈 지정
      maxWidthOrHeight: 500, //* 허용하는 최대 width, height 값 지정
      useWebWorker: true, //* webworker 사용 여부
    };

    if (e.target.files !== null) {
      const theFile = e.target.files[0];

      try {
        const compressedFile = await imageCompression(theFile, options);

        const reader = new FileReader();
        reader?.readAsDataURL(compressedFile);
        reader.onloadend = (finishedEvent) => {
          const result = reader.result;
          setImageUpload(result as string);
        };
      } catch (error) {
        console.log(error);
      }
    }
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
        {editBtnToggle ? (
          <DetailBtn>
            게시물 사진 변경 〉
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={onChangeEditImgUrl}
              src={imageUpload !== null ? imageUpload : undefined}
              ref={editFileInput}
              alt="image"
              id="file"
              style={{ height: '100%', width: '100%', display: 'none' }}
            />
          </DetailBtn>
        ) : null}
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
