<script lang="ts">
  import { resolve } from "$app/paths";
  import LoginDialog from "./LoginDialog.svelte";
  import { authClient } from "$lib/auth/auth-client";
  let loginOpen = $state(false);

  const session = authClient.useSession();
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <span class="brand-mark brand-mark-sm" aria-hidden="true">ER</span>
      <div class="brand-copy">
        <p class="brand-name">Endless Resume</p>
        <p class="brand-tagline">Resume Editor</p>
      </div>
    </div>
    <nav class="footer-nav" aria-label="Footer">
      {#if $session.data?.user}
        <a href={resolve("/")}>Home</a>
        <a href={resolve("/dashboard")}>Dashboard</a>
      {:else}
        <button
          class="footer-link"
          onclick={() => (loginOpen = true)}
          type="button"
          aria-haspopup="dialog"
          id="header-sign-in-btn"
        >
          Sign in / Register
        </button>
      {/if}
    </nav>
    <p class="footer-copy">&copy; {new Date().getFullYear()} Endless Resume</p>
  </div>
</footer>

<LoginDialog bind:open={loginOpen} />
