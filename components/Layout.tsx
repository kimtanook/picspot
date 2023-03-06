import styled from 'styled-components';
import {
  messageBoxToggle,
  messageSendToggle,
  followingToggleAtom,
  followToggleAtom,
  signUpModalAtom,
  forgotModalAtom,
  loginModalAtom,
  postModalAtom,
  editProfileModalAtom,
  mobileProfileModalAtom,
} from '@/atom';
import React from 'react';
import { useRecoilState } from 'recoil';
import { CustomModal } from './common/CustomModal';
import AuthForgot from './main/auth/AuthForgot';
import AuthSignUp from './main/auth/AuthSignUp';
import MessageBox from './message/MessageBox';
import MessageSend from './message/MessageSend';
import ModalFollow from './mypage/Profile/ModalFollow';
import ModalFollowing from './mypage/Profile/ModalFollowing';
import Auth from './main/auth/Auth';
import PostForm from './main/PostForm';
import ModalProfile from './mypage/Profile/ModalProfile';
import { useMediaQuery } from 'react-responsive';
import Profile from './mypage/Profile/Profile';

function Layout() {
  const [msgBoxToggle, setMsgBoxToggle] = useRecoilState(messageBoxToggle);
  const [msgSendToggle, setMsgSendToggle] = useRecoilState(messageSendToggle);
  const [followingToggle, setfollowingToggle] =
    useRecoilState(followingToggleAtom);
  const [followToggle, setFollowToggle] = useRecoilState(followToggleAtom);
  const [signUpModal, setSignUpModal] = useRecoilState(signUpModalAtom);
  const [forgotModal, setForgotModal] = useRecoilState(forgotModalAtom);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);
  const [postMapModal, setIsPostMapModal] = useRecoilState(postModalAtom);
  const [editProfileModal, setEditProfileModal] =
    useRecoilState(editProfileModalAtom);
  const [mobileProfileModal, setMobileProfileModal] = useRecoilState(
    mobileProfileModalAtom
  );

  const isMobile = useMediaQuery({ maxWidth: 823 });
  const isPc = useMediaQuery({ minWidth: 824 });
  return (
    <div>
      <div>
        {msgBoxToggle ? (
          <CustomModal
            modal={msgBoxToggle}
            setModal={setMsgBoxToggle}
            width={'500'}
            height={'500'}
            element={<MessageBox />}
          />
        ) : null}
      </div>
      <div>
        {msgSendToggle ? (
          <CustomModal
            modal={msgSendToggle}
            setModal={setMsgSendToggle}
            width={'500'}
            height={'500'}
            element={<MessageSend setModal={setMsgSendToggle} />}
          />
        ) : null}
      </div>
      <div>
        {followingToggle ? (
          <CustomModal
            modal={followingToggle}
            setModal={setfollowingToggle}
            width="524"
            height="695"
            element={<ModalFollowing />}
          />
        ) : null}
      </div>
      <div>
        {followToggle ? (
          <CustomModal
            modal={followToggle}
            setModal={setFollowToggle}
            width="524"
            height="695"
            element={<ModalFollow />}
          />
        ) : null}
      </div>
      <div>
        {signUpModal ? (
          <CustomModal
            modal={signUpModal}
            setModal={setSignUpModal}
            width="524"
            height="695"
            element={<AuthSignUp />}
          />
        ) : (
          ''
        )}
      </div>
      <>
        {forgotModal ? (
          <CustomModal
            modal={forgotModal}
            setModal={setForgotModal}
            width="524"
            height="467"
            element={<AuthForgot />}
          />
        ) : null}
      </>
      <>
        {closeLoginModal && (
          <>
            <>
              {isMobile && (
                <CustomModal
                  modal={closeLoginModal}
                  setModal={setCloseLoginModal}
                  width="1000"
                  height="3000"
                  element={<Auth />}
                />
              )}
            </>
            <>
              {isPc && (
                <CustomModal
                  modal={closeLoginModal}
                  setModal={setCloseLoginModal}
                  width="524"
                  height="695"
                  element={<Auth />}
                />
              )}
            </>
          </>
        )}
      </>
      {/* <>
        {mobileProfileModal ? (
          <CustomModal
            modal={mobileProfileModal}
            setModal={setMobileProfileModal}
            width="100"
            height="100"
            element={
              <Profile followingCount={undefined} followerCount={undefined} />
            }
          />
        ) : null}{' '}
      </> */}
      <>
        {postMapModal ? (
          <CustomModal
            modal={postMapModal}
            setModal={setIsPostMapModal}
            width="1100"
            height="632"
            element={<PostForm />}
          />
        ) : null}
        {editProfileModal ? (
          <CustomModal
            modal={editProfileModal}
            setModal={setEditProfileModal}
            width="524"
            height="695"
            element={<ModalProfile />}
          />
        ) : null}
      </>
    </div>
  );
}

export default Layout;

const ProfileModal = styled.div`
  @media ${(props) => props.theme.mobile} {
    width: 300px;
    height: 300px;
  }
`;
