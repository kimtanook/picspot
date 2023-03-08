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

export const saveLatLngAtom = atom({
  key: 'saveLatLng',
  default: [] as any,
});
export const saveAddressAtom = atom<string>({
  key: 'saveAddress',
  default: '',
});
export const searchCategoryAtom = atom<ISearchCategory | undefined>({
  key: 'searchCategory',
  default: undefined,
});
export const placeAtom = atom<string>({
  key: 'place',
  default: '',
});
export const infoDivAtom = atom<string>({
  key: 'infoDiv',
  default: '',
});

export const editBtnToggleAtom = atom({
  key: `editBtnToggleAtom${uuidv4()}`,
  default: false,
});

export const editPlaceAtom = atom({
  key: `editPlaceAtom${uuidv4()}`,
  default: '',
});

export const editSaveLatLngAtom = atom({
  key: `editSaveLatLngAtom${uuidv4()}`,
  default: [],
});

export const editSaveAddressAtom = atom({
  key: `editSaveAddress${uuidv4()}`,
  default: '',
});
