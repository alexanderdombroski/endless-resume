<script lang="ts">
  import type { Resume, Section, SubSection, SectionType } from "$lib/schemas";

  // Bindable props using Svelte 5 runes
  let {
    resume = $bindable(),
    activeSectionIndex = $bindable(0),
    isEditing = $bindable(false),
    onSave
  }: {
    resume: Resume;
    activeSectionIndex?: number | null;
    isEditing?: boolean;
    onSave?: () => Promise<void>;
  } = $props();

  // Component UI State
  let activeTab = $state<"content" | "style">("content");

  // New section form state
  let showAddSectionModal = $state(false);
  let newSectionTitle = $state("");
  let newSectionType = $state<SectionType>("timeline");

  // Save button animation state
  let saveStatus = $state<"idle" | "saving" | "saved">("idle");

  async function handleSave() {
    if (!onSave) return;

    saveStatus = "saving";

    try {
      await onSave();
      saveStatus = "saved";
      setTimeout(() => {
        saveStatus = "idle";
      }, 2000);
    } catch {
      saveStatus = "idle";
    }
  }

  // --- Subtitle (Contact info) operations ---
  function addSubtitle() {
    resume.subtitle = [...resume.subtitle, { label: "Contact Field", value: "" }];
  }

  function removeSubtitle(index: number) {
    resume.subtitle = resume.subtitle.filter((_, i) => i !== index);
  }

  // --- Section operations ---
  function addSection() {
    if (!newSectionTitle.trim()) return;

    const newSection: Section = {
      type: newSectionType,
      title: newSectionTitle.trim(),
      entries: []
    };

    resume.sections = [...resume.sections, newSection];
    newSectionTitle = "";
    showAddSectionModal = false;

    // Set active section to the newly added section (index + 1)
    activeSectionIndex = resume.sections.length;
  }

  function removeSection(index: number) {
    if (confirm(`Are you sure you want to delete the "${resume.sections[index].title}" section?`)) {
      resume.sections = resume.sections.filter((_, i) => i !== index);
      activeSectionIndex = 0;
    }
  }

  function moveSectionUp(index: number) {
    if (index === 0) return;
    const list = [...resume.sections];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    resume.sections = list;
    activeSectionIndex = index; // Keep the active section index aligned
  }

  function moveSectionDown(index: number) {
    if (index === resume.sections.length - 1) return;
    const list = [...resume.sections];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    resume.sections = list;
    activeSectionIndex = index + 2;
  }

  // --- Entry operations ---
  function addEntry(secIdx: number) {
    const section = resume.sections[secIdx];
    let newEntry: SubSection;

    if (section.type === "text") {
      newEntry = { type: "text", heading: "", content: "" };
    } else if (section.type === "timeline") {
      newEntry = {
        type: "timeline",
        heading: "New Role / Position",
        subheading: "Company Name",
        location: "Location",
        startDate: "Start Date",
        endDate: "End Date",
        bullets: ["Achievement or responsibility details..."]
      };
    } else if (section.type === "structured") {
      newEntry = {
        type: "structured",
        heading: "Project or Certification Title",
        startDate: "Start Date",
        endDate: "End Date",
        bullets: ["Highlight or result of the project..."]
      };
    } else {
      newEntry = {
        type: "list",
        heading: "Skills Group",
        items: ["Skill Detail 1", "Skill Detail 2"]
      };
    }

    resume.sections[secIdx].entries = [...section.entries, newEntry];
  }

  function removeEntry(secIdx: number, entryIdx: number) {
    resume.sections[secIdx].entries = resume.sections[secIdx].entries.filter(
      (_, i) => i !== entryIdx
    );
  }

  function moveEntryUp(secIdx: number, entryIdx: number) {
    if (entryIdx === 0) return;
    const entries = [...resume.sections[secIdx].entries];
    const temp = entries[entryIdx];
    entries[entryIdx] = entries[entryIdx - 1];
    entries[entryIdx - 1] = temp;
    resume.sections[secIdx].entries = entries;
  }

  function moveEntryDown(secIdx: number, entryIdx: number) {
    const entries = resume.sections[secIdx].entries;
    if (entryIdx === entries.length - 1) return;
    const nextEntries = [...entries];
    const temp = nextEntries[entryIdx];
    nextEntries[entryIdx] = nextEntries[entryIdx + 1];
    nextEntries[entryIdx + 1] = temp;
    resume.sections[secIdx].entries = nextEntries;
  }

  // --- Bullet / Item operations ---
  function addBullet(secIdx: number, entryIdx: number) {
    const entry = resume.sections[secIdx].entries[entryIdx];
    if (entry.type === "timeline" || entry.type === "structured") {
      entry.bullets = [...(entry.bullets || []), ""];
    } else if (entry.type === "list") {
      entry.items = [...(entry.items || []), ""];
    }
    resume.sections = [...resume.sections];
  }

  function removeBullet(secIdx: number, entryIdx: number, bulletIdx: number) {
    const entry = resume.sections[secIdx].entries[entryIdx];
    if (entry.type === "timeline" || entry.type === "structured") {
      entry.bullets = entry.bullets.filter((_, i) => i !== bulletIdx);
    } else if (entry.type === "list") {
      entry.items = entry.items.filter((_, i) => i !== bulletIdx);
    }
    resume.sections = [...resume.sections];
  }

  function moveBulletUp(secIdx: number, entryIdx: number, bulletIdx: number) {
    if (bulletIdx === 0) return;
    const entry = resume.sections[secIdx].entries[entryIdx];
    if (entry.type === "timeline" || entry.type === "structured") {
      const bullets = [...entry.bullets];
      const temp = bullets[bulletIdx];
      bullets[bulletIdx] = bullets[bulletIdx - 1];
      bullets[bulletIdx - 1] = temp;
      entry.bullets = bullets;
    } else if (entry.type === "list") {
      const items = [...entry.items];
      const temp = items[bulletIdx];
      items[bulletIdx] = items[bulletIdx - 1];
      items[bulletIdx - 1] = temp;
      entry.items = items;
    }
    resume.sections = [...resume.sections];
  }

  function moveBulletDown(secIdx: number, entryIdx: number, bulletIdx: number) {
    const entry = resume.sections[secIdx].entries[entryIdx];
    let len = 0;
    if (entry.type === "timeline" || entry.type === "structured") len = entry.bullets.length;
    else if (entry.type === "list") len = entry.items.length;

    if (bulletIdx === len - 1) return;

    if (entry.type === "timeline" || entry.type === "structured") {
      const bullets = [...entry.bullets];
      const temp = bullets[bulletIdx];
      bullets[bulletIdx] = bullets[bulletIdx + 1];
      bullets[bulletIdx + 1] = temp;
      entry.bullets = bullets;
    } else if (entry.type === "list") {
      const items = [...entry.items];
      const temp = items[bulletIdx];
      items[bulletIdx] = items[bulletIdx + 1];
      items[bulletIdx + 1] = temp;
      entry.items = items;
    }
    resume.sections = [...resume.sections];
  }

  // Auto-resize textarea on input to behave like normal document text
  function handleTextareaInput(e: Event) {
    const el = e.currentTarget as HTMLTextAreaElement;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  // Trigger initial resize for textareas on mount or tab change
  function resizeAllTextareas() {
    setTimeout(() => {
      const textareas = document.querySelectorAll(".flat-textarea");
      textareas.forEach((ta) => {
        const el = ta as HTMLTextAreaElement;
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      });
    }, 50);
  }

  $effect(() => {
    if (activeTab === "content") {
      resizeAllTextareas();
    }
  });

  // Watch activeSectionIndex changes from sidebar to perform smooth scroll
  $effect(() => {
    if (activeSectionIndex !== null && activeSectionIndex !== undefined) {
      const elId =
        activeSectionIndex === 0 ? "flat-section-basics" : `flat-section-${activeSectionIndex - 1}`;
      const el = document.getElementById(elId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  let focusTimeout: ReturnType<typeof setTimeout> | undefined;
  let editorFormContainer: HTMLDivElement | null = $state(null);

  function handleFocusIn() {
    clearTimeout(focusTimeout);
    isEditing = true;
  }

  function handleFocusOut() {
    clearTimeout(focusTimeout);
    focusTimeout = setTimeout(() => {
      if (!editorFormContainer?.contains(document.activeElement)) {
        isEditing = false;
      }
    }, 100);
  }
</script>

<div
  bind:this={editorFormContainer}
  class="editor-form-container"
  class:editing={isEditing}
  onfocusin={handleFocusIn}
  onfocusout={handleFocusOut}
>
  <!-- Editor Form Header -->
  <header class="form-header">
    <div class="title-field">
      <input
        type="text"
        bind:value={resume.title}
        class="resume-title-input"
        placeholder="Resume Document Title"
        aria-label="Resume Document Title"
      />
    </div>
    <div class="actions">
      <button
        type="button"
        class="btn save-btn"
        class:saving={saveStatus === "saving"}
        class:saved={saveStatus === "saved"}
        onclick={handleSave}
        disabled={saveStatus === "saving"}
      >
        {#if saveStatus === "idle"}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save Changes
        {:else if saveStatus === "saving"}
          <span class="spinner"></span>
          Saving...
        {:else}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Saved!
        {/if}
      </button>
    </div>
  </header>

  <!-- Editor Form Tabs -->
  <div class="form-tabs">
    <button
      type="button"
      class="tab-btn"
      class:active={activeTab === "content"}
      onclick={() => (activeTab = "content")}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
      Resume Sheet
    </button>
    <button
      type="button"
      class="tab-btn"
      class:active={activeTab === "style"}
      onclick={() => (activeTab = "style")}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
      Style Settings
    </button>
  </div>

  <div class="form-scroll-body" class:slate-workspace={activeTab === "content"}>
    {#if activeTab === "content"}
      <!-- PAPER REPRESENTATION OF RESUME -->
      <div class="paper-workspace">
        <div
          class="paper-page"
          style="font-family: '{resume.font.family}', sans-serif; --spacing-section: {resume.spacing
            .section}px; --spacing-bullet: {resume.spacing.bullet}px; --font-size-title: {resume
            .font.sizes.title}px; --font-size-heading: {resume.font.sizes
            .heading}px; --font-size-bullet: {resume.font.sizes.bullet}px;"
        >
          <!-- BASICS & CONTACT INFO HEADER -->
          <header id="flat-section-basics" class="paper-header section-block">
            <input
              type="text"
              bind:value={resume.title}
              class="flat-input paper-name-input"
              placeholder="Your Full Name"
            />

            <!-- Subtitles Horizontal Row -->
            <div class="paper-subtitles-row">
              {#each resume.subtitle as sub, index (index)}
                {#if index > 0}
                  <span class="sub-sep">|</span>
                {/if}
                <div class="subtitle-flat-item">
                  <!-- Floating popover label editor -->
                  <div class="subtitle-label-popover">
                    <span class="popover-label">Label:</span>
                    <input
                      type="text"
                      bind:value={sub.label}
                      class="flat-input sub-label-input"
                      placeholder="e.g. Email"
                    />
                  </div>

                  <input
                    type="text"
                    bind:value={sub.value}
                    class="flat-input sub-value-input"
                    placeholder={sub.label || "Value"}
                    aria-label={sub.label
                      ? `${sub.label} value`
                      : `Contact field ${index + 1} value`}
                    name={`label-${sub.label}`}
                  />
                  <button
                    type="button"
                    class="tag-delete-btn"
                    onclick={() => removeSubtitle(index)}
                    aria-label={sub.label
                      ? `Remove ${sub.label} field`
                      : `Remove contact field ${index + 1}`}
                    title={sub.label ? `Remove ${sub.label}` : "Remove field"}>✕</button
                  >
                </div>
              {/each}

              <button
                type="button"
                class="flat-add-link"
                aria-label="Add Contact Item"
                title="Add Contact Item"
                onclick={addSubtitle}
                ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  ><path
                    d="M18 3H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3zm1 15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1z"
                  /><path
                    d="M15 11h-2V9a1 1 0 0 0-2 0v2H9a1 1 0 0 0 0 2h2v2a1 1 0 0 0 2 0v-2h2a1 1 0 0 0 0-2z"
                  /></svg
                ></button
              >
            </div>
          </header>

          <!-- DYNAMIC SECTIONS -->
          <div class="paper-sections">
            {#each resume.sections as section, secIdx (secIdx)}
              <div
                id="flat-section-{secIdx}"
                class="section-block"
                style="margin-bottom: var(--spacing-section);"
              >
                <!-- Floating Toolbar on Left Margin -->
                <div class="floating-toolbar section-toolbar">
                  <button
                    type="button"
                    class="tool-btn"
                    disabled={secIdx === 0}
                    onclick={(e) => {
                      e.stopPropagation();
                      moveSectionUp(secIdx);
                    }}
                    title="Move Section Up">▲</button
                  >
                  <button
                    type="button"
                    class="tool-btn"
                    disabled={secIdx === resume.sections.length - 1}
                    onclick={(e) => {
                      e.stopPropagation();
                      moveSectionDown(secIdx);
                    }}
                    title="Move Section Down">▼</button
                  >
                  <button
                    type="button"
                    class="tool-btn delete"
                    onclick={(e) => {
                      e.stopPropagation();
                      removeSection(secIdx);
                    }}
                    title="Delete Section">✕</button
                  >
                  <button
                    type="button"
                    class="tool-btn add"
                    onclick={(e) => {
                      e.stopPropagation();
                      addEntry(secIdx);
                    }}
                    title="Add Entry">+ Entry</button
                  >
                </div>

                <!-- Section Flat Header -->
                <div class="section-flat-header">
                  <input
                    type="text"
                    bind:value={section.title}
                    class="flat-input section-title-input"
                    placeholder="Section Title"
                  />
                </div>

                <!-- Section Entries -->
                <div class="entries-flat-list">
                  {#if section.entries.length === 0}
                    <div class="flat-empty-state">
                      <span
                        >Empty Section. Click "+ Entry" in the left margin toolbar to add content.</span
                      >
                    </div>
                  {/if}

                  {#each section.entries as entry, entryIdx (entryIdx)}
                    <div class="entry-block">
                      <!-- Floating Toolbar on Right Margin -->
                      <div class="floating-toolbar entry-toolbar">
                        <button
                          type="button"
                          class="tool-btn"
                          disabled={entryIdx === 0}
                          onclick={(e) => {
                            e.stopPropagation();
                            moveEntryUp(secIdx, entryIdx);
                          }}
                          title="Move Entry Up">▲</button
                        >
                        <button
                          type="button"
                          class="tool-btn"
                          disabled={entryIdx === section.entries.length - 1}
                          onclick={(e) => {
                            e.stopPropagation();
                            moveEntryDown(secIdx, entryIdx);
                          }}
                          title="Move Entry Down">▼</button
                        >
                        <button
                          type="button"
                          class="tool-btn delete"
                          onclick={(e) => {
                            e.stopPropagation();
                            removeEntry(secIdx, entryIdx);
                          }}
                          title="Delete Entry">✕</button
                        >
                        {#if entry.type === "timeline" || entry.type === "structured" || entry.type === "list"}
                          <button
                            type="button"
                            class="tool-btn add"
                            onclick={(e) => {
                              e.stopPropagation();
                              addBullet(secIdx, entryIdx);
                            }}
                            title="Add Detail">+ Item</button
                          >
                        {/if}
                      </div>

                      {#if entry.type === "timeline"}
                        <!-- TIMELINE LAYOUT (Job, Education) -->
                        <div class="timeline-entry-grid">
                          <div class="row-main">
                            <input
                              type="text"
                              bind:value={entry.heading}
                              class="flat-input bold entry-heading"
                              placeholder="Job Title or Degree"
                            />
                            <div class="date-range">
                              <input
                                type="text"
                                bind:value={entry.startDate}
                                class="flat-input date"
                                placeholder="Start"
                              />
                              <span class="date-sep">–</span>
                              <input
                                type="text"
                                bind:value={entry.endDate}
                                class="flat-input date"
                                placeholder="End"
                              />
                            </div>
                          </div>
                          <div class="row-sub">
                            <input
                              type="text"
                              bind:value={entry.subheading}
                              class="flat-input italic entry-subheading"
                              placeholder="Company or Institution Name"
                            />
                            <input
                              type="text"
                              bind:value={entry.location}
                              class="flat-input right-align entry-location"
                              placeholder="Location"
                            />
                          </div>
                        </div>

                        <!-- Bullets List -->
                        <ul class="bullets-flat-list">
                          <!-- eslint-disable-next-line -- @typescript-eslint/no-unused-vars -->
                          {#each entry.bullets as bullet, bulletIdx (bulletIdx)}
                            <li class="bullet-item" style="margin-bottom: var(--spacing-bullet);">
                              <div class="bullet-controls">
                                <button
                                  type="button"
                                  class="bullet-tool-btn"
                                  disabled={bulletIdx === 0}
                                  onclick={() => moveBulletUp(secIdx, entryIdx, bulletIdx)}
                                  >▲</button
                                >
                                <button
                                  type="button"
                                  class="bullet-tool-btn"
                                  disabled={bulletIdx === entry.bullets.length - 1}
                                  onclick={() => moveBulletDown(secIdx, entryIdx, bulletIdx)}
                                  >▼</button
                                >
                                <button
                                  type="button"
                                  class="bullet-tool-btn delete"
                                  onclick={() => removeBullet(secIdx, entryIdx, bulletIdx)}
                                  >✕</button
                                >
                              </div>
                              <textarea
                                bind:value={entry.bullets[bulletIdx]}
                                oninput={handleTextareaInput}
                                class="flat-textarea bullet-textarea"
                                rows="1"
                                placeholder="Describe contribution or responsibility..."></textarea>
                            </li>
                          {/each}
                        </ul>
                      {:else if entry.type === "structured"}
                        <!-- STRUCTURED LAYOUT (Projects, Certifications) -->
                        <div class="structured-entry-grid">
                          <div class="row-main">
                            <input
                              type="text"
                              bind:value={entry.heading}
                              class="flat-input bold entry-heading"
                              placeholder="Project Name or Certificate"
                            />
                            <div class="date-range">
                              <input
                                type="text"
                                bind:value={entry.startDate}
                                class="flat-input date"
                                placeholder="Start"
                              />
                              <span class="date-sep">–</span>
                              <input
                                type="text"
                                bind:value={entry.endDate}
                                class="flat-input date"
                                placeholder="End"
                              />
                            </div>
                          </div>
                        </div>

                        <!-- Bullets List -->
                        <ul class="bullets-flat-list">
                          <!-- eslint-disable-next-line -- @typescript-eslint/no-unused-vars -->
                          {#each entry.bullets as bullet, bulletIdx (bulletIdx)}
                            <li class="bullet-item" style="margin-bottom: var(--spacing-bullet);">
                              <div class="bullet-controls">
                                <button
                                  type="button"
                                  class="bullet-tool-btn"
                                  disabled={bulletIdx === 0}
                                  onclick={() => moveBulletUp(secIdx, entryIdx, bulletIdx)}
                                  >▲</button
                                >
                                <button
                                  type="button"
                                  class="bullet-tool-btn"
                                  disabled={bulletIdx === entry.bullets.length - 1}
                                  onclick={() => moveBulletDown(secIdx, entryIdx, bulletIdx)}
                                  >▼</button
                                >
                                <button
                                  type="button"
                                  class="bullet-tool-btn delete"
                                  onclick={() => removeBullet(secIdx, entryIdx, bulletIdx)}
                                  >✕</button
                                >
                              </div>
                              <textarea
                                bind:value={entry.bullets[bulletIdx]}
                                oninput={handleTextareaInput}
                                class="flat-textarea bullet-textarea"
                                rows="1"
                                placeholder="Highlight a project key result or tech stack details..."
                              ></textarea>
                            </li>
                          {/each}
                        </ul>
                      {:else if entry.type === "list"}
                        <!-- LIST LAYOUT (Skills, Languages) -->
                        <div class="list-entry-flat">
                          {#if entry.heading !== undefined}
                            <input
                              type="text"
                              bind:value={entry.heading}
                              class="flat-input bold list-heading"
                              placeholder="Skills Group Name"
                            />
                          {/if}
                          <div class="skills-flat-grid">
                            <!-- eslint-disable-next-line -- @typescript-eslint/no-unused-vars -->
                            {#each entry.items as item, itemIdx (itemIdx)}
                              <div class="skill-flat-tag">
                                <input
                                  type="text"
                                  bind:value={entry.items[itemIdx]}
                                  class="flat-input skill-tag-input"
                                  placeholder="Skill"
                                />
                                <button
                                  type="button"
                                  class="tag-delete-btn"
                                  onclick={() => removeBullet(secIdx, entryIdx, itemIdx)}
                                  title="Delete tag">✕</button
                                >
                              </div>
                            {/each}
                          </div>
                        </div>
                      {:else if entry.type === "text"}
                        <!-- TEXT LAYOUT (Professional Summary) -->
                        <div class="text-entry-flat">
                          {#if entry.heading}
                            <input
                              type="text"
                              bind:value={entry.heading}
                              class="flat-input bold text-heading"
                              placeholder="Heading"
                            />
                          {/if}
                          <textarea
                            bind:value={entry.content}
                            oninput={handleTextareaInput}
                            class="flat-textarea content-textarea"
                            rows="3"
                            placeholder="Write summary paragraph or general text content here..."
                          ></textarea>
                        </div>
                      {/if}
                    </div>
                  {/each}
                </div>
              </div>
            {/each}

            <!-- Bottom Add Section link on paper -->
            <div class="add-section-footer">
              <button
                type="button"
                class="btn btn-secondary-accent btn-small"
                onclick={() => (showAddSectionModal = true)}
              >
                + Add Resume Section
              </button>
            </div>
          </div>
        </div>
      </div>
    {:else if activeTab === "style"}
      <!-- STYLE SETTINGS -->
      <div class="style-settings-panel">
        <section class="form-section-card open">
          <div class="section-card-header">
            <div class="header-title">
              <span class="step-num">Aa</span>
              <h3>Typography Settings</h3>
            </div>
          </div>
          <div class="section-card-content">
            <div class="field-group">
              <label for="font-family">Font Family</label>
              <select id="font-family" bind:value={resume.font.family} class="form-select">
                <option value="Inter">Inter (Modern Sans)</option>
                <option value="Roboto">Roboto (Clean Sans)</option>
                <option value="Merriweather">Merriweather (Premium Serif)</option>
                <option value="Playfair Display">Playfair Display (Elegant Serif)</option>
                <option value="Fira Code">Fira Code (Developer Monospace)</option>
                <option value="Georgia">Georgia (Classic Serif)</option>
                <option value="system-ui">System Default</option>
              </select>
            </div>

            <div class="style-slider-group">
              <div class="slider-field">
                <div class="slider-labels">
                  <label for="font-title-size">Title Font Size (Name)</label>
                  <span class="slider-value">{resume.font.sizes.title}px</span>
                </div>
                <input
                  id="font-title-size"
                  type="range"
                  min="18"
                  max="36"
                  step="1"
                  bind:value={resume.font.sizes.title}
                  class="form-range"
                />
              </div>

              <div class="slider-field">
                <div class="slider-labels">
                  <label for="font-heading-size">Section Heading Size</label>
                  <span class="slider-value">{resume.font.sizes.heading}px</span>
                </div>
                <input
                  id="font-heading-size"
                  type="range"
                  min="12"
                  max="22"
                  step="1"
                  bind:value={resume.font.sizes.heading}
                  class="form-range"
                />
              </div>

              <div class="slider-field">
                <div class="slider-labels">
                  <label for="font-bullet-size">Body / Bullet Size</label>
                  <span class="slider-value">{resume.font.sizes.bullet}px</span>
                </div>
                <input
                  id="font-bullet-size"
                  type="range"
                  min="8"
                  max="14"
                  step="0.5"
                  bind:value={resume.font.sizes.bullet}
                  class="form-range"
                />
              </div>
            </div>
          </div>
        </section>

        <section class="form-section-card open">
          <div class="section-card-header">
            <div class="header-title">
              <span class="step-num">↔</span>
              <h3>Spacing Settings</h3>
            </div>
          </div>
          <div class="section-card-content">
            <div class="style-slider-group">
              <div class="slider-field">
                <div class="slider-labels">
                  <label for="spacing-section">Section Spacing</label>
                  <span class="slider-value">{resume.spacing.section}px</span>
                </div>
                <input
                  id="spacing-section"
                  type="range"
                  min="8"
                  max="32"
                  step="1"
                  bind:value={resume.spacing.section}
                  class="form-range"
                />
              </div>

              <div class="slider-field">
                <div class="slider-labels">
                  <label for="spacing-bullet">Bullet Spacing</label>
                  <span class="slider-value">{resume.spacing.bullet}px</span>
                </div>
                <input
                  id="spacing-bullet"
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  bind:value={resume.spacing.bullet}
                  class="form-range"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    {/if}
  </div>
</div>

<!-- Add Section Dialog (Overlay Modal) -->
{#if showAddSectionModal}
  <div class="modal-backdrop-container">
    <button
      type="button"
      class="modal-backdrop"
      onclick={() => (showAddSectionModal = false)}
      aria-label="Close dialog"
    ></button>
    <div
      class="modal-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabindex="-1"
      onkeydown={(e) => e.key === "Escape" && (showAddSectionModal = false)}
    >
      <h3 id="modal-title">Add New Section</h3>
      <div class="field-group">
        <label for="modal-sec-title">Section Title</label>
        <input
          id="modal-sec-title"
          type="text"
          bind:value={newSectionTitle}
          class="form-input"
          placeholder="e.g. Certifications, Awards, Languages"
          onkeydown={(e) => e.key === "Enter" && addSection()}
        />
      </div>
      <div class="field-group">
        <label for="modal-sec-type">Section Layout Type</label>
        <select id="modal-sec-type" bind:value={newSectionType} class="form-select">
          <option value="timeline">Timeline (Job history, Education with subtitle & dates)</option>
          <option value="structured"
            >Structured (Projects, certifications with heading & dates)</option
          >
          <option value="list">List (Skills, tags, simple list rows)</option>
          <option value="text">Text (Markdown/Summary paragraphs)</option>
        </select>
      </div>
      <div class="modal-actions">
        <button
          type="button"
          class="btn btn-secondary"
          onclick={() => (showAddSectionModal = false)}
        >
          Cancel
        </button>
        <button
          type="button"
          class="btn btn-primary"
          onclick={addSection}
          disabled={!newSectionTitle.trim()}
        >
          Create Section
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .editor-form-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background: #ffffff;
    box-sizing: border-box;
  }

  /* Form Header Styles */
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--color-border);
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  }

  .resume-title-input {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--color-text);
    border: 1px solid transparent;
    background: transparent;
    padding: 0.35rem 0.6rem;
    border-radius: 6px;
    width: 280px;
    transition: all 0.2s;
  }

  .resume-title-input:hover {
    border-color: var(--color-border);
    background: #fff;
  }

  .resume-title-input:focus {
    outline: none;
    border-color: var(--color-accent);
    background: #fff;
    box-shadow: 0 0 0 3px var(--color-accent-light);
  }

  .save-btn {
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s ease;
  }

  .save-btn:hover {
    background: var(--color-accent-dark);
  }

  .save-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .save-btn.saving {
    background: #64748b;
  }

  .save-btn.saved {
    background: #10b981;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Tabs Styles */
  .form-tabs {
    display: flex;
    border-bottom: 1px solid var(--color-border);
    background: #f8fafc;
    padding: 0 1rem;
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.85rem 1.25rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-text-muted);
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
  }

  .tab-btn:hover {
    color: var(--color-text);
    background: rgba(0, 0, 0, 0.02);
  }

  .tab-btn.active {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
  }

  /* Form Scroll Container */
  .form-scroll-body {
    flex: 1;
    overflow-y: auto;
    background: #ffffff;
    display: flex;
    flex-direction: column;
  }

  .form-scroll-body.slate-workspace {
    background: #f1f5f9;
  }

  /* --- STYLE PANEL LAYOUT --- */
  .style-settings-panel {
    max-width: 600px;
    width: 100%;
    margin: 2rem auto;
    padding: 0 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-sizing: border-box;
  }

  .form-section-card {
    background: #ffffff;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.05),
      0 2px 4px -1px rgba(0, 0, 0, 0.02);
    overflow: hidden;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .form-section-card.open {
    border-color: #cbd5e1;
  }

  .section-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    background: #ffffff;
    border-bottom: 1px solid #f1f5f9;
  }

  .header-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .step-num {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--color-accent);
    background: var(--color-accent-light);
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }

  .header-title h3 {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .section-card-content {
    padding: 1.5rem;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Style Fields */
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .field-group label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .form-select,
  .form-input {
    width: 100%;
    padding: 0.55rem 0.75rem;
    font-size: 0.85rem;
    font-family: inherit;
    color: var(--color-text);
    background: #fff;
    border: 1.5px solid var(--color-border);
    border-radius: 6px;
    box-sizing: border-box;
    transition: all 0.2s;
  }

  .form-select:focus,
  .form-input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-light);
  }

  .style-slider-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .slider-field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .slider-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .slider-labels label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .slider-value {
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--color-accent);
    background: var(--color-accent-light);
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
  }

  .form-range {
    width: 100%;
    accent-color: var(--color-accent);
    cursor: pointer;
  }

  /* --- FLAT PAPER EXPERIENCE STYLES --- */
  .paper-workspace {
    width: 100%;
    padding: 3rem 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  .paper-page {
    background: #ffffff;
    width: 100%;
    max-width: 820px;
    min-height: 1060px; /* Golden A4 ratio approx */
    box-shadow:
      0 10px 30px -10px rgba(0, 0, 0, 0.08),
      0 1px 3px rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 4px;
    padding: 4.5rem 4rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    box-sizing: border-box;
  }

  /* Flat Inline Inputs */
  .flat-input,
  .flat-textarea {
    border: 1px dashed transparent;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    color: inherit;
    padding: 2px 4px;
    margin: 0;
    border-radius: 4px;
    transition: all 0.15s;
    box-sizing: border-box;
  }

  .flat-input:hover,
  .flat-textarea:hover {
    border-color: #cbd5e1;
    background: rgba(241, 245, 249, 0.6);
  }

  .flat-input:focus,
  .flat-textarea:focus {
    outline: none;
    border-color: var(--color-accent);
    background: #ffffff;
    box-shadow: 0 0 0 2.5px var(--color-accent-light);
  }

  /* Paper Header layout */
  .paper-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 2px solid var(--color-text);
    padding-bottom: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .paper-name-input {
    font-size: var(--font-size-title);
    font-weight: 800;
    text-align: center;
    color: var(--color-text);
    width: 90%;
    letter-spacing: -0.01em;
  }

  .paper-subtitles-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 0.25rem;
  }

  .sub-sep {
    color: var(--color-border);
    margin: 0 0.35rem;
    font-weight: 400;
    user-select: none;
    font-size: 0.75rem;
  }

  .subtitle-flat-item {
    display: flex;
    align-items: center;
    position: relative;
  }

  .sub-value-input {
    font-size: 0.75rem;
    text-align: center;
    padding: 1px 3px;
    min-width: 3ch;
    width: auto;
    field-sizing: content;
  }

  /* Tooltip Popover for editing the label */
  .subtitle-label-popover {
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%) translateY(4px);
    display: flex;
    align-items: center;
    gap: 4px;
    background: #1e293b;
    color: #ffffff;
    border-radius: 6px;
    padding: 4px 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    opacity: 0;
    pointer-events: none;
    /* Delay hide so crossing the gap doesn't dismiss the popover */
    transition:
      opacity 0.15s ease 0.18s,
      transform 0.15s ease 0.18s;
    font-size: 0.7rem;
    z-index: 100;
    white-space: nowrap;
  }

  /* Invisible bridge that fills the gap between popover bottom and the input,
     keeping the hover active while the mouse travels between them */
  .subtitle-label-popover::before {
    content: "";
    position: absolute;
    top: 100%;
    left: -8px;
    right: -8px;
    /* Tall enough to cover the 6px gap plus the arrow (8px total) */
    height: 16px;
  }

  .subtitle-label-popover::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: #1e293b transparent transparent transparent;
    /* Sit on top of the bridge */
    z-index: 1;
  }

  .popover-label {
    font-weight: 600;
    color: #94a3b8;
  }

  .subtitle-label-popover .sub-label-input {
    width: 70px;
    font-size: 0.7rem;
    color: #ffffff;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 1px 4px;
  }

  .subtitle-label-popover .sub-label-input:focus {
    background: #ffffff;
    color: #0f172a;
    border-color: var(--color-accent);
    box-shadow: none;
  }

  /* Reveal popover on hover or focus within — no delay on show */
  .subtitle-flat-item:hover .subtitle-label-popover,
  .subtitle-flat-item:focus-within .subtitle-label-popover {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    pointer-events: auto;
    transition:
      opacity 0.1s ease 0s,
      transform 0.1s ease 0s;
  }

  .tag-delete-btn {
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    cursor: pointer;
    font-size: 0.65rem;
    display: grid;
    place-items: center;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.15s;
  }

  .tag-delete-btn:hover {
    background: #fee2e2;
    color: #ef4444;
  }

  .flat-add-link {
    background: transparent;
    border: none;
    color: var(--color-accent);
    line-height: 0;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background 0.15s;
  }

  .flat-add-link:hover {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
  }

  /* Paper dynamic sections styling */
  .paper-sections {
    display: flex;
    flex-direction: column;
  }

  /* Hover Block wrappers */
  .section-block {
    position: relative;
    padding: 0.25rem 0;
  }

  .section-flat-header {
    border-bottom: 1.5px solid var(--color-text);
    padding-bottom: 2px;
    margin-bottom: 0.75rem;
    color: var(--color-text);
  }

  .section-title-input {
    font-size: var(--font-size-heading);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    width: 100%;
    color: inherit;
  }

  .entries-flat-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .flat-empty-state {
    padding: 1.5rem;
    background: #f8fafc;
    border: 1px dashed var(--color-border);
    border-radius: 6px;
    color: var(--color-text-muted);
    font-size: 0.8rem;
    text-align: center;
  }

  .entry-block {
    position: relative;
    transition: background 0.2s;
    border-radius: 4px;
  }

  .entry-block:hover {
    background: rgba(99, 102, 241, 0.015);
  }

  /* Timeline Grid Layout */
  .timeline-entry-grid,
  .structured-entry-grid {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    margin-bottom: 0.35rem;
  }

  .row-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .entry-heading {
    flex: 1;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .date-range {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 0.82rem;
    color: var(--color-text-muted);
  }

  .flat-input.date {
    width: 80px;
    text-align: right;
    font-size: 0.8rem;
  }

  .date-sep {
    color: var(--color-text-muted);
    user-select: none;
  }

  .row-sub {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    font-size: 0.85rem;
  }

  .entry-subheading {
    flex: 1;
    font-style: italic;
    color: var(--color-text-muted);
  }

  .entry-location {
    width: 140px;
    text-align: right;
    color: var(--color-text-muted);
  }

  /* Bullet points list */
  .bullets-flat-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .bullet-item {
    position: relative;
    padding-left: 1.25rem;
  }

  .bullet-item::before {
    content: "•";
    position: absolute;
    left: 0.35rem;
    top: 3px;
    color: var(--color-text);
    font-size: 1rem;
    line-height: 1;
  }

  .bullet-textarea {
    width: 100%;
    resize: none;
    font-family: inherit;
    font-size: var(--font-size-bullet);
    line-height: 1.6;
    padding: 2px 4px;
    overflow: hidden;
  }

  /* Bullet toolbar controls */
  .bullet-controls {
    position: absolute;
    left: -54px;
    top: 4px;
    display: flex;
    gap: 1px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease 0s;
    z-index: 10;
  }

  /* Invisible bridge: extends hover zone rightward to reach the bullet-item */
  .bullet-controls::after {
    content: "";
    position: absolute;
    top: 0;
    left: 100%;
    width: 60px;
    height: 100%;
  }

  .bullet-item:hover .bullet-controls,
  .bullet-controls:hover {
    opacity: 1;
    pointer-events: auto;
  }

  .bullet-tool-btn {
    border: 1px solid var(--color-border);
    background: #ffffff;
    border-radius: 4px;
    width: 16px;
    height: 16px;
    font-size: 0.55rem;
    display: grid;
    place-items: center;
    cursor: pointer;
    color: var(--color-text-muted);
  }

  .bullet-tool-btn:hover {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
  }

  .bullet-tool-btn.delete:hover {
    background: #fee2e2;
    color: #ef4444;
  }

  /* List / Skills block styling */
  .list-entry-flat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem 0;
  }

  .list-heading {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .skills-flat-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .skill-flat-tag {
    display: flex;
    align-items: center;
    background: var(--color-surface);
    border: 1.5px solid var(--color-border);
    border-radius: 6px;
    padding: 0.15rem 0.5rem;
    font-size: var(--font-size-bullet);
    position: relative;
    padding-right: 20px;
    gap: 4px;
  }

  .skill-flat-tag:hover .tag-delete-btn {
    opacity: 1;
    pointer-events: auto;
  }

  .skill-tag-input {
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
    font-size: inherit !important;
    color: var(--color-text);
    font-weight: 500;
    width: 80px;
    text-align: left;
  }

  .skill-tag-input:focus {
    box-shadow: none !important;
  }

  /* Text Summary block styling */
  .text-entry-flat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.25rem 0;
  }

  .text-heading {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .content-textarea {
    width: 100%;
    resize: none;
    font-family: inherit;
    font-size: var(--font-size-bullet);
    line-height: 1.6;
    overflow: hidden;
  }

  /* Floating Toolbars */
  .floating-toolbar {
    position: absolute;
    display: flex;
    gap: 3px;
    background: #ffffff;
    border: 1.5px solid var(--color-border);
    border-radius: 6px;
    padding: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.12s ease 0s,
      transform 0.12s ease 0s;
    z-index: 50;
  }

  /* Section block toolbars */
  .section-toolbar {
    left: -52px;
    top: 4px;
    flex-direction: column;
    transform: translateX(0);
  }

  /* Invisible bridge: extends hover zone rightward to reach the section-block */
  .section-toolbar::after {
    content: "";
    position: absolute;
    top: 0;
    left: 100%;
    width: 58px;
    height: 100%;
    min-height: 40px;
  }

  .section-block:hover .section-toolbar,
  .section-toolbar:hover {
    opacity: 1;
    pointer-events: auto;
  }

  /* Entry block toolbars */
  .entry-toolbar {
    right: -52px;
    top: 4px;
    flex-direction: column;
    transform: translateX(0);
  }

  /* Invisible bridge: extends hover zone leftward to reach the entry-block */
  .entry-toolbar::before {
    content: "";
    position: absolute;
    top: 0;
    right: 100%;
    width: 58px;
    height: 100%;
    min-height: 40px;
  }

  .entry-block:hover .entry-toolbar,
  .entry-toolbar:hover {
    opacity: 1;
    pointer-events: auto;
  }

  .tool-btn {
    display: grid;
    place-items: center;
    width: 36px;
    height: 28px;
    margin-inline: auto;
    white-space: nowrap;
    border: none;
    background: transparent;
    color: var(--color-text-muted);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.7rem;
    font-weight: bold;
    transition: all 0.12s;
  }

  .tool-btn:hover {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
  }

  .tool-btn.delete:hover {
    background: #fee2e2;
    color: #ef4444;
  }

  /* Add buttons fill the full toolbar width so text is always centered */
  .tool-btn.add {
    width: 100%;
    padding: 0 4px;
  }

  .tool-btn.add:hover {
    background: #ecfdf5;
    color: #059669;
  }

  .add-section-footer {
    display: flex;
    justify-content: center;
    border-top: 1.5px dashed var(--color-border);
    padding-top: 1.5rem;
    margin-top: 2rem;
  }

  .btn-secondary-accent {
    background: var(--color-accent-light);
    color: var(--color-accent-dark);
    border: 1px solid #bfdbfe;
  }

  .btn-secondary-accent:hover {
    background: #c7d2fe;
    color: var(--color-accent-dark);
  }

  /* Modal Backdrop and Dialog */
  .modal-backdrop-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  button.modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(4px);
    border: none;
    padding: 0;
    margin: 0;
    z-index: -1;
    cursor: default;
    animation: fadeIn 0.2s ease-out;
  }

  .modal-dialog {
    background: #ffffff;
    border-radius: 12px;
    padding: 1.75rem;
    width: 100%;
    max-width: 450px;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    animation: slideUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .modal-dialog h3 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 800;
    color: var(--color-text);
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 0.75rem;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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

  /* Responsive tweaks */
  @media (max-width: 1000px) {
    .section-toolbar {
      left: 0;
      top: -28px;
      flex-direction: row;
    }
    .entry-toolbar {
      right: 0;
      top: -28px;
      flex-direction: row;
    }
    .paper-page {
      padding: 3rem 2rem;
    }
  }

  @media (max-width: 600px) {
    .paper-subtitles-row {
      flex-direction: column;
      align-items: center;
      gap: 0.15rem;
    }
    .sub-sep {
      display: none;
    }
  }
</style>
