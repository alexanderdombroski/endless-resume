<script lang="ts">
  import "../css/main.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
  <title>Endless Resume</title>
</svelte:head>

{@render children()}
