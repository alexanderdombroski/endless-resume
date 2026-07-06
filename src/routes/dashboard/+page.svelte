<script lang="ts">
  import { resolve } from "$app/paths";
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
      <a class="nav-link" href={resolve("/")}>Home</a>
      <a class="nav-link active" href={resolve("/dashboard")}>Dashboard</a>
      <a class="nav-link" href={resolve("/editor")}>Editor</a>
      <a class="nav-link nav-cta" href={resolve("/sign-in")}>Sign in / Register</a>
    </nav>
  </div>
</header>

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
      <div class="dashboard-grid">
        {#each resumes as resume (resume._id)}
          <ResumeCard {resume} ondelete={handleDelete} />
        {/each}
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

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 600px) {
    .dashboard-shell {
      padding: 2rem 1.25rem;
    }
    .dashboard-header {
      flex-direction: column;
    }
  }
</style>
