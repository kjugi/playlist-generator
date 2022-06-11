<script lang="ts">
import { createEventDispatcher } from 'svelte'
import { ErrorCode, type ErrorType } from "src/utils/fetchUtil";
import styles from '../css/global.module.css';

export let errorData: ErrorType | null;
export let isError: boolean;

const dispatch = createEventDispatcher();
</script>

{#if isError && errorData}
  <div>
    <p>
      We have catched an error
    </p>
    <p>
      Message:
      <code>
        {errorData.error.message}
      </code>
    </p>
    {#if errorData.error.status === ErrorCode.ExpiredATokenError}
      <p>
        You can try again after relogin
      </p>
      <button
        class={styles.secondary}
        on:click={() => dispatch('reloadApp')}
      >
        Reload app
      </button>
    {:else}
      <button
        class={styles.primary}
        on:click={() => dispatch('resetCreator')}
      >
        Start again
      </button>
    {/if}
  </div>
{/if}
