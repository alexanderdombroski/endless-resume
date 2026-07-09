<script lang="ts">
  import { authClient } from "$lib/auth/auth-client";
  import { resolve } from "$app/paths";
  import { goto } from "$app/navigation";

  const session = authClient.useSession();

  let open = $state(false);
  let btnEl = $state<HTMLButtonElement | null>(null);

  const userInitial = $derived(
    $session.data?.user?.name?.charAt(0).toUpperCase() ??
      $session.data?.user?.email?.charAt(0).toUpperCase() ??
      "?"
  );

  async function logout() {
    open = false;
    await authClient.signOut();
    goto(resolve("/"));
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      open = false;
      btnEl?.focus();
    }
  }
</script>

<svelte:window
  onclick={(e) => {
    if (open && !btnEl?.closest(".pp-wrapper")?.contains(e.target as Node)) {
      open = false;
    }
  }}
/>

<div class="pp-wrapper" onkeydown={handleKeydown} role="none">
  <button
    bind:this={btnEl}
    class="pp-avatar"
    class:pp-open={open}
    onclick={() => (open = !open)}
    type="button"
    aria-haspopup="true"
    aria-expanded={open}
    aria-label="Account menu"
    id="profile-avatar-btn"
  >
    {userInitial}
  </button>

  {#if open}
    <div class="pp-popover" role="menu" aria-label="Account options">
      <!-- Arrow caret -->
      <div class="pp-caret" aria-hidden="true"></div>

      <div class="pp-user">
        <span class="pp-initial" aria-hidden="true">{userInitial}</span>
        <div class="pp-meta">
          <span class="pp-name">{$session.data?.user?.name}</span>
          <span class="pp-email">{$session.data?.user?.email}</span>
        </div>
      </div>

      <hr class="pp-divider" />

      <button
        class="pp-action pp-logout"
        onclick={logout}
        type="button"
        role="menuitem"
        id="profile-logout-btn"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign out
      </button>
    </div>
  {/if}
</div>

<style>
  .pp-wrapper {
    position: relative;
    margin-left: 0.5rem;
  }

  /* ── Avatar button ── */
  .pp-avatar {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: var(--color-accent, #4169e1);
    color: #fff;
    font-size: 0.875rem;
    font-weight: 700;
    border: 2px solid transparent;
    cursor: pointer;
    transition:
      background 150ms,
      border-color 150ms,
      transform 120ms;
    line-height: 1;
    font-family: inherit;
    letter-spacing: 0.02em;
  }

  .pp-avatar:hover,
  .pp-avatar.pp-open {
    background: var(--color-accent-dark, #2d4fc0);
    border-color: rgba(65, 105, 225, 0.3);
    transform: scale(1.05);
  }

  .pp-avatar:focus-visible {
    outline: 2px solid var(--color-accent, #4169e1);
    outline-offset: 2px;
  }

  /* ── Popover panel ── */
  .pp-popover {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 224px;
    background: #fff;
    border: 1px solid var(--color-border, #bfdbfe);
    border-radius: 10px;
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.1),
      0 2px 6px rgba(0, 0, 0, 0.06);
    padding: 0.5rem;
    z-index: 200;
    animation: pp-in 150ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  /* ── Caret ── */
  .pp-caret {
    position: absolute;
    top: -6px;
    right: 10px;
    width: 10px;
    height: 10px;
    background: #fff;
    border-left: 1px solid var(--color-border, #bfdbfe);
    border-top: 1px solid var(--color-border, #bfdbfe);
    transform: rotate(45deg);
  }

  /* ── User info ── */
  .pp-user {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 0.5rem 0.625rem;
  }

  .pp-initial {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: var(--color-accent-light, #dbeafe);
    color: var(--color-accent, #4169e1);
    font-size: 0.875rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .pp-meta {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    overflow: hidden;
  }

  .pp-name {
    font-size: 0.825rem;
    font-weight: 600;
    color: var(--color-text, #0d1b3e);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pp-email {
    font-size: 0.72rem;
    color: var(--color-text-muted, #4a6080);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pp-divider {
    border: none;
    border-top: 1px solid var(--color-border, #bfdbfe);
    margin: 0.25rem 0;
  }

  /* ── Menu actions ── */
  .pp-action {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.5rem 0.625rem;
    font-size: 0.825rem;
    font-weight: 500;
    background: transparent;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition:
      background 120ms,
      color 120ms;
    font-family: inherit;
    text-align: left;
  }

  .pp-logout {
    color: #c0392b;
  }

  .pp-logout:hover {
    background: #fef2f2;
    color: #b71c1c;
  }

  @keyframes pp-in {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
