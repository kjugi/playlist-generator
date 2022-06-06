type SimpleTrackItem = {
  id: string;
  explicit: boolean;
  href: string;
  name: string;
  track_number: string;
}

export type SingleAlbum = {
  available_markets: Array<string>;
  id: string;
  name: string;
  release_date: string;
  tracks: {
    items: Array<SimpleTrackItem>;
    total: number;
  }
  total_tracks: number;
  popularity: number;
}

export type SeveralAlbumsResponse = {
  albums: Array<SingleAlbum>;
}
