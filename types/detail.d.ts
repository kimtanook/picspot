declare interface ParamsType {
  id: string;
}

declare interface ItemType {
  address: string;
  city: string;
  clickCounter: number;
  content: string;
  createdAt: number;
  creator: string;
  id: string;
  uid: string | undefined;
  imgPath: string;
  imgUrl: string;
  lat: number;
  long: number;
  nickname: string;
  title: string;
  town: string;
  collector: string | undefined;
}

declare interface ItemProps {
  item: ItemType;
}

declare interface IdType {
  id: string;
  imgUrl: string;
}

declare interface ObjType {
  creator: string;
  uid: string;
  userImg: string;
  userName: string;
}

declare interface CreatorUserType {
  uid: string;
  creator: string;
}

declare interface AuthUserType {
  uid: string | undefined;
  creator: string | undefined;
}

declare interface FollowingDataItemType {
  docId: string;
  following: string[] | undefined;
}

declare interface AuthFollowingUidType {
  docId: string;
  following: string[];
}
[];

declare interface CollecionDataType {
  collector: string[] | undefined;
  imgUrl: string;
  town: string;
  uid: string;
}

declare interface CollectorUidType {
  collector: string[] | undefined;
  imgUrl: string;
  town: string;
  uid: string;
}
[];

declare interface EditSaveLatLagType {
  La: number | undefined | null;
  Ma: number | undefined | null;
}
[];

declare interface DocIdType {
  docId: string;
}

declare interface DeatailListItemType {
  address: string | undefined;
  city: string | undefined;
  content: string | undefined;
  id: string | undefined;
  lat: number | undefined | null;
  long: number | undefined | null;
  title: string | undefined;
  town: string | undefined;
  imgUrl: string | undefined;
}
