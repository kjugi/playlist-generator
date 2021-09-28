<script lang="ts">
  import Cookies from 'js-cookie';

  export let artists;
  export let selectedArtists;
  export let step;
  export let isLoading;

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
      const data = await response.json();

      console.log(data)
      artists = data.artists.items;
    } catch (err) {
      console.log(err);
    } finally {
      isLoading = false;
    }
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

        <p>
          Followers count:
          {artist.followers.total}
        </p>

        <button type="button">
          Select artist
        </button>
      </div>
    {/each}
  </div>

  <div class="selected-artists"></div>

  {#if selectedArtists.length < 2}
    <span>
      Required at least 2 selected artist
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