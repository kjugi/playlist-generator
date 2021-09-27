<script lang="ts">
  import { v4 } from 'uuid';

  export let isLogged;

  async function sha256(plain) {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)

    return window.crypto.subtle.digest('SHA-256', data)
  }

  function base64urlencode(a: ArrayBuffer){
    return btoa(String.fromCharCode.apply(null, new Uint8Array(a))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''))
  }

  const runLoginAction = async () => {
    try {
      const hashed = await sha256(v4());
      
      const baseUrl = 'https://accounts.spotify.com/authorize';
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: '7c9d6a1401154001bf9d43f77ec942ed',
        scope: 'playlist-modify-private,user-read-private',
        code_challenge: base64urlencode(hashed),
        code_challenge_method: 'S256'
      });
      const fullUrl = `${baseUrl}?${params.toString()}&redirect_uri=${encodeURIComponent('http://localhost:3000/')}`;

      window.open(fullUrl)
    } catch (err) {
      console.error(err);
    }
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
