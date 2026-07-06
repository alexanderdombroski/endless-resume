<script lang="ts">
  import type { ResumeTemplate } from "$lib/assets/data/templates";
  import ResumePreview from "./ResumePreview.svelte";

  let {
    templateData,
    selected = false,
    onclick
  }: {
    templateData: ResumeTemplate;
    selected?: boolean;
    onclick?: () => void;
  } = $props();
</script>

<button
  type="button"
  class="template-card"
  class:selected
  {onclick}
  aria-label="Select {templateData.template} template"
>
  <!-- Selected Indicator Checkmark -->
  {#if selected}
    <div class="selected-badge" aria-hidden="true">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  {/if}

  <!-- Page Preview -->
  <ResumePreview
    title={templateData.title}
    subtitle={templateData.subtitle}
    sections={templateData.sections}
  />

  <!-- Template Info Footer -->
  <div class="template-info">
    <span class="template-name">{templateData.template}</span>
    <span class="template-meta">{templateData.sections.length} Sections</span>
  </div>
</button>

<style>
  /* Card Container */
  .template-card {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    background: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 16px;
    padding: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    overflow: hidden;
    outline: none;
  }

  .template-card:hover {
    transform: translateY(-5px);
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(255, 255, 255, 0.9);
    box-shadow:
      0 12px 20px -8px rgba(99, 102, 241, 0.15),
      0 4px 12px -2px rgba(0, 0, 0, 0.05);
  }

  /* Selected State Styles */
  .template-card.selected {
    border-color: #6366f1;
    background: #ffffff;
    box-shadow:
      0 0 0 2px rgba(99, 102, 241, 0.15),
      0 12px 24px -10px rgba(99, 102, 241, 0.25);
  }

  /* Badge styling */
  .selected-badge {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 24px;
    height: 24px;
    background: #6366f1;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
    z-index: 10;
    padding: 5px;
    animation: scaleIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  @keyframes scaleIn {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }

  /* Template Info Footer Styling */
  .template-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-top: 10px;
    padding: 0 4px;
  }

  .template-name {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    transition: color 0.2s ease;
  }

  .template-card:hover .template-name {
    color: #4f46e5;
  }

  .template-meta {
    font-size: 11px;
    color: #64748b;
  }
</style>
