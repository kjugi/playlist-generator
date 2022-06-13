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
  <div class="search-wrapper">
    <label for="search">
      Search for artists and pick them
    </label>
    <input
      type="text"
      name="search"
      disabled={isLoading}
      placeholder="i.e. Drake"
      on:change={e => searchArtist(e)}
    />
    {#if selectedArtists.length < 2}
      <p class="search-rule">
        Required at least 2 selected artist*
      </p>
    {/if}
  </div>

  <section class="page-content">
    <div class="results">
      <p class="page-label">
        Search results
      </p>
      {#if artists.length === 0}
        <div class="no-results">
          <p>
            There are no results so far
          </p>
        </div>
      {/if}
      {#each artists as artist}
        {#if selectedArtists.length === 0 || !selectedArtists.find(item => item.id === artist.id)}
          <div class="single-result">
            {#if artist.images[0]?.url}
              <img
                src={artist.images[0].url}
                alt={artist.name}
                class="single-result-image"
              />
            {/if}
            <div class="single-result-data">
              <p class="single-result-text">
                <span class="single-result-label">
                  Name:
                </span>
                <a href={artist.external_urls.spotify} target="_blank">
                  {artist.name}
                </a>
              </p>

              <p class="single-result-text">
                <span class="single-result-label">
                  Followers count:
                </span>
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
          </div>
        {/if}
      {/each}
    </div>

    <div class="selected-artists">
      <p class="page-label">
        Selected artists
      </p>
      {#if selectedArtists.length === 0}
        <div class="no-results">
          <p>
            There are no selcted artists
          </p>
        </div>
      {/if}
      {#each selectedArtists as artist}
        <div class="single-result">
          {#if artist.images[0]?.url}
            <img
              src={artist.images[0].url}
              alt={artist.name}
              class="single-result-image"
            />
          {/if}
          <div class="single-result-data">
            <p class="single-result-text">
              <span class="single-result-label">
                Name:
              </span>
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
        </div>
      {/each}
      {#if selectedArtists.length > 0}
        <div class="action-wrapper">
          <button
            type="button"
            class={styles.primary}
            disabled={selectedArtists.length < 2 || isLoading}
            on:click={() => step++}
          >
            Go to next step
          </button>
        </div>
      {/if}
    </div>
  </section>
</div>

<style>
  .search-wrapper {
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid var(--border-color);
  }

  .no-results {
    padding: 12px;
    background-color: var(--border-color);
    color: var(--white-color);
  }

  .search-rule {
    font-size: 12px;
  }

  .page-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .page-label {
    font-size: 12px;
    font-weight: 700;
  }

  .single-result {
    display: grid;
    grid-template-columns: 128px 1fr;
    gap: 16px;
    padding: 24px;
    margin-bottom: 12px;
    border: 1px solid var(--border-color);
  }

  .single-result-text {
    display: flex;
    justify-content: space-between;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  .single-result-label {
    font-weight: 700;
  }

  .single-result-image {
    width: 124px;
  }
</style>
