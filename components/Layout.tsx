import {
  messageBoxToggle,
  messageSendToggle,
  followingToggleAtom,
  followToggleAtom,
} from '@/atom';
import React from 'react';
import { useRecoilState } from 'recoil';
import { CustomModal } from './common/CustomModal';
import MessageBox from './message/MessageBox';
import MessageSend from './message/MessageSend';
import ModalFollow from './mypage/Profile/ModalFollow';
import ModalFollowing from './mypage/Profile/ModalFollowing';

function Layout() {
  const [msgBoxToggle, setMsgBoxToggle] = useRecoilState(messageBoxToggle);
  const [msgSendToggle, setMsgSendToggle] = useRecoilState(messageSendToggle);
  const [followingToggle, setfollowingToggle] =
    useRecoilState(followingToggleAtom);
  const [followToggle, setFollowToggle] = useRecoilState(followToggleAtom);
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
            element={<MessageSend />}
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
    </div>
  );
}

export default Layout;
