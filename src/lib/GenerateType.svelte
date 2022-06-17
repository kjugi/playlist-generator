<script lang="ts">
import styles from '../css/global.module.css';

import { PlaylistType } from 'src/types/playlist';

  export let step: number;
  export let playlistType: PlaylistType;
</script>

<div>
  <div class={styles.progress}>
    <h1>
      How we should pick the tracks?
    </h1>
    <p>
      step: 2/3
    </p>
  </div>

  <div class={styles['radio-container']}>
    <input
      type="radio"
      name="playlistType"
      id={PlaylistType.TOPSONGS}
      value={PlaylistType.TOPSONGS}
      bind:group={playlistType}
    />
    <label for={PlaylistType.TOPSONGS}>Top songs</label>
    <span class={playlistType === PlaylistType.TOPSONGS ? styles['radio-container-active'] : ''}/>
  </div>

  <div class={styles['radio-container']}>
    <input
      type="radio"
      name="playlistType"
      id={PlaylistType.FROMALL}
      value={PlaylistType.FROMALL}
      bind:group={playlistType}
    />
    <label for={PlaylistType.FROMALL}>From all albums</label>
    <span class={playlistType === PlaylistType.FROMALL ? styles['radio-container-active'] : ''}/>
  </div>

  <div class={styles['radio-container']}>
    <input
      type="radio"
      name="playlistType"
      id={PlaylistType.LATESTALBUM}
      value={PlaylistType.LATESTALBUM}
      bind:group={playlistType}
    />
    <label for={PlaylistType.LATESTALBUM}>Latest album only</label>
    <span class={playlistType === PlaylistType.LATESTALBUM ? styles['radio-container-active'] : ''}/>
  </div>

  <div class="actions">
    <button
      type="button"
      class={styles.primary}
      on:click={() => {
        step++;
      }}
    >
      Go next
    </button>
    <button
      type="button"
      class={styles.secondary}
      on:click={() => {
        step--;
      }}
    >
      Back
    </button>
  </div>
</div>
