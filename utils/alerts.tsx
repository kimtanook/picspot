import Swal from 'sweetalert2';

/**
 * @description 커스텀 컨펌 입니다.
 * @param {string} title 타이틀
 

 */
export const customConfirm = (title: string) => {
  Swal.fire({
    icon: 'success',
    title: title,
    confirmButtonColor: '#08818c',
  });
};

/**
 * @description 커스텀 alert 입니다.
 * @param {string} title 타이틀
 */
export const customAlert = (title: string) => {
  Swal.fire({
    icon: 'error',
    title: title,
    confirmButtonColor: '#1882ff',
  });
};
