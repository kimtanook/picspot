import Link from 'next/link';
import styled from 'styled-components';

const Header = () => {
  return (
    <Nav>
      <Link href={'/main'}>
        <Title
          onClick={() => {
            // sessionStorage.clear();
            localStorage.clear();
          }}
        >
          Picspot
        </Title>
      </Link>
    </Nav>
  );
};
export default Header;

const Nav = styled.div`
  height: 70px;
`;

const Title = styled.h1`
  color: black;
  :hover {
    text-decoration-line: none;
    color: black;
  }
  box-shadow: inset 0 -3px 0 0 red;
  box-shadow: none;
  font-size: 40px;
  font-weight: 900;
  margin-left: 30px;
  cursor: pointer;
`;
