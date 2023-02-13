import { storageService } from '@/firebase';
import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useMutation } from 'react-query';
import { addData } from '@/api';

//! postState 타입 해결
//! imageUpload 타입 해결
const PostForm = () => {
  const [title, setTitle] = useState('');
  const [imgUpload, setImgUpload]: any = useState(null);

  let postState: any = {
    title: title,
    url: '',
  };

  //* useMutation 사용해서 데이터 추가하기
  const { mutate: onAddData } = useMutation(addData);

  //* 추가버튼 눌렀을때 실행하는 함수
  const onClickAddData = async () => {
    console.log('추가버튼을 클릭했습니다.');
    //? 이미지 인풋값이 빈값이면 함수 종료하기
    if (imgUpload === null) {
      alert('이미지를 추가해주세요.');
      return;
    }

    //? 이미지를 스토리지에 저장하고 url 받아오기
    const imageRef = ref(storageService, `images/${imgUpload.name}`);
    let response: string;
    uploadBytes(imageRef, imgUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        console.log('사진이 업로드 되었습니다.');
        console.log('url: ', url);
        //? 동기적으로 데이터 변경하기
        response = url;
        postState = { ...postState, url: response };

        //? 데이터 추가하는 트리거 실행하기
        onAddData(postState, {
          onSuccess: () => {
            console.log('추가 요청 성공');
          },
          onError: () => {
            console.log('추가 요청 실패');
          },
        });
      });
    });
  };

  return (
    <>
      <input
        type="file"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (event.target.files !== null) {
            setImgUpload(event.target.files[0]);
          }
        }}
      />
      <input
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <button onClick={onClickAddData}>추가</button>
    </>
  );
};

export default PostForm;
