<script lang="ts">
import { fetchUtil } from "src/utils/fetchUtil";
import { PlaylistType as PlaylistEnum } from "../types/playlist";
import styles from '../css/global.module.css';

import type {
  SingleAlbum,
  SeveralAlbumsResponse
} from "src/types/albums";
import type {
  SingleArtist,
  ArtistAlbumListResponse,
 } from "src/types/artists";
import type { PlaylistType } from "src/types/playlist";
import type { SingleTrack } from "src/types/tracks";

  export let selectedArtists: SingleArtist[];
  export let step: number;
  export let isLoading: boolean;
  export let playlistType: PlaylistType;
  export let userData: {
    id: string;
  }

  let artistAlbums: {
    [key: string]: SingleAlbum[];
  } = {};
  let albumTracks: {
    [key: string]: SingleTrack[];
  } = {};
  let tracks: SingleTrack[] = [];

  let songsPerArtist = '';
  let playlistName = '';
  let isError = false;
  let errorMessage = '';

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
      isError = true;
    } finally {
      playlistName = '';
      tracks = [];
      isLoading = false;
      // TODO: Add success page
      step = 0;
    }
  }

  const generateFromTopSongs = async () => {
    try {
      for (let i = 0; i < selectedArtists.length; i++) {
        const artistId = selectedArtists[i].id;
        const data = await fetchUtil({
          path: `/artists/${artistId}/top-tracks`,
          configProps: {
            method: 'GET',
          },
        });

        tracks.push(...data.tracks);
      }

      await createSpotifyPlaylist();
    } catch (err) {
      isError = true;
    }
  }

  const fromPickedArtists = async (
    callback: (id: string, limit: number) => Promise<void>,
    limit?: number
  ) => {
    try {
      for (let i = 0; i < selectedArtists.length; i++) {
        await callback(selectedArtists[i].id, limit);
      }
    } catch (err) {
      isError = true;
    } finally {
      isLoading = false;
    }
  }

  const fetchArtistAlbums = async (id: string, limit?: number) => {
    try {
      const data: ArtistAlbumListResponse = await fetchUtil({
        path: `/artists/${id}/albums`,
        configProps: {
          method: 'GET',
        },
        queryParams: {
          include_groups: 'album',
          limit: limit || 20,
        }
      })
      const albumIds = data.items.map(artistAlbum => artistAlbum.id);

      await fetchAlbumsWithTracks(id, albumIds);
    } catch (err) {
      isError = true;
    }
  }

  const fetchAlbumsWithTracks = async (artistId: string, albumIds: string[]) => {
    const albumsReduced = albumIds.reduce<Array<Array<string>>>((acc, albumId, index) => {
      if (index % 20 || index === 1) {
        acc[acc.length - 1].push(albumId);
      } else {
        acc.push([albumId]);
      }

      return acc;
    }, []);

    for (let n = 0; n < albumsReduced.length; n++) {
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
      // TODO: Add custom rating by album.popularity field.
      // Calculace the song ratio on playlist together with songsPerArtist
      albumTracks = {
        ...albumTracks,
        ...albums.reduce((acc, album) => {
          const tracks = album.tracks.items
            .map(track => track.id)
            .sort(() => 0.5 - Math.random());

          if (songsPerArtist !== '0') {
            tracks.splice(Number(songsPerArtist))
          }
          return {
            ...acc,
            [album.id]: {
              tracks,
              popularity: album.popularity,
            }
          }
        }, {})
      }
    }
    // TODO: Trigger playlist create method
  }

</script>

<div>
  <p>
    Select playlist options
  </p>

  <label for="playlistName">
    Playlist name
  </label>
  <input
    type="text"
    name="playlistName"
    bind:value={playlistName}
  />

  {#if playlistType !== PlaylistEnum.TOPSONGS}
    <label for="songsPerArtist">
      Max tracks per artists (0 equals all)
    </label>
    <input
      type="text"
      name="songsPerArtist"
      bind:value={songsPerArtist}
    />
  {/if}

  <div class="actions">
    <button
      type="button"
      class={styles.primary}
      disabled={
        selectedArtists.length === 0 ||
        playlistName.length === 0 ||
        songsPerArtist === '' ||
        isLoading
      }
      on:click={generatePlaylist}
    >
      Generate playlist
    </button>
    <button
      type="button"
      class={styles.secondary}
      on:click={() => {
        step--
      }}
    >
      Back
    </button>
  </div>
</div>
