<script lang="ts">
import Cookies from "js-cookie";
import type { ArtistAlbumListResponse, SingleAlbum } from "src/types/albums";

import type { SingleArtist } from "src/types/artists";
import type { SingleTrack } from "src/types/tracks";

  export let selectedArtists: SingleArtist[];
  export let step: number;
  export let isLoading: boolean;

  let artistAlbums: {
    [key: string]: SingleAlbum[];
  };
  let albumTracks: {
    [key: string]: SingleTrack[];
  }

  let songsPerArtist = 0;
  let isError = false;
  let errorMessage = '';

  const generatePlaylist = async () => {
    try {
      isLoading = true;
      for (let i = 0; i < selectedArtists.length; i++) {
        await fetchArtistAlbums(selectedArtists[i].id);
      }
    } catch (err) {
      isError = true;
    } finally {
      isLoading = false;
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

  <label for="songsPerArtist">
    Max tracks per artists
  </label>
  <input
    type="text"
    name="songsPerArtist"
    bind:value={songsPerArtist}
  />

  <div class="actions">
    <button
      type="button"
      disabled={
        songsPerArtist === 0 &&
        selectedArtists.length > 0 &&
        !isLoading
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
