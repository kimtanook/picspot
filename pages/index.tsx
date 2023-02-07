import ModalLogin from '@/components/ModalLogin';
import Seo from '@/components/Seo';
import { useState } from 'react';

export default function Main() {
  const [closeModal, setCloseModal] = useState(false);

  return (
    <div>
      <Seo title="Home" />
      {closeModal && (
        <ModalLogin closeModal={() => setCloseModal(!closeModal)}>
          <button id="modalCloseBtn" />
        </ModalLogin>
      )}
      <button onClick={() => setCloseModal(!closeModal)}>로그인</button>
    </div>
  );
}
