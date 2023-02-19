import PostBox from './PostBox';

const PostList = ({
  editState,
  data,
  setEditImgUpload,
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
          setEditTitle={setEditTitle}
          onClickUpdateData={onClickUpdateData}
          onClickDeleteData={onClickDeleteData}
        />
      ))}
    </>
  );
};

export default PostList;
