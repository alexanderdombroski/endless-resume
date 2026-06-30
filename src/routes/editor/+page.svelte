<script lang="ts">
  import { resolve } from "$app/paths";
  import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
  <title>Editor - Endless Resume</title>
  <meta name="description" content="Edit and tailor your resume with the Endless Resume editor." />
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
      <a class="nav-link" href={resolve("/dashboard")}>Dashboard</a>
      <a class="nav-link active" href={resolve("/editor")}>Editor</a>
      <a class="nav-link nav-cta" href={resolve("/sign-in")}>Sign in / Register</a>
    </nav>
  </div>
</header>

<main class="editor-main">
  <div class="editor-shell">
    <!-- Sidebar panel -->
    <aside class="editor-sidebar" aria-label="Resume sections">
      <div class="sidebar-header">
        <p class="sidebar-label">Sections</p>
      </div>
      <nav class="sidebar-nav" aria-label="Resume section navigation">
        {#each ["Contact", "Summary", "Experience", "Education", "Skills", "Projects", "Certifications"] as section (section)}
          <button class="sidebar-item" disabled>
            <span class="sidebar-item-dot" aria-hidden="true"></span>
            {section}
          </button>
        {/each}
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-coming-soon">
          <span class="coming-soon-badge">Coming soon</span>
          <p>Section navigation will appear here once the editor is live.</p>
        </div>
      </div>
    </aside>

    <!-- Main editor canvas -->
    <section class="editor-canvas" aria-labelledby="editor-title">
      <div class="canvas-body">
        <div class="editor-placeholder" aria-labelledby="editor-title">
          <div class="placeholder-icon" aria-hidden="true">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h1 id="editor-title">Resume Editor</h1>
          <p>
            The full editor is on its way. Soon you'll be able to write and refine your master
            resume, surface the right sections for any role, and export a tailored version in
            seconds.
          </p>
          <a class="btn btn-primary" href={resolve("/dashboard")}>Back to Dashboard</a>
        </div>
      </div>
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
          <p class="panel-suggestions-label">Suggestions</p>
          {#each [1, 2, 3] as i (i)}
            <div class="suggestion-skeleton" aria-hidden="true">
              <div class="sk-line sk-line-long"></div>
              <div class="sk-line sk-line-med"></div>
            </div>
          {/each}
          <p class="panel-hint">Suggestions will appear after you analyze a job posting.</p>
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

  .sidebar-label,
  .panel-suggestions-label {
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
    cursor: not-allowed;
    text-align: left;
    opacity: 0.6;
    font-family: inherit;
  }

  .sidebar-item-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--color-border);
    flex-shrink: 0;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 1rem 1.25rem 0;
  }

  .sidebar-coming-soon {
    background: #fff;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0.875rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .coming-soon-badge {
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

  .sidebar-coming-soon p {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    line-height: 1.5;
    margin: 0;
  }

  /* === Canvas === */
  .editor-canvas {
    display: flex;
    flex-direction: column;
  }

  .canvas-body {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
  }

  .editor-placeholder {
    max-width: 420px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
  }

  .placeholder-icon {
    width: 72px;
    height: 72px;
    display: grid;
    place-items: center;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    color: var(--color-accent);
  }

  .editor-placeholder h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  }

  .editor-placeholder p {
    font-size: 0.9rem;
    color: var(--color-text-muted);
    line-height: 1.7;
    margin: 0;
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
