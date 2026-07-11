<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import ResumeTemplate from "$lib/components/dashboard/ResumeTemplate.svelte";
  import { templates, defaultSpacing, defaultFont } from "$lib/assets/data/templates";
  import type { Resume } from "$lib/schemas";

  type CreateResumeResponse = {
    message: string;
    resume: Resume;
  };

  type ApiErrorResponse = {
    message?: string;
    error?: string;
    errors?: unknown;
  };

  let selectedTemplate = $state<string | null>(null);
  let isCreating = $state(false);
  let errorMessage = $state<string | null>(null);

  async function handleCreate() {
    if (!selectedTemplate || isCreating) {
      return;
    }

    isCreating = true;
    errorMessage = null;

    try {
      const selectedTemplateData = templates.find((t) => t.template === selectedTemplate);

      if (!selectedTemplateData) {
        throw new Error("Selected template not found.");
      }

      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          title: selectedTemplateData.title || "Untitled Resume",
          subtitle: selectedTemplateData.subtitle,
          sections: selectedTemplateData.sections,
          spacing: defaultSpacing,
          font: defaultFont
        })
      });

      const data = (await response.json()) as CreateResumeResponse | ApiErrorResponse;

      console.log("Resume creation response:", data);

      if (!response.ok) {
        const errorData = data as ApiErrorResponse;

        throw new Error(errorData.message ?? errorData.error ?? "Could not create resume.");
      }

      const successData = data as CreateResumeResponse;
      const resumeId = successData.resume._id;

      if (!resumeId) {
        throw new Error("The resume was created, but no ID was returned.");
      }

      await goto(resolve("/editor"), {
        state: {
          resumeId
        }
      });
    } catch (error) {
      console.error("Failed to create resume:", error);

      errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    } finally {
      isCreating = false;
    }
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
          onclick={() => {
            if (!isCreating) {
              selectedTemplate = template.template;
            }
          }}
        />
      {/each}
    </div>

    <div class="new-resume-actions">
      <button
        type="button"
        class="btn btn-primary"
        disabled={!selectedTemplate || isCreating}
        aria-busy={isCreating}
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
