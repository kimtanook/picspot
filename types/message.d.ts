declare interface SendTakeMessage {
  id?: string;
  takeUser?: string | string[] | undefined;
  takeUserName?: string | null | undefined;
  sendUser?: string | null | undefined;
  sendUserName?: string | null | undefined;
  message?: string;
  time?: number;
  checked?: boolean;
}
declare interface CreateMessage {
  [key: string]: string | string[] | boolean | null | undefined | number;
}
declare interface MessageQueryKey {
  queryKey: (string | undefined)[];
}

declare interface DeleteMessage {
  [key: string]: string | undefined;
}
