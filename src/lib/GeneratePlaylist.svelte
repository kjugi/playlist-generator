<script lang="ts">
import Cookies from "js-cookie";
import type { ArtistAlbumListResponse, SingleAlbum } from "src/types/albums";
import { PlaylistType as PlaylistEnum } from "../types/playlist";

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
        await generateFromAll();
      break;
      case PlaylistEnum.LATESTALBUM:
        generateFromLatestAlbum();
      break;
      default:
        return;
    }
  }

  const createSpotifyPlaylist = async () => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/users/${userData.id}/playlists`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        },
        body: JSON.stringify({
          name: playlistName,
          public: false
        })
      })
      const playlistData: {
        id: string;
      } = await response.json();

      // TOOD: Adding tracks in loop per 100
      await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: tracks.map(track => track.uri),
        })
      })
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
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        })
        const data = await response.json();

        tracks.push(...data.tracks);

      }

      await createSpotifyPlaylist();
    } catch (err) {
      isError = true;
    }
  }

  const generateFromAll = async () => {
    try {
      for (let i = 0; i < selectedArtists.length; i++) {
        await fetchArtistAlbums(selectedArtists[i].id);
      }
    } catch (err) {
      isError = true;
    } finally {
      isLoading = false;
    }
  }

  const generateFromLatestAlbum = async () => {
    try {
      for (let i = 0; i < selectedArtists.length; i++) {
        const artistId = selectedArtists[i].id;
        const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album&market=US&limit=1`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${Cookies.get('token')}`
            }
          })
        const data: ArtistAlbumListResponse = await response.json();
        const albumIds = data.items.map(artistAlbum => artistAlbum.id);

        await fetchAlbumsWithTracks(artistId, albumIds);
      }
    } catch (err) {
      isError = true;
    }
  }

  const fetchArtistAlbums = async (id: string) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/artists/${id}/albums?include_groups=album&market=US`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${Cookies.get('token')}`
          }
        })
      const data: ArtistAlbumListResponse = await response.json();
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
      const params = new URLSearchParams({
        ids: albumIds.join(','),
        market: 'US',
      });
      const url = new URL('https://api.spotify.com/v1/albums');
      url.search = params.toString();

      const albums = await fetch(String(url), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })
      const data = await albums.json();

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
        playlistType !== PlaylistEnum.TOPSONGS &&
        (
          songsPerArtist === 0 ||
          selectedArtists.length === 0 ||
          playlistName.length === 0 ||
          !isLoading
        )
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
