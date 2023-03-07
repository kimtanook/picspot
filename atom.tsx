import { atom } from 'recoil';
import { v4 as uuidv4 } from 'uuid';

export const messageBoxToggle = atom({
  key: `messageToggle${uuidv4()}`,
  default: false,
});
export const messageSendToggle = atom({
  key: `messageToggle${uuidv4()}`,
  default: false,
});

export const followingToggleAtom = atom({
  key: `followingToggleAtom${uuidv4()}`,
  default: false,
});

export const followToggleAtom = atom({
  key: `followToggleAtom${uuidv4()}`,
  default: false,
});

export const editAtom = atom({
  key: `editAtom${uuidv4()}`,
  default: {},
});

export const loginModalAtom = atom({
  key: `LoginModalAtom`,
  default: false,
});

export const signUpModalAtom = atom({
  key: `signUpModalAtom`,
  default: false,
});

export const forgotModalAtom = atom({
  key: `forgotModalAtom`,
  default: false,
});
export const postModalAtom = atom({
  key: `postModalAtom`,
  default: false,
});
export const editProfileModalAtom = atom({
  key: `editProfileModalAtom`,
  default: false,
});
export const mobileProfileModalAtom = atom({
  key: `mobileProfileModalAtom`,
  default: false,
});
export const townArray = atom({
  key: 'townArray',
  default: [] as string[],
});

// export const townArray = atom<string[]>({
//   key: 'townArray',
//   default: []
// });

export const saveLatLngAtom = atom({
  key: 'saveLatLng',
  default: [] as any,
});
export const saveAddressAtom = atom({
  key: 'saveAddress',
  default: false,
});
export const searchCategoryAtom = atom({
  key: 'searchCategory',
  default: [] as any,
});
export const placeAtom = atom({
  key: 'place',
  default: [] as any,
});
export const infoDivAtom = atom({
  key: 'infoDiv',
  default: false,
});
