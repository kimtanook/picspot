import Link from 'next/link';
import styled from 'styled-components';

const Header = () => {
  return (
    <Nav>
      <Link href="/" style={{ color: 'black', textDecorationLine: 'none' }}>
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
  position: fixed;
  top: 0;
  /* width: 100%; */
  left: 0;
  right: 0;
  height: 70px;
`;
const Title = styled.h1`
  box-shadow: inset 0 -3px 0 0 red;
  box-shadow: none;
  font-size: 40px;
  font-weight: 900;
  margin-left: 30px;
  cursor: pointer;
`;
