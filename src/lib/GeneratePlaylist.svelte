<script lang="ts">
import { fetchUtil } from "src/utils/fetchUtil";
import { PlaylistType as PlaylistEnum } from "../types/playlist";

import type { ArtistAlbumListResponse, SingleAlbum } from "src/types/albums";
import type { SingleArtist } from "src/types/artists";
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
  };
  let albumTracks: {
    [key: string]: SingleTrack[];
  }
  let tracks: SingleTrack[] = [];

  let songsPerArtist = 0;
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
    if (Math.ceil(albumIds.length / 20) > 1){
      // TOOD: Create unified solution for asking for resources in loop
      // for (let n = 0; n < Math.floor(albumIds.length / 20); n++) {

      // }
    } else {
      const data = await fetchUtil({
        path: '/albums',
        configProps: {
          method: 'GET',
        },
        queryParams: {
          ids: albumIds.join(','),
        }
      })
      // TODO: Fix pushing to array
      // artistAlbums[artistId] = data.albums;

      const tracksId = data.albums.flatMap(album => album.tracks.items).map(track => track.id)
      // TODO: Do the same thing as we are doing with albums and request them in loop
    }
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
      Max tracks per artists
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
      disabled={
        selectedArtists.length === 0 ||
        playlistName.length === 0 ||
        !Boolean(songsPerArtist) ||
        isLoading
      }
      on:click={generatePlaylist}
    >
      Generate playlist
    </button>
    <button
      type="button"
      on:click={() => {
        step--
      }}
    >
      Back
    </button>
  </div>
</div>
