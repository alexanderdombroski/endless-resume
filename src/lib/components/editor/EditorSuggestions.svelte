<script lang="ts">
  import type { Resume } from "$lib/schemas";
  import {
    hasEndingPeriod,
    hasStartingPeriod,
    addEndingPeriod,
    removeEndingPeriod,
    addStartingPeriod,
    removeStartingPeriod
  } from "$lib/utils/string";

  // Bindable / reactive props using Svelte 5 runes
  let {
    resume = $bindable(),
    isEditing = false
  }: {
    resume: Resume;
    isEditing: boolean;
  } = $props();

  // --- Bullet Consistency Suggestion State & Helpers ---
  let isPopupDismissed = $state(false);

  // Extract all non-empty bullets reactively
  let allBullets = $derived.by(() => {
    const list: { text: string; sectionIndex: number; entryIndex: number; bulletIndex: number }[] =
      [];
    if (!resume || !resume.sections) return list;
    resume.sections.forEach((section, secIdx) => {
      if (!section.entries) return;
      section.entries.forEach((entry, entryIdx) => {
        if (entry.type === "timeline" || entry.type === "structured") {
          const bullets = entry.bullets;
          if (bullets && Array.isArray(bullets)) {
            bullets.forEach((bullet, bulletIdx) => {
              if (typeof bullet === "string" && bullet.trim() !== "") {
                list.push({
                  text: bullet,
                  sectionIndex: secIdx,
                  entryIndex: entryIdx,
                  bulletIndex: bulletIdx
                });
              }
            });
          }
        }
      });
    });
    return list;
  });

  let totalBulletsCount = $derived(allBullets.length);

  let endsWithPeriodCount = $derived(allBullets.filter((b) => hasEndingPeriod(b.text)).length);

  let startsWithPeriodCount = $derived(allBullets.filter((b) => hasStartingPeriod(b.text)).length);

  // Ending periods are inconsistent if there is a mix of periods and no periods
  let isEndingInconsistent = $derived(
    totalBulletsCount > 1 && endsWithPeriodCount > 0 && endsWithPeriodCount < totalBulletsCount
  );

  // Starting periods are inconsistent if there is a mix of starting with periods and not starting with them
  let isStartingInconsistent = $derived(
    totalBulletsCount > 1 && startsWithPeriodCount > 0 && startsWithPeriodCount < totalBulletsCount
  );

  // Reset the popup dismissal status when new inconsistencies are introduced
  let prevEndingInconsistent = false;
  let prevStartingInconsistent = false;

  $effect(() => {
    if (
      (isEndingInconsistent && !prevEndingInconsistent) ||
      (isStartingInconsistent && !prevStartingInconsistent)
    ) {
      isPopupDismissed = false;
    }
    prevEndingInconsistent = isEndingInconsistent;
    prevStartingInconsistent = isStartingInconsistent;
  });

  function fixEndingPeriods(add: boolean) {
    if (!resume || !resume.sections) return;

    resume.sections = resume.sections.map((section) => {
      if (!section.entries) return section;
      const entries = section.entries.map((entry) => {
        if (entry.type === "timeline" || entry.type === "structured") {
          if (entry.bullets) {
            const newBullets = entry.bullets.map((bullet) => {
              if (typeof bullet !== "string" || bullet.trim() === "") return bullet;
              return add ? addEndingPeriod(bullet) : removeEndingPeriod(bullet);
            });
            return { ...entry, bullets: newBullets };
          }
        }
        return entry;
      });
      return { ...section, entries };
    });
  }

  function fixStartingPeriods(remove: boolean) {
    if (!resume || !resume.sections) return;

    resume.sections = resume.sections.map((section) => {
      if (!section.entries) return section;
      const entries = section.entries.map((entry) => {
        if (entry.type === "timeline" || entry.type === "structured") {
          if (entry.bullets) {
            const newBullets = entry.bullets.map((bullet) => {
              if (typeof bullet !== "string" || bullet.trim() === "") return bullet;
              return remove ? removeStartingPeriod(bullet) : addStartingPeriod(bullet);
            });
            return { ...entry, bullets: newBullets };
          }
        }
        return entry;
      });
      return { ...section, entries };
    });
  }
</script>

