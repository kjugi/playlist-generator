<script lang="ts">
import { fetchUtil, type ErrorType } from "src/utils/fetchUtil";
import { handleError } from "src/utils/errorHandling";
import { PlaylistType as PlaylistEnum } from "../types/playlist";
import styles from '../css/global.module.css';

import type {
  SingleAlbum,
  SeveralAlbumsResponse,
  SimpleTrackItem
} from "src/types/albums";
import type {
  SingleArtist,
  ArtistAlbumListResponse,
} from "src/types/artists";
import type { PlaylistType } from "src/types/playlist";
import type { SingleTrack } from "src/types/tracks";
import { trackRatio } from "src/utils/trackRatio";

  export let selectedArtists: SingleArtist[];
  export let step: number;
  export let isLoading: boolean;
  export let playlistType: PlaylistType;
  export let userData: {
    id: string;
  }
  export let errorData: ErrorType | null;

  type ArtistId = string;
  type TrackCountPerAlbum = Array<{
    artistId: ArtistId;
    trackCount: number[];
  }>;

  let artistAlbums: {
    [key: ArtistId]: SingleAlbum[];
  } = {};
  let tracks: SingleTrack[] | SimpleTrackItem[] = [];

  let songsPerArtist = '';
  let playlistName = '';

  const generatePlaylist = async () => {
    isLoading = true;

    switch (playlistType) {
      case PlaylistEnum.TOPSONGS:
        await generateFromTopSongs();
      break;
      case PlaylistEnum.FROMALL:
        await fromPickedArtists(
          fetchArtistAlbums,
        );
      break;
      case PlaylistEnum.LATESTALBUM:
        await fromPickedArtists(
          fetchArtistAlbums,
          1
        );
      break;
      default:
        return;
    }
  }

  const resetBindedFields = () => {
    playlistName = '';
    songsPerArtist = '';
    tracks = [];
    artistAlbums = {};
  }

  const createSpotifyPlaylist = async () => {
    try {
      const playlistData: {
        id: string;
      } = await fetchUtil({
        path: `/users/${userData.id}/playlists`,
        configProps: {
          method: 'POST',
          body: JSON.stringify({
            name: playlistName,
            public: false
          })
        },
      });

      // TOOD: Adding tracks in loop per 100
      await fetchUtil({
        path: `/playlists/${playlistData.id}/tracks`,
        configProps: {
          method: 'POST',
          body: JSON.stringify({
            uris: tracks.map(track => track.uri),
          })
        },
      });
    } catch (err) {
      errorData = handleError(
        err,
        'Error occured when creating your playlist: '
      );
    } finally {
      resetBindedFields();
      step = 0;
      isLoading = false;
    }
  }

  const generateFromTopSongs = async () => {
    for (let i = 0; i < selectedArtists.length; i++) {
      try {
        const artistId = selectedArtists[i].id;
        const data = await fetchUtil({
          path: `/artists/${artistId}/top-tracks`,
          configProps: {
            method: 'GET',
          },
        });

        tracks.push(...data.tracks);
      } catch (err) {
        errorData = handleError(
          err,
          'Error occured during top tracks fetch: '
        );

        throw new Error(errorData.error.message);
      }
    }

    await createSpotifyPlaylist();
  }

  const fromPickedArtists = async (
    callback: (artist: SingleArtist, limit: number) => Promise<void>,
    limit?: number
  ) => {
    for (let i = 0; i < selectedArtists.length; i++) {
      await callback(selectedArtists[i], limit);
    }

    tracks = extractTracks();

    await createSpotifyPlaylist();
  }

  const extractTracks = () => {
    // TODO: Add real sorting method combined by song popularity and liked/not liked
    return Object.values(artistAlbums)
      .reduce<TrackCountPerAlbum>((prev, albumsData, index) => {
        return [
          ...prev,
          {
            artistId: Object.keys(artistAlbums)[index],
            trackCount: trackRatio(
              Number(songsPerArtist),
              albumsData.map(single => single.popularity)
            )
          }
        ]
      }, [])
      .map(singleAlbum => {
        const albumsTracks = artistAlbums[singleAlbum.artistId].map(album => album.tracks.items);

        return albumsTracks.map((tracks, index) => tracks.slice(0, singleAlbum.trackCount[index])).flat();
      })
      .reduce((prev, current) => ([...prev, ...current]), []);
  }

  const fetchArtistAlbums = async (artist: SingleArtist, limit?: number) => {
    try {
      const data = await fetchUtil<ArtistAlbumListResponse>({
        path: `/artists/${artist.id}/albums`,
        configProps: {
          method: 'GET',
        },
        queryParams: {
          include_groups: 'album',
          limit: limit || 20,
        }
      });
      const albumIds = data.items.map(artistAlbum => artistAlbum.id);

      await fetchAlbumsWithTracks(artist.id, albumIds);
    } catch (err) {
      const artistName = artist.name ? `"${artist.name}"` : 'artist';

      errorData = handleError(
        err,
        `Error occured during ${artistName} albums fetch: `
      );

      throw new Error(errorData.error.message);
    } finally {
      isLoading = false;
    }
  }

  const fetchAlbumsWithTracks = async (artistId: string, albumIds: string[]) => {
    // API accepts max 20 albums at single call so we have to split it for separate arrays
    const albumsReduced = albumIds.reduce<Array<Array<string>>>((acc, albumId, index) => {
      if (index % 20 || index === 1) {
        acc[acc.length - 1].push(albumId);
      } else {
        acc.push([albumId]);
      }

      return acc;
    }, []);

    for (let n = 0; n < albumsReduced.length; n++) {
      try {
        const {
          albums
        } = await fetchUtil<SeveralAlbumsResponse>({
          path: '/albums',
          configProps: {
            method: 'GET',
          },
          queryParams: {
            ids: albumsReduced[n].join(','),
          }
        })

        if (!artistAlbums[artistId]) {
          artistAlbums[artistId] = [];
        }

        artistAlbums[artistId].push(...albums)
      } catch (err) {
        errorData = handleError(
          err,
          'Error occured during albums tracks fetch: '
        );
        throw new Error(errorData.error.message);
      } finally {
        isLoading = false;
      }
    }
  }
</script>

<div>
  <p>
    Select playlist options
  </p>

  <div>
    <label for="playlistName">
      Playlist name
    </label>
    <input
      type="text"
      name="playlistName"
      disabled={isLoading}
      bind:value={playlistName}
    />
  </div>

  {#if playlistType !== PlaylistEnum.TOPSONGS}
    <div>
      <label for="songsPerArtist">
        Max tracks per artists (0 equals all)
      </label>
      <input
        type="text"
        name="songsPerArtist"
        disabled={isLoading}
        bind:value={songsPerArtist}
      />
    </div>
  {/if}

  <div class="actions">
    <button
      type="button"
      class={styles.primary}
      disabled={
        (playlistType !== PlaylistEnum.TOPSONGS && songsPerArtist === '') ||
        selectedArtists.length === 0 ||
        playlistName.length === 0 ||
        isLoading
      }
      on:click={generatePlaylist}
    >
      Generate playlist
    </button>
    <button
      type="button"
      class={styles.secondary}
      disabled={isLoading}
      on:click={() => {
        step--
      }}
    >
      Back
    </button>
  </div>
</div>
