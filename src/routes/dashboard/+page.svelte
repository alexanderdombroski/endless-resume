<script lang="ts">
  import { resolve } from "$app/paths";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import ResumeCard from "$lib/components/dashboard/ResumeCard.svelte";
  import type { Resume } from "$lib/schemas";
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();

  let resumes = $state<Resume[]>(data.resumes);
  let errorMessage = $state<string | null>(null);

  let isEmpty = $derived(resumes.length === 0);

  async function handleDelete(id: string) {
    errorMessage = null;
    const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
    if (!res.ok) {
      errorMessage = "Could not delete resume. Please try again.";
      return;
    }
    resumes = resumes.filter((resume) => resume._id !== id);
  }
</script>

<svelte:head>
  <title>Dashboard - Endless Resume</title>
  <meta name="description" content="View, create, and manage your resumes." />
</svelte:head>

<Header />

<main class="dashboard-main">
  <div class="dashboard-shell">
    <div class="dashboard-header">
      <div>
        <h1>My Resumes</h1>
        <p class="dashboard-subtitle">Create, open, and manage your resumes.</p>
      </div>
      <a class="btn btn-primary" href={resolve("/dashboard/new")}>Create new resume</a>
    </div>

    {#if errorMessage}
      <p class="dashboard-error" role="alert">{errorMessage}</p>
    {/if}

    {#if isEmpty}
      <div class="dashboard-empty">
        <p>You don't have any resumes yet.</p>
        <a class="btn btn-primary" href={resolve("/dashboard/new")}>Create your first resume</a>
      </div>
    {:else}
      <div class="dashboard-scroll">
        <div class="dashboard-grid">
          {#each resumes as resume (resume._id)}
            <ResumeCard {resume} ondelete={handleDelete} />
          {/each}
        </div>
      </div>
    {/if}
  </div>
</main>

<Footer />

<style>
  .dashboard-main {
    min-height: calc(100vh - 64px - 72px);
    background: var(--color-bg);
  }

  .dashboard-shell {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  .dashboard-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .dashboard-header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 0.35rem;
  }

  .dashboard-subtitle {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .dashboard-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    border-radius: var(--radius);
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    margin: 0 0 1.5rem;
  }

  .dashboard-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 4rem 2rem;
    text-align: center;
    background: var(--color-surface);
    border: 1px dashed var(--color-border);
    border-radius: var(--radius);
    color: var(--color-text-muted);
  }

  /* Desktop: single row, scrolls side to side */
  .dashboard-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0.25rem 0.25rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
  }

  .dashboard-grid {
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
  }

  .dashboard-grid :global(.resume-card) {
    flex: 0 0 240px;
  }

  @media (max-width: 600px) {
    /* Mobile: stack into a column, scroll up and down instead */
    .dashboard-scroll {
      overflow-x: hidden;
      overflow-y: auto;
      max-height: 60vh;
    }

    .dashboard-grid {
      flex-direction: column;
    }

    .dashboard-grid :global(.resume-card) {
      flex: none;
      width: 100%;
    }

    .dashboard-shell {
      padding: 2rem 1.25rem;
    }
    .dashboard-header {
      flex-direction: column;
    }
  }
</style>
