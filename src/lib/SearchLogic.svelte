<script lang="ts">
  import styles from '../css/global.module.css';
  import { fetchUtil, type ErrorType } from 'src/utils/fetchUtil';
  import { handleError } from 'src/utils/errorHandling';
  import type { SearchArtistResponse, SingleArtist } from 'src/types/artists';

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
  };

  const selectArtist = (artistId: string) => {
    const artist = artists.find(({ id }) => id === artistId);
    selectedArtists = [...selectedArtists, artist];
  };

  const filterOutArtist = (artistId: string) => {
    selectedArtists = selectedArtists.filter(({ id }) => id !== artistId);
  };
</script>

<div>
  <div class={styles.progress}>
    <h1>
      Search
    </h1>
    <p>
      step: 1/3
    </p>
  </div>
  <div class="search-wrapper">
    <label for="search">
      Search for artists and pick them
    </label>
    <input
      type="text"
      name="search"
      disabled={isLoading}
      placeholder="i.e. Drake"
      on:change={searchArtist}
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
      {#each artists as { images, id, external_urls, name, followers }}
        {#if selectedArtists.length === 0 || !selectedArtists.find(item => item.id === id)}
          <div class="single-result">
            {#if images[0]?.url}
              <img
                src={images[0].url}
                alt={name}
                class="single-result-image"
              />
            {/if}
            <div class="single-result-data">
              <p class="single-result-text">
                <span class="single-result-label">
                  Name:
                </span>
                <a href={external_urls.spotify} target="_blank">
                  {name}
                </a>
              </p>

              <p class="single-result-text">
                <span class="single-result-label">
                  Followers count:
                </span>
                {followers.total}
              </p>

              <button
                type="button"
                class={styles.primary}
                disabled={
                  !!selectedArtists.find(el => el.id === id) ||
                  isLoading
                }
                on:click={() => selectArtist(id)}
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
      {#each selectedArtists as { images, name, external_urls, id }}
        <div class="single-result">
          {#if images[0]?.url}
            <img
              src={images[0].url}
              alt={name}
              class="single-result-image"
            />
          {/if}
          <div class="single-result-data">
            <p class="single-result-text">
              <span class="single-result-label">
                Name:
              </span>
              <a href={external_urls.spotify} target="_blank">
                {name}
              </a>
            </p>

            <button
              type="button"
              class={styles.secondary}
              disabled={isLoading}
              on:click={() => filterOutArtist(id)}
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
    margin-bottom: 32px;
  }

  .page-label {
    font-size: 12px;
    font-weight: 700;
  }

  .single-result {
    padding: 24px;
    margin-bottom: 12px;
    border: 1px solid var(--border-color);
  }

  .single-result-data {
    grid-column: 2;
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

  @media (min-width: 480px) {
    .single-result {
      display: grid;
      grid-template-columns: 128px 1fr;
      gap: 16px;
    }
  }

  @media (min-width: 768px) {
    .page-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }
</style>
