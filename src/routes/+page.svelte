<script lang="ts">
  import { resolve } from "$app/paths";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import LoginDialog from "$lib/components/LoginDialog.svelte";

  const stats = [
    { label: "One master resume", value: "01" },
    { label: "Tailored versions", value: "∞" },
    { label: "Faster applications", value: "2×" }
  ];

  const features = [
    {
      number: "01",
      title: "Build your master resume",
      body: "Write the definitive version of your experience once — every role, skill, and accomplishment in one place."
    },
    {
      number: "02",
      title: "Target a specific role",
      body: "Paste a job description or choose a focus area and let the editor surface the sections that matter most for that posting."
    },
    {
      number: "03",
      title: "Generate a tailored version",
      body: "Export a clean, role-specific resume in seconds without touching the master copy — keeping every version in sync."
    }
  ];

  let loginOpen = $state(false);
</script>

<Header />

<main>
  <!-- Hero -->
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <p class="eyebrow">Resume builder for focused job searches</p>
      <h1 id="hero-title">
        Endless Resume
        <span class="headline-accent">Build once, tailor forever.</span>
      </h1>
      <p class="lede">
        Keep one strong source resume, then generate role-specific versions without redoing the
        entire document every time a posting changes.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href={resolve("/#how-it-works")}>Start your resume</a>
        <a class="btn btn-secondary" href={resolve("/dashboard")}>Open dashboard</a>
      </div>

      <dl class="stats" aria-label="Product highlights">
        {#each stats as s (s.label)}
          <div class="stat">
            <dd>{s.value}</dd>
            <dt>{s.label}</dt>
          </div>
        {/each}
      </dl>
    </div>

    <div class="hero-visual" aria-hidden="true">
      <div class="mockup master">
        <span class="card-tag">Master resume</span>
        <h2>Strategic product designer</h2>
        <ul>
          <li>Led redesigns across consumer and B2B products</li>
          <li>Built a reusable content system for 12 launches</li>
          <li>Cut handoff time by 35% with tighter workflows</li>
        </ul>
        <div class="card-footer">
          <div class="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
                cx="12"
                cy="7"
                r="4"
              /></svg
            >
          </div>
          <div class="placeholder-lines">
            <div class="ph-line ph-line-long"></div>
            <div class="ph-line ph-line-short"></div>
          </div>
        </div>
      </div>

      <div class="mockup tailored">
        <div class="chip chip-bottom">Version control included</div>
        <span class="card-tag card-tag-accent">Tailored version</span>
        <h2>Senior product designer, AI tools</h2>
        <ul>
          <li>Emphasized prompt workflows and experimentation</li>
          <li>Reordered impact bullets around product metrics</li>
          <li>Matched language to the target job description</li>
        </ul>
        <div class="card-footer">
          <div class="card-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
                cx="12"
                cy="7"
                r="4"
              /></svg
            >
          </div>
          <div class="placeholder-lines">
            <div class="ph-line ph-line-long"></div>
            <div class="ph-line ph-line-short"></div>
          </div>
        </div>
      </div>

      <div class="chip chip-top">ATS-aware edits</div>
    </div>
  </section>

  <!-- How it works -->
  <section class="features" id="how-it-works" aria-labelledby="features-title">
    <div class="features-header">
      <p class="section-label">How it works</p>
      <h2 id="features-title">
        Write the core resume once, then swap in the details that matter for each role.
      </h2>
      <p class="features-lede">
        Endless Resume keeps the master version clean and lets you tailor experience, bullets, and
        keywords for every application without rebuilding the document.
      </p>
    </div>

    <div class="feature-grid">
      {#each features as f (f.number)}
        <div class="feature-card">
          <span class="feature-number">{f.number}</span>
          <div class="feature-icon" aria-hidden="true">
            {#if f.number === "01"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path
                  d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"
                /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                /><line x1="10" y1="9" x2="8" y2="9" /></svg
              >
            {:else if f.number === "02"}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle
                  cx="12"
                  cy="12"
                  r="2"
                /></svg
              >
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path
                  d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"
                /></svg
              >
            {/if}
          </div>
          <h3>{f.title}</h3>
          <p>{f.body}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="cta-banner" aria-labelledby="cta-title">
    <div class="cta-inner">
      <p class="section-label">Get started today</p>
      <h2 id="cta-title">Your next role starts with a better resume.</h2>
      <p>Create your free account and build your master resume in under 10 minutes.</p>
      <button class="btn btn-primary" onclick={() => (loginOpen = true)} type="button"
        >Create free account</button
      >
    </div>
  </section>
</main>

<LoginDialog bind:open={loginOpen} />

<Footer />
