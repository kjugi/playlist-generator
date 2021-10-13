<script lang="ts">
import type { PlaylistType } from "src/types/playlist";

  export let step: number;
  export let isLoading: boolean;
  export let playlistType: PlaylistType;
</script>

<div>
  <p>
    How we should pick the tracks?
  </p>

  <input
    type="radio"
    name="playlistType"
    id="topSongs"
    value="topSongs"
    bind:group={playlistType}
  />
  <label for="topSongs">Top songs</label>

  <input
    type="radio"
    name="playlistType"
    id="fromAll"
    value="fromAll"
    bind:group={playlistType}
  />
  <label for="fromAll">From all songs</label>

  <input
    type="radio"
    name="playlistType"
    id="latestAlbum"
    value="latestAlbum"
    bind:group={playlistType}
  />
  <label for="latestAlbum">Latest album only</label>

  <div class="actions">
    <button
      type="button"
      on:click={() => {
        step++
      }}
    >
      Go next
    </button>
    <button
      type="button"
      on:click={() => {
        step--
      }}
    >
      Back
    </button>
  </div>
</div>
