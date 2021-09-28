<script lang="ts">
  import Cookie from 'js-cookie';

  export let isLogged;
  export let userData;

  let menuOpened = false;
</script>

<header>
  {#if isLogged}
    <p>
      Hi, {userData.name}
    </p>

    <div class="menu-container">
      <button 
        type="button"
        class="menu-trigger"
        on:click={() => {
          menuOpened = !menuOpened;
        }}
      >
        <img 
          src={userData.image}
          alt="Your profile avatar"
          class="profile-image"
        />
        <span class="menu-trigger-icon">
          >
        </span>
      </button>

      {#if menuOpened}
        <div class="menu-items">
          <button 
            type="button"
            class="menu-item-button"
            on:click={() => {
              Cookie.remove('token')
              window.location.replace('/')
            }}
          >
            Logout
          </button>
        </div>
      {/if}
    </div>
  {/if}
</header>

<style>
  header {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 16px;
    background-color: #272727;
    color: #fff;
  }

  button {
    background-color: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
  }

  .menu-trigger {
    display: flex;
    align-items: center;
    min-width: 48px;
  }

  .menu-trigger-icon {
    margin-left: 8px;
    transform: rotate(90deg);
  }

  .menu-items {
    position: absolute;
    right: 0;
    bottom: -32px;
    width: 200px;
    background: #272727;
  }

  .menu-item-button { 
    width: 100%;
    padding: 8px 16px;
  }

  img.profile-image {
    max-width: 48px;
  }
</style>