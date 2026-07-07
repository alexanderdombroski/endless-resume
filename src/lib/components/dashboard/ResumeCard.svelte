<script lang="ts">
  import { resolve } from "$app/paths";
  import type { Resume } from "$lib/schemas";
  import ResumePreview from "./ResumePreview.svelte";

  let {
    resume,
    ondelete
  }: {
    resume: Resume;
    ondelete: (id: string) => Promise<void>;
  } = $props();

  let isDeleting = $state(false);

  async function handleDelete() {
    isDeleting = true;
    try {
      await ondelete(resume._id);
    } finally {
      isDeleting = false;
    }
  }
</script>

<div class="resume-card">
  <ResumePreview title={resume.title} subtitle={resume.subtitle} sections={resume.sections} />

  <div class="resume-card-info">
    <p class="resume-card-title">{resume.title}</p>
    <p class="resume-card-meta">Updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
  </div>

  <div class="resume-card-actions">
    <a class="btn btn-secondary" href={resolve("/editor")}>Edit</a>
    <button type="button" class="btn btn-danger" onclick={handleDelete} disabled={isDeleting}>
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  </div>
</div>

<style>
  .resume-card {
    display: flex;
    flex-direction: column;
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 12px;
    box-shadow: var(--shadow-card);
    transition:
      box-shadow 160ms,
      transform 160ms;
  }

  .resume-card:hover {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }

  .resume-card-info {
    margin-top: 10px;
    padding: 0 4px;
  }

  .resume-card-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 2px;
  }

  .resume-card-meta {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    margin: 0;
  }

  .resume-card-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 12px;
    padding: 0 4px;
  }

  .resume-card-actions .btn {
    flex: 1;
    padding: 0.4rem 0.75rem;
    font-size: 0.82rem;
  }

  .btn-danger {
    background: transparent;
    color: #b91c1c;
    border: 1.5px solid #fecaca;
  }

  .btn-danger:hover {
    background: #fef2f2;
  }

  .btn-danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
