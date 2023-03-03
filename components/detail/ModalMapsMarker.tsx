import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import MapPanTo from './MapPanTo';

const ModalMapsMarker = ({ item, isOpen, setIsOpen }: any) => {
  return (
    <div>
      <MapPanTo item={item} setIsOpen={setIsOpen} />
      {isOpen && isOpen.id === item.id && (
        <CustomOverlayMap
          position={{
            // 지도의 중심좌표
            lat: item.lat,
            lng: item.long,
          }}
        >
          <OverLayClose
            className="close"
            onClick={() => setIsOpen(false)}
            title="닫기"
          ></OverLayClose>
          <OverLayWrap>
            <OverLayTitle>{item.title}</OverLayTitle>
            <Link href={`/detail/${item.id}`} rel="noreferrer">
              <OverLayImg>
                <OverLayImgSrc
                  src={item.imgUrl}
                  alt="image"
                  height={150}
                  width={150}
                />
                <OverLayHoverWrap>
                  <OveLayHoverIcon>
                    <SearchImage src="/seeDetailsicon.svg" />
                  </OveLayHoverIcon>
                  <OverLayHoverText>글 보러가기</OverLayHoverText>
                </OverLayHoverWrap>
              </OverLayImg>
            </Link>
            <OverLayContetnsWrap>
              <OverLayAddress>
                <SearchImage1 src="/spot_icon.svg" />{' '}
                {item.address.slice(7, 20)}
              </OverLayAddress>
              <OverLayCounter>
                <SearchImage2 src="/view_icon.svg" /> {item.clickCounter} view
              </OverLayCounter>
            </OverLayContetnsWrap>
          </OverLayWrap>
        </CustomOverlayMap>
      )}
    </div>
  );
};

const OverLayWrap = styled.div`
  width: 172px;
  height: 256px;
  margin-top: -300px;
  background-color: white;
  box-shadow: 2.5px 5px 5px gray;
  border-radius: 3px;
  overflow: hidden;
  /* position: relative; */
`;

const OverLayTitle = styled.div`
  padding: 15px 0 0 10px;
  height: 30px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

const OverLayImg = styled.div`
  position: relative;
  width: 100%;
  height: 150px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
`;

const OverLayImgSrc = styled(Image)`
  width: 100%;
  cursor: pointer;
`;

const OverLayClose = styled.div`
  position: absolute;
  top: -330px;
  right: 45%;
  border-radius: 25px;
  width: 17px;
  height: 17px;

  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');
  :hover {
    cursor: pointer;
    width: 17px;
    height: 17px;
    border-radius: 25px;
  }
`;

const OverLayHoverWrap = styled.div`
  color: #fff;
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 150px;
  padding: 20px;

  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.35s ease-in-out;

  :hover {
    opacity: 1;
  }
`;

const OveLayHoverIcon = styled.h3`
  font-size: 16px;
  padding-bottom: 0.4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
  text-align: center;
`;

const OverLayHoverText = styled.h2`
  font-size: 16px;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-transform: uppercase;
`;

const OverLayContetnsWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 15px;
  margin-left: 5px;
`;

const OverLayAddress = styled.div`
  color: gray;
  font-size: 15px;
`;

const OverLayCounter = styled.div`
  font-size: 16px;
  color: cornflowerblue;
  font-weight: 600;
  text-align: left;
`;

const SearchImage = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  margin-left: 5px;
  font-size: 20px;
`;
const SearchImage1 = styled.img`
  width: 20px;
  height: 15px;
`;
const SearchImage2 = styled.img`
  width: 20px;
  height: 12px;
`;

export default ModalMapsMarker;
