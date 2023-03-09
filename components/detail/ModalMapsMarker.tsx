import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CustomOverlayMap } from 'react-kakao-maps-sdk';
import styled from 'styled-components';
import MapPanTo from './MapPanTo';

const ModalMapsMarker = ({
  item,
  isOpen,
  setIsOpen,
}: IModalMapsMarkerProps) => {
  return (
    <div>
      <MapPanTo item={item} setIsOpen={setIsOpen} />
      {isOpen && isOpen.id === item.id && (
        <CustomOverlayMap
          position={{
            lat: item.lat,
            lng: item.long,
          }}
        >
          <OverLayClose
            className="close"
            onClick={() => setIsOpen(false)}
            title="닫기"
          >
            <SearchImageCloseIcon src="/close_icon.svg" />
          </OverLayClose>
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
                    <SearchImageRightIcon src="/seeDetailsicon.svg" />
                  </OveLayHoverIcon>
                  <OverLayHoverText>글 보러가기</OverLayHoverText>
                </OverLayHoverWrap>
              </OverLayImg>
            </Link>
            <OverLayContetnsWrap>
              <OverLayAddress>
                <SearchImagePlaceIcon src="/spot_icon.svg" />{' '}
                {item.address.slice(7, 20)}
              </OverLayAddress>
              <OverLayCounter>
                <SearchImageViewIcon src="/view_icon.svg" /> {item.clickCounter}{' '}
                view
              </OverLayCounter>
            </OverLayContetnsWrap>
          </OverLayWrap>
        </CustomOverlayMap>
      )}
    </div>
  );
};

const OverLayWrap = styled.div`
  width: 185px;
  margin-top: -160%;
  background-color: white;
  box-shadow: 2.5px 5px 5px gray;
  border-radius: 3px;
  overflow: hidden;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
`;

const OverLayTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding: 13px;
  /* white-space: normal; */
`;

const OverLayImg = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin: auto;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
`;

const OverLayImgSrc = styled(Image)`
  width: 100%;
  cursor: pointer;
`;

const OverLayClose = styled.div`
  position: absolute;
  top: -340px;
  right: 43%;

  :hover {
    cursor: pointer;
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
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 0.35s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
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
  width: 100%;
  margin: 10px 0;
  box-sizing: border-box;
`;

const OverLayAddress = styled.div`
  color: gray;
  font-size: 15px;
`;

const OverLayCounter = styled.div`
  font-size: 15px;
  color: cornflowerblue;
`;

const SearchImageRightIcon = styled.img`
  width: 30px;
  height: 30px;
  margin-right: 10px;
  margin-left: 5px;
  font-size: 20px;
`;
const SearchImagePlaceIcon = styled.img`
  width: 20px;
  height: 15px;
`;
const SearchImageViewIcon = styled.img`
  width: 20px;
  height: 12px;
`;

const SearchImageCloseIcon = styled.img`
  width: 25px;
  height: 35px;
`;

export default ModalMapsMarker;
