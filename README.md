# PicSpot 픽스팟 (픽쳐를 픽한 스팟)

> ### 🌼 소개
>
> ### PicSpot은 Picture / Pick + Spot의 약자로 사진과 장소를 고르는 것을 뜻합니다. 가고 싶은 여행지 혹은 여행 중에 사진 명소들을 일목요연하게 볼 수 있는 공유 플렛폼입니다. 지도를 통해 위치를 간편하게 찾을 수 있습니다.
>
> #### 🏠[HomePage](https://picspot.vercel.app/) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;🔗[Notion](https://www.notion.so/TEAM-2-_FAMILY-784e6ae20d7c499fa9df5620592f5d93)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📐[Figma](https://www.figma.com/file/9cv3rhM9sjGuRCgVGxOLPD/Project_%ED%94%BD%EC%8A%A4%ED%8C%9F?node-id=0%3A1&t=N5kTxggsQwbvT68F-0)

<br>

<center>
<p align='center'>
<img width='100%' src='https://user-images.githubusercontent.com/117061219/221060189-76c2b66b-0b75-4170-afc1-fb895d3bb42a.jpg'>
</p>

<div>
<img src='https://img.shields.io/badge/React-v18.2.0-blue?logo=React'/>
  <img src='https://img.shields.io/badge/Next.js-v13.1.6-000000?logo=Next.js'/>
  <img src='https://img.shields.io/badge/firebase-9.17.1-764ABC?logo=firebase'/>
  <img src='https://img.shields.io/badge/typescript-4.9.5-3178C6?logo=typescript'/>
  <img src='https://img.shields.io/badge/socket.io-4.6.0-010101?logo=socket.io'/>
  <img src='https://img.shields.io/badge/reactquery-3.39.3-FF4154?logo=reactquery'/>
    <img src="https://img.shields.io/badge/StyledComponents-5.3.6-DB7093??style=flat-square&logo=styled-components&logoColor=white" alt="styled-components badge" />
 </div>
</center>

---

## 🌼 개발 기간

- 2022.02.06. ~ 2023.03.13. (5 weeks)

<br>

## 🌼 팀원 구성 (총 6명)

- Front-end : 김인섭(Leader), 임재영(Vice Leader), 김도훈, 박유진, 이기동
- Designer : 김승연

<br>

## 🌼 프로젝트 기술 스택

- 프레임워크 / 언어
  - NextJS
  - TypeScript
- 라이브러리
  - react-kakao-maps-sdk
  - socket.io-client (socket.io를 사용하기 위한 클라이언트 라이브러리)
  - socket.io (socket.io를 사용하기 위한 서버 라이브러리)
  - styled-components
  - babel-plugin-styled-components
  - sweetalert2
  - firebase
  - uuid
  - react-bottom-scroll-listener

---

## 🌼 프로젝트 아키텍처

## <img width='100%' src='https://user-images.githubusercontent.com/117061219/220918966-d9956894-846d-4ccd-be43-3f1dc27808be.png'>

## 🌼 주요기능

1. 랜딩 : 가고 싶은 위치 선택

2. 메인 : 위치별로 사진으로 장소 추천

3. 검색 : 지역 검색 가능

4. 지도 : 추천 장소 리스트들을 지도에서 조회

5. 팔로잉 : 내가 누군가를 구독하는 것

---

## 🌼 주요 페이지

|     <h4>페이지</h4>      |                                                                   <h4>사진</h4>                                                                   |       <h4>페이지</h4>        |                                                                  <h4>사진</h4>                                                                   |
| :----------------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------: | :--------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------: |
|   <h4>랜딩 페이지</h4>   |                                                    <img width="277" alt="landingpage" src="">                                                     |     <h4>메인 페이지</h4>     |  <img width="277" alt="mainpage" src="https://user-images.githubusercontent.com/117061219/222664358-7b23e86e-f17b-4886-997c-139159a6251a.png">   |
|   <h4>검색 페이지</h4>   | <img width="277" alt="selectResult" src="https://user-images.githubusercontent.com/117061219/222664666-361feccb-9dff-4b84-a630-0ce2cd965a57.png"> | <h4>상세검색결과 페이지</h4> |                                                    <img width="277" alt="placeDetail" src="">                                                    |
|   <h4>상세 페이지</h4>   |  <img width="277" alt="detailPage" src="https://user-images.githubusercontent.com/117061219/222664790-8c0ce881-4bf4-45c8-baec-9d0e66f14b76.png">  |  <h4>상세 페이지 수정</h4>   | <img width="277" alt="placeDetail" src="https://user-images.githubusercontent.com/117061219/222664380-7d20dd5b-0516-405a-87df-82494f5d603a.png"> |
|   <h4>지도 페이지</h4>   |     <img width="277" alt="map" src="https://user-images.githubusercontent.com/117061219/222666805-59f9c77d-aa50-4002-92c8-1b6e220a4746.png">      |     <h4>마이 페이지</h4>     |   <img width="277" alt="mypage" src="https://user-images.githubusercontent.com/117061219/222666856-0b22f517-2101-461d-93d0-d59811551b0c.png">    |
|  <h4>팔로잉 페이지</h4>  |  <img width="277" alt="following" src="https://user-images.githubusercontent.com/117061219/222667195-7a150b6b-78a5-41cd-80ae-af5af992203b.png">   |        <h4>쪽지</h4>         | <img width="277" alt="sendmessage" src="https://user-images.githubusercontent.com/117061219/222665864-6c41140f-3372-4157-aa30-540a4d631aa0.png"> |
| <h4>정보수정 페이지</h4> |                                                     <img width="277" alt="mypageedit" src="">                                                     |    <h4>로그인 페이지</h4>    |  <img width="277" alt="loginpage" src="https://user-images.githubusercontent.com/117061219/222666871-c74a3218-c582-449b-b731-8e700b5816b9.png">  |
