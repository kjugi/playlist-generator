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

      console.log(data);
      // const albumIds = data.items.map(artistAlbum => artistAlbum.id);

      // for (let n = 0; n < albumIds.length; n++) {

      // }
    } catch (err) {
      isError = true;
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
