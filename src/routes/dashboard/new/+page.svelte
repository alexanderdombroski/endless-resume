<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import ResumeTemplate from "$lib/components/dashboard/ResumeTemplate.svelte";
  import { templates } from "$lib/assets/data/templates";

  const DEFAULT_SPACING = { bullet: 1, section: 1.5 };
  const DEFAULT_FONT = {
    family: "Inter",
    sizes: { title: 22, heading: 14, bullet: 11 }
  };

  let selectedTemplate = $state<string | null>(null);
  let isCreating = $state(false);
  let errorMessage = $state<string | null>(null);

  async function handleCreate() {
    if (!selectedTemplate) return;

    const template = templates.find((t) => t.template === selectedTemplate);
    if (!template) return;

    isCreating = true;
    errorMessage = null;

    const res = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: template.title,
        subtitle: template.subtitle,
        sections: template.sections,
        spacing: DEFAULT_SPACING,
        font: DEFAULT_FONT
      })
    });

    if (!res.ok) {
      errorMessage = "Could not create resume. Please try again.";
      isCreating = false;
      return;
    }

    const created = await res.json();

    await goto(resolve("/editor"), { state: { resumeId: created._id } });
  }
</script>

<svelte:head>
  <title>Choose a template - Endless Resume</title>
  <meta name="description" content="Choose a template to start a new resume." />
</svelte:head>

<Header />

<main class="new-resume-main">
  <div class="new-resume-shell">
    <div class="new-resume-header">
      <h1>Choose a template</h1>
      <p class="new-resume-subtitle">Pick a starting point for your new resume.</p>
    </div>

    {#if errorMessage}
      <p class="new-resume-error" role="alert">{errorMessage}</p>
    {/if}

    <div class="template-grid">
      {#each templates as template (template.template)}
        <ResumeTemplate
          templateData={template}
          selected={selectedTemplate === template.template}
          onclick={() => (selectedTemplate = template.template)}
        />
      {/each}
    </div>

    <div class="new-resume-actions">
      <button
        type="button"
        class="btn btn-primary"
        disabled={!selectedTemplate || isCreating}
        onclick={handleCreate}
      >
        {isCreating ? "Creating…" : "Use this template"}
      </button>
    </div>
  </div>
</main>

<Footer />

<style>
  .new-resume-main {
    min-height: calc(100vh - 64px - 72px);
    background: var(--color-bg);
  }

  .new-resume-shell {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 3rem 2rem;
  }

  .new-resume-header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 0.35rem;
  }

  .new-resume-subtitle {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    margin: 0 0 2rem;
  }

  .new-resume-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    border-radius: var(--radius);
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    margin: 0 0 1.5rem;
  }

  .template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }

  .new-resume-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  @media (max-width: 600px) {
    .new-resume-shell {
      padding: 2rem 1.25rem;
    }
  }
</style>
