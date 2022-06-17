import type { SingleAlbum } from './albums';
import type { SingleArtist } from './artists';

export type SingleTrack = {
  album: SingleAlbum;
  artists: SingleArtist[],
  explicit: boolean;
  external_urls: {
    spotify: string;
  };
  id: string;
  name: string;
  popularity: number;
  track_number: number;
  type: string;
  uri: string;
};

export type AlbumTracksResponse = {
  tracks: SingleTrack[];
}

export type TopTracksResponse = {
  tracks: SingleTrack[];
}
