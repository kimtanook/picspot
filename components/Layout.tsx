import {
  messageBoxToggle,
  messageSendToggle,
  followingToggleAtom,
  followToggleAtom,
  signUpModalAtom,
  forgotModalAtom,
  loginModalAtom,
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
function Layout() {
  const [msgBoxToggle, setMsgBoxToggle] = useRecoilState(messageBoxToggle);
  const [msgSendToggle, setMsgSendToggle] = useRecoilState(messageSendToggle);
  const [followingToggle, setfollowingToggle] =
    useRecoilState(followingToggleAtom);
  const [followToggle, setFollowToggle] = useRecoilState(followToggleAtom);
  const [signUpModal, setSignUpModal] = useRecoilState(signUpModalAtom);
  const [forgotModal, setForgotModal] = useRecoilState(forgotModalAtom);
  const [closeLoginModal, setCloseLoginModal] = useRecoilState(loginModalAtom);

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
            width="400"
            height="650"
            element={<ModalFollowing />}
          />
        ) : null}
      </div>
      <div>
        {followToggle ? (
          <CustomModal
            modal={followToggle}
            setModal={setFollowToggle}
            width="400"
            height="650"
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
      <div>
        {forgotModal ? (
          <CustomModal
            modal={forgotModal}
            setModal={setForgotModal}
            width="524"
            height="695"
            element={<AuthForgot />}
          />
        ) : null}
      </div>
      <>
        {closeLoginModal ? (
          <CustomModal
            modal={closeLoginModal}
            setModal={setCloseLoginModal}
            width="524"
            height="695"
            element={<Auth />}
          />
        ) : (
          ''
        )}
      </>
    </div>
  );
}

export default Layout;
