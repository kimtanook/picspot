import Image from 'next/image';
import styled from 'styled-components';

const PostBox = ({
  editState,
  item,
  setEditImgUpload,
  onClickEditImgUpload,
  setEditTitle,
  onClickUpdateData,
  onClickDeleteData,
}: any) => {
  return (
    <StPostBox key={item.id}>
      <h3>{item.title}</h3>
      <input
        type="file"
        onChange={(event: any) => {
          setEditImgUpload(event.target.files[0]);
        }}
      />
      <button onClick={onClickEditImgUpload}>업로드</button>
      <input
        onChange={(e) => {
          setEditTitle(e.target.value);
        }}
      />
      <button onClick={() => onClickUpdateData({ id: item.id, ...editState })}>
        수정
      </button>
      <button onClick={() => onClickDeleteData(item.id)}>삭제</button>
      <Image src={item.url} alt="image" height={100} width={100} />
    </StPostBox>
  );
};

export default PostBox;

const StPostBox = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid black;
`;