<div class="panel-suggestions-wrapper">
  <p class="panel-suggestions-label">Suggestions</p>

  {#if (isEndingInconsistent || isStartingInconsistent) && !isEditing}
    {#if isEndingInconsistent}
      <div class="panel-suggestion-card recommendation-card animate-fade-in">
        <div class="suggestion-card-header">
          <span class="suggestion-icon">📌</span>
          <span class="suggestion-title">Punctuation Consistency</span>
        </div>
        <p class="suggestion-desc">
          Some bullet points end with a period, while others do not ({endsWithPeriodCount} of
          {totalBulletsCount} end with a period). Standardize your formatting for a cleaner, more professional
          look.
        </p>
        <div class="suggestion-actions">
          <button class="btn-tiny btn-primary" onclick={() => fixEndingPeriods(true)}>
            Add periods
          </button>
          <button class="btn-tiny btn-secondary" onclick={() => fixEndingPeriods(false)}>
            Remove periods
          </button>
        </div>
      </div>
    {/if}

    {#if isStartingInconsistent}
      <div
        class="panel-suggestion-card recommendation-card animate-fade-in"
        style="margin-top: 0.5rem;"
      >
        <div class="suggestion-card-header">
          <span class="suggestion-icon">📌</span>
          <span class="suggestion-title">Starting Period Consistency</span>
        </div>
        <p class="suggestion-desc">
          Some bullet points start with a period, while others do not ({startsWithPeriodCount}
          of {totalBulletsCount} start with a period).
        </p>
        <div class="suggestion-actions">
          <button class="btn-tiny btn-primary" onclick={() => fixStartingPeriods(false)}>
            Remove starting periods
          </button>
        </div>
      </div>
    {/if}
  {:else}
    {#each [1, 2, 3] as i (i)}
      <div class="suggestion-skeleton" aria-hidden="true">
        <div class="sk-line sk-line-long"></div>
        <div class="sk-line sk-line-med"></div>
      </div>
    {/each}
    <p class="panel-hint">Suggestions will appear after you analyze a job posting.</p>
  {/if}
</div>

{#if (isEndingInconsistent || isStartingInconsistent) && !isPopupDismissed && !isEditing}
  <div class="suggestion-popup-container" role="dialog" aria-labelledby="popup-title">
    <div class="popup-header">
      <div class="popup-title-group">
        <span class="popup-emoji">✍️</span>
        <h4 id="popup-title">Formatting Suggestion</h4>
      </div>
      <button
        class="popup-close-btn"
        onclick={() => (isPopupDismissed = true)}
        aria-label="Dismiss suggestion"
      >
        ✕
      </button>
    </div>
    <div class="popup-body">
      {#if isEndingInconsistent}
        <div class="popup-suggestion-item">
          <p>
            Your bullet points are inconsistent. <strong>{endsWithPeriodCount}</strong> of
            <strong>{totalBulletsCount}</strong> bullets end with a period.
          </p>
          <div class="popup-actions">
            <button class="btn-small btn-primary" onclick={() => fixEndingPeriods(true)}>
              Add periods to all
            </button>
            <button class="btn-small btn-secondary" onclick={() => fixEndingPeriods(false)}>
              Remove periods from all
            </button>
          </div>
        </div>
      {/if}

      {#if isStartingInconsistent}
        <div class="popup-suggestion-item" class:mt-3={isEndingInconsistent}>
          <p>
            Some bullets start with a period. <strong>{startsWithPeriodCount}</strong> of
            <strong>{totalBulletsCount}</strong> bullets start with a period.
          </p>
          <div class="popup-actions">
            <button class="btn-small btn-primary" onclick={() => fixStartingPeriods(false)}>
              Remove starting periods
            </button>
          </div>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .panel-suggestions-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .panel-suggestions-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin: 0;
  }

  .suggestion-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    padding: 0.75rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 6px;
  }

  .sk-line {
    height: 8px;
    background: var(--color-border);
    border-radius: 4px;
  }

  .sk-line-long {
    width: 80%;
  }
  .sk-line-med {
    width: 55%;
  }

  .panel-hint {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0;
    font-style: italic;
  }

  /* === Suggestion Popup === */
  .suggestion-popup-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
    width: 320px;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 12px;
    box-shadow:
      0 10px 25px -5px rgba(0, 0, 0, 0.1),
      0 8px 10px -6px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.5rem;
  }

  .popup-title-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .popup-title-group h4 {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .popup-emoji {
    font-size: 1.1rem;
  }

  .popup-close-btn {
    background: transparent;
    border: none;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition:
      background 0.15s,
      color 0.15s;
    line-height: 1;
  }

  .popup-close-btn:hover {
    background: rgba(0, 0, 0, 0.05);
    color: var(--color-text);
  }

  .popup-body {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .popup-suggestion-item p {
    margin: 0 0 0.75rem 0;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    line-height: 1.4;
  }

  .popup-suggestion-item strong {
    color: var(--color-text);
  }

  .popup-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .mt-3 {
    margin-top: 0.75rem;
  }

  /* === Recommendation Card in Sidebar === */
  .panel-suggestion-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    transition: box-shadow 0.2s;
  }

  .panel-suggestion-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  }

  .suggestion-card-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .suggestion-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .suggestion-desc {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.4;
    margin: 0;
  }

  .suggestion-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  /* Tiny button styles */
  .btn-tiny {
    padding: 0.25rem 0.5rem;
    font-size: 0.7rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    border: 1px solid var(--color-border);
    background: #fff;
    color: var(--color-text);
    transition: all 0.15s;
  }

  .btn-tiny.btn-primary {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
  }

  .btn-tiny.btn-primary:hover {
    background: var(--color-accent-dark);
  }

  .btn-tiny.btn-secondary:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  /* Small button styles for popup */
  .btn-small {
    padding: 0.35rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    border: 1px solid var(--color-border);
    background: #fff;
    color: var(--color-text);
    transition: all 0.15s;
  }

  .btn-small.btn-primary {
    background: var(--color-accent);
    color: #fff;
    border-color: var(--color-accent);
  }

  .btn-small.btn-primary:hover {
    background: var(--color-accent-dark);
  }

  .btn-small.btn-secondary:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  /* Fade in animation */
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Adjust popup on small screens */
  @media (max-width: 600px) {
    .suggestion-popup-container {
      bottom: 12px;
      right: 12px;
      left: 12px;
      width: auto;
    }
  }
</style>
