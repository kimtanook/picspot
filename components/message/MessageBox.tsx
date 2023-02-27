import React, { useState } from 'react';

function MessageBox() {
  const [box, setBox] = useState('보낸메세지');
  return (
    <div>
      <div>
        {box === '보낸메세지' ? (
          <div>보낸메세지함</div>
        ) : (
          <div>받은메세지함</div>
        )}
      </div>
      <div onClick={() => setBox('보낸메세지')}>보낸메세지</div>
      <div onClick={() => setBox('받은메세지')}>받은메세지</div>
    </div>
  );
}

export default MessageBox;
