<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      <span class="brand-mark brand-mark-sm" aria-hidden="true">ER</span>
      <div class="brand-copy">
        <p class="brand-name">Endless Resume</p>
        <p class="brand-tagline">Resume Editor</p>
      </div>
    </div>
    <nav class="footer-nav" aria-label="Footer">
      <a href={resolve("/")}>Home</a>
      <a href={resolve("/dashboard")}>Dashboard</a>
      <a href={resolve("/sign-in")}>Sign in</a>
    </nav>
    <p class="footer-copy">&copy; {new Date().getFullYear()} Endless Resume</p>
  </div>
</footer>
