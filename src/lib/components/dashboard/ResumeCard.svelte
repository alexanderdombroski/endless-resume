<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";
  import type { Resume } from "$lib/schemas";
  import ResumePreview from "./ResumePreview.svelte";

  let {
    resume,
    ondelete,
    onduplicate
  }: {
    resume: Resume;
    ondelete: (id: string) => Promise<void>;
    onduplicate: (resume: Resume, title: string) => Promise<void>;
  } = $props();

  let isDeleting = $state(false);
  let isDuplicating = $state(false);
  let showDuplicateModal = $state(false);
  let duplicateTitle = $state("");
  let duplicateError = $state<string | null>(null);

  function handleEdit(event: MouseEvent) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();

    void goto(resolve("/editor"), {
      state: {
        resumeId: resume._id
      }
    });
  }

  function openDuplicateModal() {
    if (isDeleting || isDuplicating) {
      return;
    }

    duplicateTitle = `${resume.title} Copy`;
    duplicateError = null;
    showDuplicateModal = true;
  }

  function closeDuplicateModal() {
    if (isDuplicating) {
      return;
    }

    showDuplicateModal = false;
    duplicateTitle = "";
    duplicateError = null;
  }

  function handleModalKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeDuplicateModal();
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeDuplicateModal();
    }
  }

  async function handleDuplicateSubmit(event: SubmitEvent) {
    event.preventDefault();

    const title = duplicateTitle.trim();

    if (!title) {
      duplicateError = "Please enter a name for the duplicated resume.";
      return;
    }

    if (title.length > 150) {
      duplicateError = "The resume name cannot exceed 150 characters.";
      return;
    }

    isDuplicating = true;
    duplicateError = null;

    try {
      await onduplicate(resume, title);
      closeDuplicateModal();
    } catch (error) {
      console.error("Failed to duplicate resume:", error);
      duplicateError = "Could not duplicate the resume. Please try again.";
    } finally {
      isDuplicating = false;
    }
  }

  async function handleDelete() {
    if (isDeleting || isDuplicating) {
      return;
    }

    isDeleting = true;

    try {
      await ondelete(resume._id);
    } finally {
      isDeleting = false;
    }
  }
</script>

<svelte:window onkeydown={handleModalKeydown} />

<div class="resume-card">
  <ResumePreview title={resume.title} subtitle={resume.subtitle} sections={resume.sections} />

  <div class="resume-card-info">
    <p class="resume-card-title">{resume.title}</p>

    <p class="resume-card-meta">
      Updated {new Date(resume.updatedAt).toLocaleDateString()}
    </p>
  </div>

  <div class="resume-card-actions">
    <a class="btn btn-secondary" href={resolve("/editor")} onclick={handleEdit}> Edit </a>

    <button
      type="button"
      class="btn btn-secondary"
      onclick={openDuplicateModal}
      disabled={isDeleting || isDuplicating}
    >
      Duplicate
    </button>

    <button
      type="button"
      class="btn btn-danger"
      onclick={() => void handleDelete()}
      disabled={isDeleting || isDuplicating}
    >
      {isDeleting ? "Deleting…" : "Delete"}
    </button>
  </div>
</div>

{#if showDuplicateModal}
  <div class="modal-backdrop" role="presentation" onclick={handleBackdropClick}>
    <div
      class="duplicate-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`duplicate-title-${resume._id}`}
    >
      <form onsubmit={handleDuplicateSubmit}>
        <div class="modal-header">
          <div>
            <h2 id={`duplicate-title-${resume._id}`}>Duplicate resume</h2>
            <p>Create a copy of “{resume.title}”.</p>
          </div>

          <button
            type="button"
            class="modal-close"
            aria-label="Close duplicate resume modal"
            onclick={closeDuplicateModal}
            disabled={isDuplicating}
          >
            ×
          </button>
        </div>

        <div class="modal-body">
          <label for={`duplicate-name-${resume._id}`}> Resume name </label>

          <input
            id={`duplicate-name-${resume._id}`}
            type="text"
            bind:value={duplicateTitle}
            maxlength="150"
            autocomplete="off"
            disabled={isDuplicating}
          />

          {#if duplicateError}
            <p class="modal-error" role="alert">
              {duplicateError}
            </p>
          {/if}
        </div>

        <div class="modal-actions">
          <button
            type="button"
            class="btn btn-secondary"
            onclick={closeDuplicateModal}
            disabled={isDuplicating}
          >
            Cancel
          </button>

          <button type="submit" class="btn btn-primary" disabled={isDuplicating}>
            {isDuplicating ? "Duplicating…" : "Duplicate resume"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

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
    min-width: 0;
    padding: 0.4rem 0.5rem;
    font-size: 0.78rem;
    white-space: nowrap;
  }

  .resume-card-actions .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-danger {
    background: transparent;
    color: #b91c1c;
    border: 1.5px solid #fecaca;
  }

  .btn-danger:hover:not(:disabled) {
    background: #fef2f2;
  }

  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 1rem;
    background: rgb(15 23 42 / 45%);
  }

  .duplicate-modal {
    width: min(100%, 420px);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    box-shadow: 0 20px 50px rgb(15 23 42 / 20%);
  }

  .modal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.25rem 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .modal-header h2 {
    margin: 0 0 0.25rem;
    font-size: 1.1rem;
    color: var(--color-text);
  }

  .modal-header p {
    margin: 0;
    font-size: 0.82rem;
    color: var(--color-text-muted);
  }

  .modal-close {
    appearance: none;
    border: none;
    background: transparent;
    padding: 0;
    color: var(--color-text-muted);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
  }

  .modal-close:hover:not(:disabled) {
    color: var(--color-text);
  }

  .modal-close:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-body {
    padding: 1.25rem;
  }

  .modal-body label {
    display: block;
    margin-bottom: 0.4rem;
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .modal-body input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--color-border);
    border-radius: calc(var(--radius) * 0.75);
    padding: 0.65rem 0.75rem;
    background: var(--color-bg);
    color: var(--color-text);
    font: inherit;
    font-size: 0.9rem;
  }

  .modal-body input:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 1px;
    border-color: transparent;
  }

  .modal-body input:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  .modal-error {
    margin: 0.5rem 0 0;
    color: #b91c1c;
    font-size: 0.78rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.25rem 1.25rem;
  }

  @media (max-width: 600px) {
    .resume-card-actions {
      flex-wrap: wrap;
    }

    .resume-card-actions .btn {
      flex: 1 1 calc(50% - 0.25rem);
    }

    .resume-card-actions .btn-danger {
      flex-basis: 100%;
    }

    .modal-actions {
      flex-direction: column-reverse;
    }

    .modal-actions .btn {
      width: 100%;
    }
  }
</style>
