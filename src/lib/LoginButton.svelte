<script lang="ts">
  import styles from '../css/global.module.css';

  const runLoginAction = async () => {
    const baseUrl = 'https://accounts.spotify.com/authorize';
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: '7c9d6a1401154001bf9d43f77ec942ed',
      scope: 'playlist-modify-private,user-read-private,user-library-read',
    });
    const fullUrl = `${baseUrl}?${params.toString()}&redirect_uri=${encodeURIComponent('http://localhost:3000/')}`;

    window.location.replace(fullUrl);
  }
</script>

<button
  class={styles.primary}
  on:click={runLoginAction}
>
  Log in
</button>
