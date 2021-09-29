<script lang="ts">
  import Cookies from 'js-cookie';
  import type { SearchArtistResponse, SingleArtist } from 'src/types/artists';

  export let artists: SingleArtist[];
  export let selectedArtists: SingleArtist[];
  export let step: number;
  export let isLoading: boolean;

  const searchArtist = async (e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }) => {
    try {
      const params = new URLSearchParams({
        q: e.currentTarget.value,
        type: 'artist',
      });
      const url = new URL('https://api.spotify.com/v1/search');
      url.search = params.toString();

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })
      const data: SearchArtistResponse = await response.json();

      artists = data.artists.items;
    } catch (err) {
      console.log(err);
    } finally {
      isLoading = false;
    }
  }

  const selectArtist = (artist: SingleArtist) => {
    selectedArtists = [...selectedArtists, artist]
  }

  const filterOutArtist = (artist: SingleArtist) => {
    selectedArtists = selectedArtists.filter(single => single.id !== artist.id)
  }
</script>

<div>
  <label for="search">
    Search for artists and pick them
  </label>
  <input type="text" name="search" on:change={e => searchArtist(e)} />

  <div class="results">
    {#each artists as artist}
      <div class="single-result">
        {#if artist.images[0]?.url}
          <img
            src={artist.images[0].url}
            alt={artist.name}
            class="single-result-image"
          />
        {/if}
        <p>
          Name:
          <a href={artist.external_urls.spotify} target="_blank">
            {artist.name}
          </a>
        </p>

        <p>
          Followers count:
          {artist.followers.total}
        </p>

        <button
          type="button"
          disabled={!!selectedArtists.find(el => el.id === artist.id)}
          on:click={() => selectArtist(artist)}
        >
          Select artist
        </button>
      </div>
    {/each}
  </div>

  <div class="selected-artists">
    {#each selectedArtists as artist}
      <div class="single-result">
        <img
          src={artist.images[0].url}
          alt={artist.name}
          class="single-result-image"
        />
        <p>
          Name:
          <a href={artist.external_urls.spotify} target="_blank">
            {artist.name}
          </a>
        </p>

        <button
          type="button"
          on:click={() => filterOutArtist(artist)}
        >
          Remove artist
        </button>
      </div>
    {/each}
  </div>

  {#if selectedArtists.length < 2}
    <span>
      Required at least 2 selected artist*
    </span>
  {/if}
  <button
    type="button"
    disabled={selectedArtists.length < 2}
    on:click={() => step++}
  >
    Go to next step
  </button>
</div>

<style>
  .single-result {
    padding: 8px;
    margin-bottom: 12px;
    border-bottom: 1px solid #ddd;
  }

  .single-result-image {
    width: 48px;
  }
</style>
