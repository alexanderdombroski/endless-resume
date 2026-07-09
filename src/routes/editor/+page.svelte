<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import EditorForm from "$lib/components/editor/EditorForm.svelte";
  import EditorSuggestions from "$lib/components/editor/EditorSuggestions.svelte";
  import type { Resume } from "$lib/schemas";

  // Initialize starter resume with default values matching the type schema
  let resume = $state<Resume>({
    _id: "starter-resume-id",
    title: "Software Engineer Resume",
    subtitle: [
      { label: "Email", value: "alex.dombroski@example.com" },
      { label: "Phone", value: "(415) 555-2671" },
      { label: "LinkedIn", value: "linkedin.com/in/alexdombroski" }
    ],
    sections: [
      {
        type: "text",
        title: "Professional Summary",
        entries: [
          {
            type: "text",
            heading: "",
            content:
              "Results-driven Software Engineer with 4+ years of experience specializing in building responsive, state-of-the-art web applications. Proven track record in optimizing web performance and deploying scalable frontend architectures."
          }
        ]
      },
      {
        type: "timeline",
        title: "Work Experience",
        entries: [
          {
            type: "timeline",
            heading: "Senior Software Engineer",
            subheading: "Tech Innovations Inc.",
            location: "San Francisco, CA",
            startDate: "2022-03",
            endDate: "Present",
            bullets: [
              "Led the migration of a legacy monolithic frontend to SvelteKit, increasing page load speed by 45%.",
              "Implemented an automated CI/CD pipeline reducing release cycle times by 30%.",
              "Collaborated with product designers to build a reusable component library following accessibility guidelines."
            ]
          }
        ]
      },
      {
        type: "timeline",
        title: "Education",
        entries: [
          {
            type: "timeline",
            heading: "B.S. in Computer Science",
            subheading: "Stanford University",
            location: "Stanford, CA",
            startDate: "2018-09",
            endDate: "2022-06",
            bullets: []
          }
        ]
      },
      {
        type: "structured",
        title: "Projects",
        entries: [
          {
            type: "structured",
            heading: "Tailored Resume Builder",
            startDate: "2023-05",
            endDate: "2023-11",
            bullets: [
              "Architected a responsive single-page editor in Svelte 5 for editing multi-section documents.",
              "Designed schemas utilizing Zod to validate document state and font styles on the client-side."
            ]
          }
        ]
      },
      {
        type: "list",
        title: "Skills",
        entries: [
          {
            type: "list",
            heading: "",
            items: [
              "TypeScript",
              "JavaScript",
              "Svelte",
              "SvelteKit",
              "CSS/HTML",
              "Node.js",
              "REST APIs",
              "Git"
            ]
          }
        ]
      }
    ],
    spacing: {
      bullet: 4,
      section: 16
    },
    font: {
      family: "Inter",
      sizes: {
        title: 24,
        heading: 14,
        bullet: 10
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Track the active section index.
  // 0 corresponds to Basics. Section index 0, 1, 2... corresponds to resume.sections indexes.
  let activeSectionIndex = $state<number | null>(0);

  // Track if any field in EditorForm is focused / actively edited
  let isEditing = $state(false);
</script>

<svelte:head>
  <title>Editor - Endless Resume</title>
  <meta name="description" content="Edit and tailor your resume with the Endless Resume editor." />
</svelte:head>

<Header />

<main class="editor-main">
  <div class="editor-shell">
    <!-- Sidebar panel -->
    <aside class="editor-sidebar" aria-label="Resume sections">
      <div class="sidebar-header">
        <p class="sidebar-label">Sections</p>
      </div>
      <nav class="sidebar-nav" aria-label="Resume section navigation">
        <!-- Basics section toggle -->
        <button
          class="sidebar-item"
          class:active={activeSectionIndex === 0 ||
            activeSectionIndex === -1 ||
            activeSectionIndex === null}
          onclick={() => (activeSectionIndex = 0)}
        >
          <span class="sidebar-item-dot" aria-hidden="true"></span>
          Basics & Contact
        </button>

        <!-- Dynamic sections toggle -->
        {#each resume.sections as section, index (index)}
          <button
            class="sidebar-item"
            class:active={activeSectionIndex === index + 1}
            onclick={() => (activeSectionIndex = index + 1)}
          >
            <span class="sidebar-item-dot" aria-hidden="true"></span>
            {section.title || `Section ${index + 1}`}
          </button>
        {/each}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-helper-card">
          <span class="card-badge">Tips</span>
          <p>
            Click sections in this sidebar to quickly jump directly to their fields in the form.
          </p>
        </div>
      </div>
    </aside>

    <!-- Main editor canvas (renders the EditorForm component directly) -->
    <section class="editor-canvas" aria-labelledby="editor-title">
      <EditorForm bind:resume bind:activeSectionIndex bind:isEditing />
    </section>

    <!-- Right panel: job description / AI suggestions -->
    <aside class="editor-panel" aria-label="AI tailoring panel">
      <div class="panel-header">
        <p class="sidebar-label">Tailor for role</p>
      </div>
      <div class="panel-body">
        <div class="panel-field">
          <label class="panel-field-label" for="job-description">Paste job description</label>
          <textarea
            id="job-description"
            class="panel-textarea"
            placeholder="Paste a job posting here and the editor will highlight the most relevant sections of your resume…"
            disabled
            rows="8"></textarea>
        </div>
        <button class="btn btn-primary panel-btn" disabled>Analyze job posting</button>

        <div class="panel-suggestions" aria-label="AI suggestions">
          <EditorSuggestions bind:resume {isEditing} />
        </div>
      </div>
    </aside>
  </div>
</main>

<Footer />

<style>
  /* === Layout shell === */
  .editor-main {
    min-height: calc(100vh - 64px - 72px);
    background: var(--color-bg);
    display: flex;
    flex-direction: column;
  }

  .editor-shell {
    flex: 1;
    display: grid;
    grid-template-columns: 220px 1fr 280px;
    min-height: inherit;
    border-top: 1px solid var(--color-border);
  }

  /* === Sidebar === */
  .editor-sidebar {
    background: var(--color-surface);
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    padding: 1.25rem 0;
    gap: 0.5rem;
  }

  .sidebar-header {
    padding: 0 1.25rem 0.5rem;
  }

  .sidebar-label {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-muted);
    margin: 0;
  }

  .sidebar-nav {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 0.5rem;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    width: 100%;
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s ease;
    font-family: inherit;
    opacity: 0.8;
  }

  .sidebar-item:hover {
    background: rgba(0, 0, 0, 0.03);
    color: var(--color-text);
    opacity: 1;
  }

  .sidebar-item.active {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
    font-weight: 600;
    opacity: 1;
  }

  .sidebar-item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-border);
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .sidebar-item.active .sidebar-item-dot {
    background: var(--color-accent);
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 1rem 1.25rem 0;
  }

  .sidebar-helper-card {
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  }

  .card-badge {
    display: inline-block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-accent);
    background: var(--color-accent-light);
    border: 1px solid var(--color-border);
    border-radius: 4px;
    padding: 0.15rem 0.45rem;
    align-self: flex-start;
  }

  .sidebar-helper-card p {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* === Canvas === */
  .editor-canvas {
    display: flex;
    flex-direction: column;
    background: #f1f5f9;
  }

  /* === Right panel === */
  .editor-panel {
    background: #fff;
    border-left: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
  }

  .panel-header {
    padding: 1.25rem 1.25rem 0.75rem;
    border-bottom: 1px solid var(--color-border);
  }

  .panel-body {
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
  }

  .panel-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .panel-field-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .panel-textarea {
    width: 100%;
    padding: 0.625rem 0.75rem;
    font-size: 0.82rem;
    font-family: inherit;
    color: var(--color-text);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    resize: vertical;
    line-height: 1.6;
    cursor: not-allowed;
    opacity: 0.6;
    box-sizing: border-box;
  }

  .panel-btn {
    width: 100%;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .panel-suggestions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }

  /* === Responsive === */
  @media (max-width: 1024px) {
    .editor-shell {
      grid-template-columns: 200px 1fr;
    }
    .editor-panel {
      display: none;
    }
  }

  @media (max-width: 700px) {
    .editor-shell {
      grid-template-columns: 1fr;
    }
    .editor-sidebar {
      border-right: none;
      border-bottom: 1px solid var(--color-border);
      padding: 1rem;
    }
    .sidebar-nav {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .sidebar-footer {
      display: none;
    }
  }
</style>
