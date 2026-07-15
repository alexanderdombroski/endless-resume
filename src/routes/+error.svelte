<script lang="ts">
  import { resolve } from "$app/paths";
  import { page } from "$app/state";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";

  const status = $derived(page.status);
  const isNotFound = $derived(status === 404);
</script>

<svelte:head>
  <title>{isNotFound ? "Page not found" : `Error ${status}`} · Endless Resume</title>
</svelte:head>

<Header />

<main class="error-main">
  <section class="error-page" aria-labelledby="error-title">
    <p class="eyebrow">{isNotFound ? "Lost your place" : `Error ${status}`}</p>
    <p class="error-code" aria-hidden="true">{status}</p>
    <h1 id="error-title">
      {isNotFound ? "This page doesn't exist." : "Something went wrong."}
    </h1>
    <p class="lede">
      {isNotFound
        ? "The page you're looking for may have been moved, renamed, or never existed. Let's get you back on track."
        : (page.error?.message ??
          "We hit an unexpected snag on our end. Try again, or head back home.")}
    </p>
    <div class="error-actions">
      <a class="btn btn-primary" href={resolve("/")}>Back to home</a>
    </div>
  </section>
</main>

<Footer />

<style>
  .error-main {
    min-height: calc(100vh - 64px - 72px);
    background: var(--color-bg);
    display: flex;
    align-items: center;
  }

  .error-main :global(.error-code) {
    font-family: var(--font-heading);
    font-weight: 700;
  }
</style>
