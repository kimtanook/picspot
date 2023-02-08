import ModalLogin from '@/components/ModalLogin';
import Seo from '@/components/Seo';
import { useState } from 'react';

export default function Main() {
  const [closeModal, setCloseModal] = useState(false);
  const closeModalButton = () => {
    setCloseModal(!closeModal);
  };
  return (
    <div>
      <Seo title="Home" />
      {closeModal && <ModalLogin closeModal={closeModalButton} />}
      <button onClick={closeModalButton}>로그인</button>
    </div>
  );
}
