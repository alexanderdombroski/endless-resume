<script lang="ts">
  import { resolve } from "$app/paths";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import { authClient } from "$lib/auth/auth-client";
  import LoginDialog from "$lib/components/LoginDialog.svelte";

  const session = authClient.useSession();

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
        {#if $session.data?.user}
          <a class="btn btn-secondary" href={resolve("/dashboard")}>Open dashboard</a>
        {:else}
          <a class="btn btn-primary" href={resolve("/#cta-banner")}>Get Started Today!</a>
        {/if}
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
          <div class="placeholder-avatar"></div>
          <div class="placeholder-lines">
            <div class="ph-line ph-line-long"></div>
            <div class="ph-line ph-line-short"></div>
          </div>
        </div>
      </div>

      <div class="mockup tailored">
        <div class="chip chip-bottom">Version control included</div>
        <span class="card-tag card-tag-accent">Tailored version</span>
        <h2>Senior product designer and UX Expert</h2>
        <ul>
          <li>
            Optimized user experience across multiple product lines, leading to 25% increase in user
            satisfaction.
          </li>
          <li>
            Mentored junior designers and facilitated design reviews, resulting in 50% fewer bugs.
          </li>
          <li>Created design systems that improved consistency across 5 development teams.</li>
        </ul>
        <div class="card-footer">
          <div class="placeholder-avatar"></div>
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
          <div class="feature-placeholder" aria-hidden="true"></div>
          <h3>{f.title}</h3>
          <p>{f.body}</p>
        </div>
      {/each}
    </div>
  </section>

  <!-- CTA Banner -->
  <section class="cta-banner" aria-labelledby="cta-title" id="cta-banner">
    <div class="cta-inner">
      <p class="section-label">Get started today</p>
      <h2 id="cta-title">Your next role starts with a better resume.</h2>
      {#if !$session.data?.user}
        <p>Create your free account and build your master resume in under 10 minutes.</p>
        <button class="btn btn-primary" onclick={() => (loginOpen = true)} type="button"
          >Create free account</button
        >
      {/if}
    </div>
  </section>
</main>

<LoginDialog bind:open={loginOpen} />

<Footer />
