declare interface SendMessage {
  takeUser: string | string[] | undefined;
  sendUser: string | null | undefined;
  sendUserName: string | null | undefined;
  message: string;
  time: number;
  checked: boolean;
}
