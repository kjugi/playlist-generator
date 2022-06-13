<script lang="ts">
  import Cookie from 'js-cookie';

  export let isLogged;
  export let userData;

  let menuOpened = false;

  const resetCreator = () => {
    window.location.reload();
  }
</script>

<header>
  <div
    class="logo-wrapper"
    on:click={resetCreator}
  >
    <img
      class="logo"
      src="/logo.png"
      alt="main logo on the page"
    />
    <span class="logo-description">
      playlist generator
    </span>
  </div>
  {#if isLogged}
    <div class="user-section">
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
    </div>
  {/if}
</header>

<style>
  header {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: var(--black-color);
    color: var(--white-color);
  }

  .logo-wrapper {
    cursor: pointer;
  }

  .logo-description {
    display: block;
    font-size: 12px;
    font-weight: 100;
  }

  .logo {
    width: 24px;
  }

  button {
    background-color: transparent;
    border: none;
    color: var(--white-color);
    cursor: pointer;
  }

  .user-section {
    display: flex;
    font-weight: 700;
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
    background: var(--black-color);
  }

  .menu-item-button {
    width: 100%;
    padding: 8px 16px;
    font-weight: 700;
  }

  .menu-item-button:hover {
    color: var(--green-color);
  }

  img.profile-image {
    max-width: 48px;
    border-radius: 48px;
  }
</style>
