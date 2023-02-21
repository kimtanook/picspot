declare interface RoomsType {
  [key: string[]]: { [key: string]: string };
}

declare interface IMessage {
  id?: string;
  room?: string;
  user?: string | null | undefined;
  message?: string;
  time?: string;
  messageType?: string;
}
