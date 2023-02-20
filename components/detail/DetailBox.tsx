import { deleteData, updataData } from '@/api';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import Dropdown from '../main/Dropdown';
import { useRouter } from 'next/router';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { storageService } from '@/firebase';
import styled from 'styled-components';
import { customAlert } from '@/utils/alerts';

const DetailBox = ({ item }: any) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const editFileInput: any = useRef();

  const [inputToggle, setInputToggle] = useState(false);
  const [dropdownToggle, setDropdownToggle] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editTown, setEditTown] = useState('');
  const [imageUpload, setImageUpload]: any = useState(null);

  let editState = {
    title: editTitle,
    content: editContent,
    city: editCity,
    town: editTown,
    imgUrl: '',
  };

  //* useMutation 사용해서 데이터 삭제하기
  const { mutate: onDeleteData } = useMutation(deleteData);

  //* 삭제 버튼을 눌렀을때 실행하는 함수
  const onClickDelete = (docId: any) => {
    console.log('삭제 버튼을 눌렀습니다.');
    onDeleteData(docId, {
      onSuccess: () => {
        console.log('삭제 요청 성공');
        customAlert('삭제를 완료하였습니다!');
        queryClient.invalidateQueries('infiniteData');
        router.push('/main?city=제주전체');
      },
      onError: () => {
        console.log('삭제 요청 실패');
      },
    });
  };

  //* 수정, 수정취소 버튼을 눌렀을때 실행하는 함수
  const onClickChangeInput = () => {
    console.log('수정 또는 수정취소 버튼을 눌렀습니다.');
    setInputToggle(!inputToggle);
  };

  //* 파일 선택 버튼을 눌렀을때 실행하는 함수
  const onChangeEditImgUrl = (e: any) => {
    console.log('파일 선택을 선택했습니다.');
    const theFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(theFile);
    reader.onloadend = (finishedEvent) => {
      const { result }: any = finishedEvent.currentTarget;
      setImageUpload(result);
    };
  };

  //* useMutation 사용해서 데이터 수정하기
  const { mutate: onUpdataData } = useMutation(updataData);

  //* 수정완료 버튼을 눌렀을때 실행하는 함수
  const onClickEdit = (data: any) => {
    console.log('수정완료 버튼을 눌렀습니다.');

    if (imageUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }

    if (editTitle === '') {
      alert('제목을 입력해주세요');
      return;
    }

    if (editContent === '') {
      alert('내용을 입력해주세요');
      return;
    }

    if (editCity === '' || editTown === '') {
      alert('카테고리를 입력해주세요');
      return;
    }

    const imageRef = ref(storageService, `images/${imageUpload.name}`);
    uploadString(imageRef, imageUpload, 'data_url').then((response) => {
      getDownloadURL(response.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        const response = url;
        editState = {
          ...editState,
          imgUrl: response,
        };

        onUpdataData(
          { ...data, imgUrl: response },
          {
            onSuccess: () => {
              console.log('수정 요청 성공');
              customAlert('수정을 완료하였습니다!');
              queryClient.invalidateQueries('detailData');
              setImageUpload(null);
              setEditTitle('');
              setEditContent('');
              setEditCity('');
              setEditTown('');
            },
            onError: () => {
              console.log('수정 요청 실패');
            },
          }
        );
      });
    });
    setInputToggle(!inputToggle);
  };

  //* town state 변경
  const onClickEditTown = (e: any) => {
    setEditTown(e.target.innerText);
  };

  if (inputToggle) {
    return (
      <>
        <h3>이미지를 수정해주세요</h3>
        <div style={{ display: 'flex', width: 'auto', flexDirection: 'row' }}>
          <StImg>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={onChangeEditImgUrl}
              src={imageUpload}
              ref={editFileInput}
              alt="image"
              id="file"
              style={{
                height: '100%',
                width: '100%',
                display: 'none',
              }}
            />
            {imageUpload && <SpotImg src={imageUpload} />}
          </StImg>
        </div>

        <div>
          <h3>제목을 수정해주세요</h3>
          <input
            type="text"
            onChange={(e) => {
              setEditTitle(e.target.value);
            }}
          />
        </div>

        <div>
          <h3>내용을 수정해주세요</h3>
          <input
            type="text"
            onChange={(e) => {
              setEditContent(e.target.value);
            }}
          />
        </div>

        <h3>여행갈 지역을 골라주세요</h3>
        <button onClick={(e) => setDropdownToggle(!dropdownToggle)}>
          {dropdownToggle ? '닫기' : '열기'}
        </button>
        <Dropdown visibility={dropdownToggle}>
          <ul>
            <li style={{ listStyle: 'none' }}>
              <input
                type="radio"
                id="제주도"
                name="제주도"
                value="제주도"
                checked={editCity === '제주도' ? true : false}
                onChange={(e) => setEditCity(e.target.value)}
              />
              제주도
            </li>
            <li style={{ listStyle: 'none' }}>
              <input
                type="radio"
                id="제주시"
                name="제주시"
                value="제주시"
                checked={editCity === '제주시' ? true : false}
                onChange={(e) => setEditCity(e.target.value)}
              />
              제주시
            </li>
            <li style={{ listStyle: 'none' }}>
              <input
                type="radio"
                id="서귀포시"
                name="서귀포시"
                value="서귀포시"
                checked={editCity === '서귀포시' ? true : false}
                onChange={(e) => setEditCity(e.target.value)}
              />
              서귀포시
            </li>
          </ul>
        </Dropdown>

        <div>
          <h3>카테고리를 골라주세요</h3>
          <button onClick={onClickEditTown}>조천읍</button>
          <button onClick={onClickEditTown}>제주시</button>
          <button onClick={onClickEditTown}>성산읍</button>
          <button onClick={onClickEditTown}>표선면</button>
          <button onClick={onClickEditTown}>남원읍</button>
          <button onClick={onClickEditTown}>서귀포</button>
          <button onClick={onClickEditTown}>중문</button>
          <button onClick={onClickEditTown}>안덕면</button>
          <button onClick={onClickEditTown}>대정읍</button>
          <button onClick={onClickEditTown}>애월읍</button>
          <button onClick={onClickEditTown}>우도</button>
          <button onClick={onClickEditTown}>마라도</button>
        </div>

        <div>
          <button onClick={() => onClickEdit({ id: item.id, ...editState })}>
            수정 완료
          </button>
          <button onClick={onClickChangeInput}>수정 취소</button>
        </div>
      </>
    );
  }
  return (
    <>
      <Image src={item.imgUrl} alt="image" height={100} width={100} />
      <h1>{item.title}</h1>
      <h3>{item.content}</h3>
      <h3>{item.city}</h3>
      <h3>{item.town}</h3>
      <h3>{item.clickCounter}</h3>
      <div>
        <button onClick={onClickChangeInput}>수정</button>
      </div>
      <div>
        <button onClick={() => onClickDelete(item.id)}>삭제</button>
      </div>
    </>
  );
};

export default DetailBox;

const StImg = styled.label`
  height: 100px;
  width: 100px;
  background-image: url(/plusimage.png);
  background-position: center;
  cursor: pointer;
  margin: 10px;
`;

const SpotImg = styled.img`
  height: 100%;
  width: 100%;
  align-items: center;
`;
