<script lang="ts">
  import styles from '../css/global.module.css';
  import type { SearchArtistResponse, SingleArtist } from 'src/types/artists';
  import { fetchUtil, type ErrorType } from 'src/utils/fetchUtil';
  import { handleError } from 'src/utils/errorHandling';

  export let artists: SingleArtist[];
  export let selectedArtists: SingleArtist[];
  export let step: number;
  export let isLoading: boolean;
  export let errorData: ErrorType | null;

  const searchArtist = async (e: Event & {
    currentTarget: EventTarget & HTMLInputElement;
  }) => {
    try {
      isLoading = true;

      const data = await fetchUtil<SearchArtistResponse>({
        path: '/search',
        configProps: {
          method: 'GET',
        },
        queryParams: {
          q: e.currentTarget.value,
          type: 'artist',
        }
      });

      artists = data.artists.items;
    } catch (err) {
      errorData = handleError(err);
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
  <input
    type="text"
    name="search"
    disabled={isLoading}
    on:change={e => searchArtist(e)}
  />

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
          class={styles.primary}
          disabled={
            !!selectedArtists.find(el => el.id === artist.id) ||
            isLoading
          }
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
          class={styles.secondary}
          disabled={isLoading}
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
    class={styles.primary}
    disabled={selectedArtists.length < 2 || isLoading}
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
