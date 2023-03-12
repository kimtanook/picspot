declare interface IData {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
  x: string;
  y: string;
}

declare interface IDisplayCenterInfo {
  address_name: string;
  code: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  region_type: string;
  x: number;
  y: number;
}

declare interface IMarkerData {
  address: string;
  city: string;
  clickCounter: number;
  content: string;
  createdAt: number;
  creator: string;
  id: string;
  imgUrl: string;
  lat: number;
  long: number;
  nickname: string;
  title: string;
  town: string;
}

declare interface ISearchCategory {
  address_name: string;
  code: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  region_type: string;
  x: number;
  y: number;
}

declare interface IMouseEvent {
  latLng: number;
  point: number;
}

declare interface IResult {
  address_name: string;
  code: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  region_4depth_name: string;
  region_type: string;
  x: number;
  y: number;
}
interface IModalMapsMarkerProps {
  item: IMarkerData;
  isOpen: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

declare interface IPostState {
  title: string;
  content: string;
  imgUrl: string;
  createdAt: number;
  creator: string | undefined;
  city: string;
  town: string;
  clickCounter: number;
  lat: number | undefined;
  long: number | undefined;
  address: string;
  nickname: string | null | undefined;
  imgPath: string;
}

declare interface IFileInput {
  current: input;
}
declare interface IImageRef {
  _location: string;
  _service: string;
  StorageReference: string | null | undefined;
}
