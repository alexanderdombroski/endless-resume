<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  function isActive(path: string) {
    return page.url.pathname === path || page.url.pathname.startsWith(`${path}/`);
  }
</script>

<header class="site-header">
  <div class="header-inner">
    <a class="brand" href={resolve("/")} aria-label="Endless Resume home">
      <span class="brand-mark" aria-hidden="true">ER</span>
      <div class="brand-copy">
        <p class="brand-name">Endless Resume</p>
        <p class="brand-tagline">Resume Editor</p>
      </div>
    </a>

    <nav class="site-nav" aria-label="Primary">
      <a class="nav-link" class:active={isActive(resolve("/"))} href={resolve("/")}>Home</a>
      <a
        class="nav-link"
        class:active={isActive(resolve("/dashboard"))}
        href={resolve("/dashboard")}>Dashboard</a
      >
      <a class="nav-link" class:active={isActive(resolve("/editor"))} href={resolve("/editor")}
        >Editor</a
      >
      <a class="nav-link nav-cta" href={resolve("/sign-in")}>Sign in / Register</a>
    </nav>
  </div>
</header>
