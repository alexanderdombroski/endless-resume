<script lang="ts">
  import "../css/main.css";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href="/favicon.svg" />
</svelte:head>

{@render children()}
