<script lang="ts">
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';
  import LoginButton from './lib/LoginButton.svelte'
  import Header from './lib/Header.svelte';
  import SearchLogic from './lib/SearchLogic.svelte';
  import GeneratePlaylist from './lib/GeneratePlaylist.svelte';
  import GenerateType from './lib/GenerateType.svelte';

  import type { SingleArtist } from './types/artists';

  let isLogged: boolean = false;
  let isLoading: boolean = false;
  let userData = {
    name: '',
    image: '',
  }
  let step = 0;
  let artists: SingleArtist[] = [];
  let selectedArtists: SingleArtist[] = [];
  let playlistType = 'topSongs';

  onMount(async () => {
    const params: { [key: string]: string | number } = window.location.hash
      .substring(1)
      .split('&')
      .reduce((acc, singleHash) => {
        const keyValue = singleHash.split('=');

        return {
          ...acc,
          [keyValue[0]]: keyValue[1]
        }
      }, {});

    if (params?.access_token && !Cookies.get('token')) {
      const expiryInDays = Number((Number(params?.expires_in) / (3600*24)).toFixed(2));

      Cookies.set(
        'token',
        String(params.access_token),
        { expires: expiryInDays }
      );
      isLogged = true;
    } else if (Cookies.get('token') && !params.error) {
      isLogged = true
    } else {
      Cookies.remove('token');
      isLogged = false;
    }

    if (isLogged) {
      await fetchUserData();
    }
  });

  const fetchUserData = async () => {
    isLoading = true;

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })
      const data = await response.json();

      userData.name = data.display_name;
      userData.image = data.images[0].url || '';
    } catch (err) {
      console.log(err);
    } finally {
      isLoading = false;
    }
  }
</script>

<main>
  <Header isLogged={isLogged} userData={userData} />

  {#if !isLogged}
    <LoginButton isLogged={isLogged} />
  {:else}
    {#if step === 0}
      <button type="button" on:click={() => step++}>
        Start new playlist!
      </button>
    {/if}

    {#if step === 1}
      <SearchLogic
        bind:step
        bind:artists
        bind:selectedArtists
        bind:isLoading
      />
    {/if}

    {#if step === 2}
      <GenerateType
        bind:step
        bind:isLoading
        bind:playlistType
      />
    {/if}

    {#if step === 3}
      <GeneratePlaylist
        bind:selectedArtists
        bind:step
        bind:isLoading
        bind:playlistType
      />
    {/if}

    {#if isLoading}
      <div class="global-loader">
        <p>
          Loading data...
        </p>
      </div>
    {/if}
  {/if}

</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(body) {
    margin: 0;
  }

  main {
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
