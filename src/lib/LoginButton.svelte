<script lang="ts">
  export let isLogged: boolean;

  const runLoginAction = async () => {
    const baseUrl = 'https://accounts.spotify.com/authorize';
    const params = new URLSearchParams({
      response_type: 'token',
      client_id: '7c9d6a1401154001bf9d43f77ec942ed',
      scope: 'playlist-modify-private,user-read-private',
    });
    const fullUrl = `${baseUrl}?${params.toString()}&redirect_uri=${encodeURIComponent('http://localhost:3000/')}`;

    window.location.replace(fullUrl);
  }
</script>

<button on:click={runLoginAction}>
  Log in
</button>

<style>
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
