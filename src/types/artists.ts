export type SingleArtist = {
  external_urls: {
    spotify: string;
  },
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
