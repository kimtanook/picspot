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
  deleteModalAtom,
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
import { CustomModalMap } from './common/CustomModalMap';
import DetailList from './detail/detailRight/DetailList';
import DeletePost from './detail/detailRight/DeletePost';

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
  const [deleteModal, setDeleteModal] = useRecoilState(deleteModalAtom);

  const isMobile = useMediaQuery({ maxWidth: 823 });
  const isPc = useMediaQuery({ minWidth: 824 });
  return (
    <div>
      <div>{msgBoxToggle ? <MessageBox /> : null}</div>
      <div>
        {msgSendToggle ? <MessageSend setModal={setMsgSendToggle} /> : null}
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
      <>
        {signUpModal && (
          <>
            <>
              {isMobile && (
                <CustomModal
                  modal={signUpModal}
                  setModal={setSignUpModal}
                  width="1000"
                  height="3000"
                  element={<AuthSignUp />}
                />
              )}
            </>
            <>
              {isPc && (
                <CustomModal
                  modal={signUpModal}
                  setModal={setSignUpModal}
                  width="524"
                  height="695"
                  element={<AuthSignUp />}
                />
              )}
            </>
          </>
        )}
      </>
      <>
        {forgotModal && (
          <>
            <>
              {isMobile && (
                <CustomModal
                  modal={forgotModal}
                  setModal={setForgotModal}
                  width="1000"
                  height="1000"
                  element={<AuthForgot />}
                />
              )}
            </>
            <>
              {isPc && (
                <CustomModal
                  modal={forgotModal}
                  setModal={setForgotModal}
                  width="524"
                  height="467"
                  element={<AuthForgot />}
                />
              )}
            </>
          </>
        )}
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
      <>
        {postMapModal && (
          <>
            <>
              {isMobile && (
                <CustomModalMap
                  modal={postMapModal}
                  setModal={setIsPostMapModal}
                  width="90%"
                  height="100%"
                  element={<PostForm />}
                />
              )}
            </>
            <>
              {isPc && (
                <CustomModalMap
                  modal={postMapModal}
                  setModal={setIsPostMapModal}
                  width="500"
                  height="500"
                  element={<PostForm />}
                />
              )}
            </>
          </>
        )}
        <>
          {deleteModal && (
            <>
              <>
                {isMobile && (
                  <CustomModal
                    modal={deleteModal}
                    setModal={setDeleteModal}
                    width="1000"
                    height="1000"
                    element={<DeletePost />}
                  />
                )}
              </>
              <>
                {isPc && (
                  <CustomModal
                    modal={deleteModal}
                    setModal={setDeleteModal}
                    width="524"
                    height="467"
                    element={<DeletePost />}
                  />
                )}
              </>
            </>
          )}
        </>

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
