<div class="editor-skeleton" aria-hidden="true">
  <aside class="editor-sidebar editor-sidebar-skeleton">
    <div class="sidebar-header">
      <p class="sidebar-label">Sections</p>
    </div>
    <div class="sidebar-skeleton-list">
      <div class="skeleton-line skeleton-line-lg"></div>
      <div class="skeleton-line skeleton-line-md"></div>
      <div class="skeleton-line skeleton-line-sm"></div>
      <div class="skeleton-line skeleton-line-md"></div>
      <div class="skeleton-line skeleton-line-sm"></div>
    </div>

    <div class="sidebar-footer">
      <div class="sidebar-helper-card skeleton-card">
        <div class="skeleton-line skeleton-line-sm"></div>
        <div class="skeleton-line skeleton-line-md"></div>
        <div class="skeleton-line skeleton-line-lg"></div>
      </div>
    </div>
  </aside>

  <section class="editor-canvas editor-canvas-loading" aria-busy="true">
    <div class="editor-form-skeleton">
      <header class="form-header form-header-skeleton">
        <div class="title-field">
          <div class="skeleton-line skeleton-line-xl"></div>
        </div>
        <div class="actions">
          <button type="button" class="btn save-btn" disabled>Save Changes</button>
        </div>
      </header>

      <div class="form-tabs">
        <button type="button" class="tab-btn active" disabled>Resume Sheet</button>
        <button type="button" class="tab-btn" disabled>Style Settings</button>
      </div>

      <div class="form-scroll-body">
        <div class="paper-workspace paper-workspace-skeleton">
          <div class="paper-page paper-page-skeleton">
            <div class="paper-header section-block paper-header-skeleton">
              <div class="skeleton-line skeleton-line-xl"></div>
              <div class="paper-subtitles-row paper-subtitles-row-skeleton">
                <div class="skeleton-line skeleton-line-md"></div>
                <div class="skeleton-line skeleton-line-md"></div>
                <div class="skeleton-line skeleton-line-sm"></div>
              </div>
            </div>

            <div class="paper-sections paper-sections-skeleton">
              <div class="section-block section-block-skeleton">
                <div class="skeleton-line skeleton-line-lg"></div>
                <div class="skeleton-line skeleton-line-md"></div>
                <div class="skeleton-line skeleton-line-xl"></div>
                <div class="skeleton-line skeleton-line-lg"></div>
              </div>
              <div class="section-block section-block-skeleton">
                <div class="skeleton-line skeleton-line-lg"></div>
                <div class="skeleton-line skeleton-line-md"></div>
                <div class="skeleton-line skeleton-line-md"></div>
                <div class="skeleton-line skeleton-line-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <aside class="editor-panel editor-panel-skeleton">
    <div class="panel-header">
      <p class="sidebar-label">Tailor for role</p>
    </div>
    <div class="panel-body">
      <div class="panel-field">
        <div class="skeleton-line skeleton-line-sm"></div>
        <div class="panel-textarea panel-textarea-skeleton"></div>
      </div>
      <button class="btn btn-primary panel-btn" disabled>Analyze job posting</button>

      <div class="panel-suggestions panel-suggestions-skeleton">
        <div class="skeleton-card">
          <div class="skeleton-line skeleton-line-lg"></div>
          <div class="skeleton-line skeleton-line-md"></div>
          <div class="skeleton-line skeleton-line-sm"></div>
        </div>
        <div class="skeleton-card">
          <div class="skeleton-line skeleton-line-lg"></div>
          <div class="skeleton-line skeleton-line-md"></div>
          <div class="skeleton-line skeleton-line-sm"></div>
        </div>
      </div>
    </div>
  </aside>
</div>

<style>
  .editor-skeleton {
    display: contents;
  }

  .editor-sidebar-skeleton,
  .editor-panel-skeleton {
    pointer-events: none;
  }

  .editor-canvas-loading {
    display: flex;
    flex-direction: column;
    background: #f1f5f9;
    padding: 1rem;
  }

  .editor-form-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 100%;
  }

  .form-header-skeleton,
  .paper-page-skeleton,
  .editor-panel-skeleton .panel-body,
  .editor-sidebar-skeleton {
    opacity: 1;
  }

  .paper-workspace-skeleton {
    flex: 1;
    min-height: 0;
  }

  .paper-page-skeleton {
    min-height: 100%;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: #fff;
    padding: 1.5rem;
    box-shadow: var(--shadow-card);
  }

  .paper-header-skeleton {
    margin-bottom: 2rem;
  }

  .paper-subtitles-row-skeleton {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.9rem;
  }

  .paper-sections-skeleton {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
  }

  .section-block-skeleton {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .sidebar-skeleton-list {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    padding: 0.5rem 1.25rem 0;
  }

  .panel-textarea-skeleton {
    min-height: 170px;
    border-radius: 6px;
    background: linear-gradient(90deg, #eef2f7 25%, #e2e8f0 37%, #eef2f7 63%);
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.4s ease-in-out infinite;
    border: 1px solid var(--color-border);
  }

  .panel-suggestions-skeleton,
  .skeleton-card {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .skeleton-card {
    padding: 0.9rem;
    border: 1px solid var(--color-border);
    border-radius: 10px;
    background: #fff;
  }

  .skeleton-line {
    height: 12px;
    border-radius: 999px;
    background: linear-gradient(90deg, #eef2f7 25%, #e2e8f0 37%, #eef2f7 63%);
    background-size: 400% 100%;
    animation: skeleton-shimmer 1.4s ease-in-out infinite;
  }

  .skeleton-line-sm {
    width: 48%;
  }

  .skeleton-line-md {
    width: 70%;
  }

  .skeleton-line-lg {
    width: 88%;
  }

  .skeleton-line-xl {
    width: min(52%, 360px);
    height: 22px;
  }

  .form-header-skeleton .save-btn:disabled,
  .editor-canvas-loading .tab-btn:disabled,
  .editor-panel-skeleton .panel-btn:disabled {
    opacity: 1;
    cursor: default;
  }

  @keyframes skeleton-shimmer {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: 0 0;
    }
  }
</style>
