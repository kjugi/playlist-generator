import type { SingleArtist } from "./artists";

export type SingleAlbum = {
  album_group: string;
  album_type: string;
  artists: SingleArtist[];
  external_urls: {
    spotify: string;
  };
  id: string;
  images: {
    url: string;
  }[];
  name: string;
  release_date: string;
  type: string;
};

export type ArtistAlbumListResponse = {
  items: SingleAlbum[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
