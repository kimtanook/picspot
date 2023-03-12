import Header from '@/components/Header';
import { getData, postCounter } from '@/api';
import Seo from '@/components/Seo';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import styled from 'styled-components';
import CommentList from '@/components/detail/detailRight/CommentList';
import FollowingButton from '@/components/detail/detailLeft/FollowingButton';
import DetailMap from '@/components/detail/detailRight/DetailMap';
import CollectionButton from '@/components/detail/detailLeft/CollectionButton';
import DetailImg from '@/components/detail/detailLeft/DetailImg';
import DetailProfile from '@/components/detail/detailLeft/DetailProfile';
import DetailList from '@/components/detail/detailRight/DetailList';
import DataError from '@/components/common/DataError';
import DataLoading from '@/components/common/DataLoading';
import { logEvent } from '@/utils/amplitude';
import { authService } from '@/firebase';
import { useRecoilState } from 'recoil';
import { deleteItem, editBtnToggleAtom } from '@/atom';

const Post = ({ id }: ParamsType) => {
  //* useQuery 사용해서 포스트 데이터 불러오기
  const {
    data: detail,
    isLoading,
    isError,
  } = useQuery('detailData', getData, {
    staleTime: 60 * 1000, // 1분, default >> 0
    cacheTime: 60 * 5 * 1000, // 5분, default >> 5분
  });
  const [, setDeleteItem] = useRecoilState(deleteItem);

  // 게시물 삭제하기 Recoil
  const mydata = detail?.filter((item: ItemType) => {
    return item.id === id;
  });

  const [editBtnToggle, setEditBtnToggle] = useRecoilState(editBtnToggleAtom);

  //* Amplitude 이벤트 생성
  useEffect(() => {
    mydata && setDeleteItem(mydata[0]);
  }, []);

  const queryClient = useQueryClient();

  //* mutation 사용해서 counting값 보내기
  const { mutate: countMutate } = useMutation(postCounter, {
    onSuccess: () => {
      queryClient.invalidateQueries('detailData');
    },
  });

  //* 변화된 counting 값 인지
  const creator = mydata?.find((item: ItemType) => item.id === id);

  useEffect(() => {
    if (creator?.creator !== authService.currentUser?.uid) {
      countMutate(id);
    }
    logEvent('디테일 페이지', { from: 'detail page' });
  }, []);

  if (isLoading) return <DataLoading />;
  if (isError) return <DataError />;

  return (
    <DetailContainer>
      <Seo title="Detail" />
      <Header
        selectCity={undefined}
        onChangeSelectCity={undefined}
        searchOptionRef={undefined}
        searchValue={undefined}
        onChangeSearchValue={undefined}
      />

      {detail
        ?.filter((item: ItemType) => {
          return item.id === id;
        })
        .map((item: ItemType) => (
          <DetailContents key={item.id}>
            {editBtnToggle && (
              <EditImgAndProfileAndFollowingAndCollection>
                <DetailImg item={item} />

                <ProfileAndFollowingAndCollection>
                  <ProfileAndFollwing>
                    <DetailProfile item={item} />
                  </ProfileAndFollwing>

                  <FollowingButton item={item} />
                  <CollectionButton item={item} />
                </ProfileAndFollowingAndCollection>
              </EditImgAndProfileAndFollowingAndCollection>
            )}
            {!editBtnToggle && (
              <ImgAndProfileAndFollowingAndCollection>
                <DetailImg item={item} />

                <ProfileAndFollowingAndCollection>
                  <ProfileAndFollwing>
                    <DetailProfile item={item} />
                  </ProfileAndFollwing>

                  <FollowingButton item={item} />
                  <CollectionButton item={item} />
                </ProfileAndFollowingAndCollection>
              </ImgAndProfileAndFollowingAndCollection>
            )}

            <ListAndMapAndComment>
              <DetailList item={item} />

              <DetailMap item={item} />
              <CommentList postId={id} />
            </ListAndMapAndComment>
          </DetailContents>
        ))}
    </DetailContainer>
  );
};

export default Post;

const DetailContainer = styled.div`
  position: relative;
  @media ${(props) => props.theme.mobile} {
    width: 100%;
  }
`;

const DetailContents = styled.div`
  top: 50px;
  margin-top: 50px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 600px;
  @media ${(props) => props.theme.mobile} {
    flex-direction: column;
    width: 100%;
    height: auto;
    margin-top: 40px;
  }
`;

const EditImgAndProfileAndFollowingAndCollection = styled.div`
  width: 400px;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
    margin-top: 30px;
  }
`;

const ImgAndProfileAndFollowingAndCollection = styled.div`
  width: 400px;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 400px;
  }
`;

const ProfileAndFollowingAndCollection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 350px;
  padding-top: 20px;
  @media ${(props) => props.theme.mobile} {
    height: 50px;
    padding-top: 0px;
    margin-top: 10px;
  }
`;

const ProfileAndFollwing = styled.div`
  display: flex;
`;

const ListAndMapAndComment = styled.div`
  width: 650px;
  @media ${(props) => props.theme.mobile} {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 20px;
  }
`;

//* SSR방식으로 server에서 id 값 보내기
export async function getServerSideProps(context: { params: ParamsType }) {
  const { params } = context;
  const { id }: ParamsType = params;
  return {
    props: {
      id: id,
    },
  };
}
