import { messageBoxToggle, messageSendToggle } from '@/atom';
import React from 'react';
import { useRecoilState } from 'recoil';
import { CustomModal } from './common/CustomModal';
import MessageBox from './message/MessageBox';
import MessageSend from './message/MessageSend';

function Layout() {
  const [msgBoxToggle, setMsgBoxToggle] = useRecoilState(messageBoxToggle);
  const [msgSendToggle, setMsgSendToggle] = useRecoilState(messageSendToggle);
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
    </div>
  );
}

export default Layout;
