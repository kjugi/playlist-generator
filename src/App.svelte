<script lang="ts">
  import { onMount } from 'svelte';
  import Cookies from 'js-cookie';
  import LoginButton from './lib/LoginButton.svelte'
  import Header from './lib/Header.svelte';
  import SearchLogic from './lib/SearchLogic.svelte';
  import GeneratePlaylist from './lib/GeneratePlaylist.svelte';
  import GenerateType from './lib/GenerateType.svelte';
  import { ErrorCode, fetchUtil, type ErrorType } from './utils/fetchUtil';
  import { PlaylistType as PlaylistEnum } from './types/playlist';
  import styles from './css/global.module.css';

  import type { SingleArtist } from './types/artists';
  import type { PlaylistType } from './types/playlist';

  let isLogged: boolean = false;
  let isLoading: boolean = false;
  let isError: boolean = false;
  let errorData: ErrorType | null = null;
  let userData = {
    name: '',
    image: '',
    id: '',
  }
  let step = 0;
  let artists: SingleArtist[] = [];
  let selectedArtists: SingleArtist[] = [];
  let playlistType: PlaylistType = PlaylistEnum.TOPSONGS;
  $: {
    errorData ? isError = true : isError = false;
  }

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
      logout();
    }

    if (isLogged) {
      await fetchUserData();
    }
  });

  const fetchUserData = async () => {
    isLoading = true;

    try {
      const data = await fetchUtil({
        path: '/me',
        configProps: {
          method: 'GET',
        }
      });
      userData.name = data.display_name;
      userData.image = data.images[0].url || '';
      userData.id = data.id
    } catch (err) {
      // TODO: Add global catch for 404 and run logout
      console.log(err);
    } finally {
      isLoading = false;
    }
  }

  const logout = () => {
    Cookies.remove('token');
    isLogged = false;
    errorData = null;
  }

  const reloadApp = () => {
    logout();
    window.location.replace(window.location.pathname);
  }
</script>

<main>
  <Header isLogged={isLogged} userData={userData} />
  <div class="content">
    {#if !isLogged}
      <div class="login-wrapper">
        <LoginButton />
      </div>
    {:else if isLogged && !isError}
      {#if step === 0}
        <button
          type="button"
          class={styles.primary}
          disabled={isLoading}
          on:click={() => step++}
        >
          Start new playlist!
        </button>
      {/if}

      {#if step === 1}
        <SearchLogic
          bind:step
          bind:artists
          bind:selectedArtists
          bind:isLoading
          bind:errorData
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
          bind:userData
        />
      {/if}
    {/if}
    {#if isLoading}
      <div class="global-loader">
        <p>
          Loading data...
        </p>
      </div>
    {/if}
    {#if isError && errorData}
      <div>
        <p>
          We have catched an error
        </p>
        {#if errorData.error.status === ErrorCode.ExpiredATokenError}
          <p>
            You can try again after login again
          </p>
          <button
            class={styles.secondary}
            on:click={reloadApp}
          >
            Reload app
          </button>
        {/if}
      </div>
    {/if}
  </div>
</main>

<style>
  .content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 24px;
  }

  .login-wrapper {
    display: flex;
    justify-content: center;
  }

  @media (min-width: 480px) {
    .content {
      padding: 24px 0;
    }
  }
</style>
