import Image from 'next/image';
import styled from 'styled-components';

const DetailList = ({ item }: any) => {
  console.log(item.id);

  return (
    <StListContainer>
      <StTitleAndView>
        <StTitle>{item.title} </StTitle>
        <StView>
          <Image
            src="/view_icon.svg"
            alt="image"
            width={20}
            height={20}
            style={{ marginRight: 5 }}
          />
          <span style={{ color: '#1882FF' }}>{item.clickCounter} view</span>
        </StView>
      </StTitleAndView>
      <StCityAndTownAndAddress>
        <StCity>{item.city}</StCity>
        <StTown>{item.town}</StTown>
        <StAddress>
          <Image src="/spot_icon.svg" alt="image" width={15} height={15} />{' '}
          <span>{item.address}</span>
          <span
            style={{
              marginLeft: 10,
              textDecoration: 'underLine',
              color: '#8E8E93',
              cursor: 'pointer',
            }}
          >
            copy
          </span>
        </StAddress>
      </StCityAndTownAndAddress>
      <StContent>Tip | {item.content}</StContent>
    </StListContainer>
  );
};

export default DetailList;

const StListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StTitleAndView = styled.div`
  display: flex;
  flex-direction: row;
`;

const StTitle = styled.div`
  font-size: 30px;
  margin-right: 20px;
`;

const StView = styled.div`
  display: flex;
  align-items: center;
`;

const StCityAndTownAndAddress = styled.div`
  display: flex;
  gap: 20px;
`;

const StCity = styled.div`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 80px;
  text-align: center;
  padding-top: 4px;
`;

const StTown = styled.div`
  background-color: #e7e7e7;
  border-radius: 20px;
  width: 80px;
  text-align: center;
  padding-top: 4px;
`;

const StAddress = styled.div``;

const StContent = styled.div`
  background-color: #f8f8f8;
  width: 96%;
  min-height: 30px;
  padding-top: 12px;
  padding-left: 20px;
  color: #8e8e93;
  margin-bottom: 20px;
`;
