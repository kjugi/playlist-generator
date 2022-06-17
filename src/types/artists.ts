
export type SingleArtistAlbum = {
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

export type SingleArtist = {
  external_urls: {
    spotify: string;
  };
  href: string;
  name: string;
  popularity: number;
  followers: {
    total: number;
  };
  id: string;
  images: {
    url: string;
  }[];
}

export type SearchArtistResponse = {
  artists: {
    items: SingleArtist[];
    next: string | null;
    previous: string | null;
    total: number;
  }
}

export type ArtistAlbumListResponse = {
  items: SingleArtistAlbum[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
};
