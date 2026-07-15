<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import { authClient } from "$lib/auth/auth-client";
  import LoginDialog from "./LoginDialog.svelte";
  import ProfilePopover from "./ProfilePopover.svelte";

  function isActive(path: string) {
    return page.url.pathname === path || page.url.pathname.startsWith(`${path}/`);
  }

  const session = authClient.useSession();

  let loginOpen = $state(false);
</script>

<header class="site-header">
  <div class="header-inner">
    <a class="brand" href={resolve("/")} aria-label="Endless Resume home">
      <span class="brand-mark" aria-hidden="true">ER</span>
      <div class="brand-copy">
        <p class="brand-name">Endless Resume</p>
        <!-- <p class="brand-tagline">Resume Editor</p> -->
      </div>
    </a>

    <nav class="site-nav" aria-label="Primary">
      <a class="nav-link" class:active={isActive(resolve("/"))} href={resolve("/")}>Home</a>
      {#if $session.data?.user}
        <a
          class="nav-link"
          class:active={isActive(resolve("/dashboard"))}
          href={resolve("/dashboard")}>Dashboard</a
        >
      {/if}

      {#if $session.data?.user}
        <ProfilePopover />
      {:else}
        <button
          class="nav-link nav-cta"
          onclick={() => (loginOpen = true)}
          type="button"
          aria-haspopup="dialog"
          id="header-sign-in-btn"
        >
          Sign in / Register
        </button>
      {/if}
    </nav>
  </div>
</header>

<LoginDialog bind:open={loginOpen} />
