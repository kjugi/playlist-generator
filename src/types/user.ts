export type UserDataType = {
  name: string;
  image: string;
  id: string;
}

export type UserImage = {
  url: string;
  height: number;
  width: number;
}

export type MeResponse = {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  href: string;
  id: string;
  images: Array<UserImage>;
  type: string;
  uri: string;
}
