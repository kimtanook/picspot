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
