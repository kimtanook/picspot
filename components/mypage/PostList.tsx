import PostBox from './PostBox';

const PostList = ({
  editState,
  data,
  setEditImgUpload,
  onClickEditImgUpload,
  setEditTitle,
  onClickUpdateData,
  onClickDeleteData,
}: any) => {
  return (
    <>
      {data.map((item: any) => (
        <PostBox
          key={item.id}
          editState={editState}
          item={item}
          setEditImgUpload={setEditImgUpload}
          onClickEditImgUpload={onClickEditImgUpload}
          setEditTitle={setEditTitle}
          onClickUpdateData={onClickUpdateData}
          onClickDeleteData={onClickDeleteData}
        />
      ))}
    </>
  );
};

export default PostList;
