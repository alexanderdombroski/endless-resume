<script lang="ts">
  import type { Resume, SubSection } from "$lib/schemas";

  let { title, subtitle, sections }: Pick<Resume, "title" | "subtitle" | "sections"> = $props();

  // Helper to safely extract list items for preview representation
  function getListItems(entries: SubSection[]): string[] {
    const first = entries[0];
    if (first && first.type === "list") {
      return first.items;
    }
    return [];
  }
</script>

<div class="paper-preview-container">
  <div class="paper-preview">
    <!-- Resume Header Section -->
    <div class="preview-header">
      <h4 class="preview-name">{title}</h4>
      <div class="preview-subtitles">
        {#each subtitle as sub, index (index)}
          <span class="preview-sub-item">{sub.label}</span>
        {/each}
      </div>
    </div>

    <!-- Resume Sections (Dynamic Preview) -->
    <div class="preview-sections">
      {#each sections as section (section.title)}
        <div class="preview-section type-{section.type}">
          <h5 class="preview-section-title">{section.title}</h5>

          <div class="preview-entries">
            {#if section.type === "text"}
              <!-- Summary / Statement block -->
              <div class="preview-text-block">
                <div class="skeleton-line w-full"></div>
                <div class="skeleton-line w-95"></div>
                <div class="skeleton-line w-75"></div>
              </div>
            {:else if section.type === "timeline"}
              <!-- Experience / Education timeline entries -->
              <div class="timeline-container">
                {#each section.entries.slice(0, 2) as entry, index (index)}
                  <div class="preview-timeline-entry" data-entry-type={entry.type}>
                    <div class="timeline-dot"></div>
                    <div class="entry-header">
                      <div class="skeleton-line w-50 bold"></div>
                      <div class="skeleton-line w-20 date"></div>
                    </div>
                    <div class="skeleton-line w-35 sub"></div>
                    <div class="preview-bullets">
                      <div class="skeleton-bullet w-90"></div>
                      <div class="skeleton-bullet w-80"></div>
                    </div>
                  </div>
                {/each}
              </div>
            {:else if section.type === "list"}
              <!-- Skills tag cloud / list -->
              <div class="preview-skills-grid">
                {#each getListItems(section.entries).slice(0, 6) as item, index (index)}
                  <div class="preview-skill-pill" title={item}></div>
                {/each}
              </div>
            {:else if section.type === "structured"}
              <!-- Projects / Certifications list -->
              <div class="structured-container">
                {#each section.entries.slice(0, 2) as entry, index (index)}
                  <div class="preview-structured-entry" data-entry-type={entry.type}>
                    <div class="entry-header">
                      <div class="skeleton-line w-60 bold"></div>
                      <div class="skeleton-line w-20 date"></div>
                    </div>
                    <div class="preview-bullets">
                      <div class="skeleton-bullet w-85"></div>
                      <div class="skeleton-bullet w-65"></div>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  /* Page Preview Container (Miniature A4) */
  .paper-preview-container {
    width: 100%;
    aspect-ratio: 1 / 1.414; /* A4 Ratio */
    background: #f8fafc;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid rgba(241, 245, 249, 0.8);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 10px;
    transition: all 0.3s ease;
  }

  /* Lightens when rendered inside a hovered template-card (ResumeTemplate.svelte) */
  :global(.template-card:hover) .paper-preview-container {
    background: #f1f5f9;
  }

  .paper-preview {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    padding: 12px 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    user-select: none;
    pointer-events: none;
    font-size: 8px;
    line-height: 1;
    transform-origin: top center;
  }

  /* Resume Header Layouts */
  .preview-header {
    display: flex;
    flex-direction: column;
    margin-bottom: 4px;
    align-items: flex-start;
  }

  .preview-name {
    margin: 0 0 2px 0;
    font-size: 8px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .preview-subtitles {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }

  .preview-sub-item {
    font-size: 5px;
    color: #64748b;
    background: #f1f5f9;
    padding: 1px 3px;
    border-radius: 2px;
  }

  /* Section Styles */
  .preview-section {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .preview-section-title {
    margin: 0;
    font-size: 6px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #4f46e5;
    border-bottom: 0.5px solid #e2e8f0;
    padding-bottom: 1px;
  }

  .preview-entries {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  /* Skeleton Line Helpers */
  .skeleton-line {
    height: 3px;
    background: #e2e8f0;
    border-radius: 1.5px;
  }

  .skeleton-line.bold {
    background: #94a3b8;
    height: 4px;
  }

  .skeleton-line.date {
    background: #cbd5e1;
    height: 2.5px;
  }

  .skeleton-line.sub {
    background: #cbd5e1;
    height: 3px;
  }

  /* Width Helpers */
  .w-full {
    width: 100%;
  }
  .w-95 {
    width: 95%;
  }
  .w-90 {
    width: 90%;
  }
  .w-85 {
    width: 85%;
  }
  .w-80 {
    width: 80%;
  }
  .w-75 {
    width: 75%;
  }
  .w-65 {
    width: 65%;
  }
  .w-60 {
    width: 60%;
  }
  .w-50 {
    width: 50%;
  }
  .w-40 {
    width: 40%;
  }
  .w-35 {
    width: 35%;
  }
  .w-20 {
    width: 20%;
  }

  /* Bullet Lists Skeletons */
  .preview-bullets {
    display: flex;
    flex-direction: column;
    gap: 1.5px;
    padding-left: 4px;
    margin-top: 1px;
  }

  .skeleton-bullet {
    display: flex;
    align-items: center;
    height: 3px;
  }

  .skeleton-bullet::before {
    content: "";
    display: inline-block;
    width: 2px;
    height: 2px;
    border-radius: 50%;
    background: #cbd5e1;
    margin-right: 3px;
    flex-shrink: 0;
  }

  .skeleton-bullet::after {
    content: "";
    display: block;
    height: 100%;
    background: #e2e8f0;
    border-radius: 1px;
    width: 100%;
  }

  .skeleton-bullet.w-90::after {
    width: 90%;
  }
  .skeleton-bullet.w-85::after {
    width: 85%;
  }
  .skeleton-bullet.w-80::after {
    width: 80%;
  }
  .skeleton-bullet.w-70::after {
    width: 70%;
  }
  .skeleton-bullet.w-65::after {
    width: 65%;
  }

  /* Entry Header Layout */
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 4px;
  }

  /* Timeline Specific Layout */
  .timeline-container {
    display: flex;
    flex-direction: column;
    gap: 3px;
    position: relative;
    padding-left: 5px;
  }

  .timeline-container::before {
    content: "";
    position: absolute;
    left: 1px;
    top: 2px;
    bottom: 2px;
    width: 0.5px;
    background: #cbd5e1;
  }

  .preview-timeline-entry {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .timeline-dot {
    position: absolute;
    left: -5px;
    top: 1.5px;
    width: 2.5px;
    height: 2.5px;
    border-radius: 50%;
    background: #4f46e5;
    border: 0.5px solid #ffffff;
  }

  /* Skills Specific Layout */
  .preview-skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
    margin-top: 1px;
  }

  .preview-skill-pill {
    height: 5px;
    width: 20px;
    border-radius: 2px;
    background: #e0e7ff;
  }

  /* Text Block Specific Layout */
  .preview-text-block {
    display: flex;
    flex-direction: column;
    gap: 1.5px;
  }
</style>
