<script lang="ts">
  import { type Snippet } from "svelte";

  interface Props {
    open?: boolean;
    onclose?: () => void;
    title?: string;
    children: Snippet;
    class?: string;
  }

  let {
    open = $bindable(false),
    onclose,
    title,
    children,
    class: className = ""
  }: Props = $props();

  let dialogEl = $state<HTMLDialogElement | null>(null);

  $effect(() => {
    if (!dialogEl) return;
    if (open) {
      dialogEl.showModal();
    } else {
      dialogEl.close();
    }
  });

  function handleDialogClose() {
    open = false;
    onclose?.();
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === dialogEl) {
      handleDialogClose();
    }
  }
</script>

<dialog
  bind:this={dialogEl}
  class="dialog {className}"
  onclose={handleDialogClose}
  onclick={handleBackdropClick}
  aria-modal="true"
  aria-labelledby={title ? "dialog-title" : undefined}
>
  <div class="dialog-panel" role="document">
    {#if title}
      <div class="dialog-header">
        <h2 id="dialog-title" class="dialog-title">{title}</h2>
        <button
          class="dialog-close"
          onclick={handleDialogClose}
          aria-label="Close dialog"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    {:else}
      <button
        class="dialog-close dialog-close-absolute"
        onclick={handleDialogClose}
        aria-label="Close dialog"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    {/if}

    <div class="dialog-body">
      {@render children()}
    </div>
  </div>
</dialog>

<style>
  .dialog {
    position: fixed;
    inset: 0;
    margin: auto;
    padding: 0;
    border: none;
    border-radius: 14px;
    background: transparent;
    max-width: min(480px, 94vw);
    width: 100%;
    max-height: 90dvh;
    overflow: visible;
    box-shadow: none;
  }

  .dialog::backdrop {
    background: rgba(10, 20, 40, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    animation: fade-in 150ms ease;
  }

  .dialog[open] {
    animation: slide-up 200ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .dialog-panel {
    background: #fff;
    border-radius: 14px;
    border: 1px solid var(--color-border, #bfdbfe);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    position: relative;
    max-height: 90dvh;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.25rem 1.5rem 0;
    flex-shrink: 0;
  }

  .dialog-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--color-text, #0d1b3e);
    margin: 0;
  }

  .dialog-close {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    border-radius: 6px;
    color: var(--color-text-muted, #4a6080);
    cursor: pointer;
    transition:
      background 120ms,
      color 120ms;
    flex-shrink: 0;
  }

  .dialog-close:hover {
    background: var(--color-surface, #eff6ff);
    color: var(--color-text, #0d1b3e);
  }

  .dialog-close-absolute {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 1;
  }

  .dialog-body {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-up {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
