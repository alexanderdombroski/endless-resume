<script lang="ts">
  import { resolve } from "$app/paths";
  import Dialog from "./base/Dialog.svelte";
  import { authClient } from "$lib/auth/auth-client";
  import { goto } from "$app/navigation";

  interface Props {
    open?: boolean;
  }

  let { open = $bindable(false) }: Props = $props();

  type Mode = "login" | "register";
  let mode = $state<Mode>("login");

  let email = $state("");
  let password = $state("");
  let name = $state("");
  let error = $state("");
  let loading = $state(false);

  function reset() {
    email = "";
    password = "";
    name = "";
    error = "";
    loading = false;
  }

  function switchMode(next: Mode) {
    mode = next;
    error = "";
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    error = "";
    loading = true;

    try {
      if (mode === "login") {
        const { error: err } = await authClient.signIn.email({
          email,
          password
        });
        if (err) throw new Error(err.message ?? "Sign-in failed.");
      } else {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name
        });
        if (err) throw new Error(err.message ?? "Registration failed.");
      }

      open = false;
      reset();
      goto(resolve("/dashboard"));
    } catch (e) {
      error = e instanceof Error ? e.message : "Something went wrong.";
    } finally {
      loading = false;
    }
  }

  function handleClose() {
    reset();
    mode = "login";
  }
</script>

<Dialog bind:open onclose={handleClose}>
  <div class="login-dialog">
    <!-- Logo / brand mark -->
    <div class="ld-brand">
      <span class="ld-mark" aria-hidden="true">ER</span>
    </div>

    <!-- Tab switcher -->
    <div class="ld-tabs" role="tablist" aria-label="Sign in or create account">
      <button
        role="tab"
        aria-selected={mode === "login"}
        class="ld-tab"
        class:active={mode === "login"}
        onclick={() => switchMode("login")}
        type="button"
      >
        Sign in
      </button>
      <button
        role="tab"
        aria-selected={mode === "register"}
        class="ld-tab"
        class:active={mode === "register"}
        onclick={() => switchMode("register")}
        type="button"
      >
        Create account
      </button>
    </div>

    <form class="ld-form" onsubmit={handleSubmit} novalidate>
      {#if mode === "register"}
        <div class="ld-field">
          <label class="ld-label" for="ld-name">Full name</label>
          <input
            id="ld-name"
            class="ld-input"
            type="text"
            bind:value={name}
            autocomplete="name"
            placeholder="Jane Smith"
            required
          />
        </div>
      {/if}

      <div class="ld-field">
        <label class="ld-label" for="ld-email">Email</label>
        <input
          id="ld-email"
          class="ld-input"
          type="email"
          bind:value={email}
          autocomplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div class="ld-field">
        <label class="ld-label" for="ld-password">Password</label>
        <input
          id="ld-password"
          class="ld-input"
          type="password"
          bind:value={password}
          autocomplete={mode === "login" ? "current-password" : "new-password"}
          placeholder="••••••••"
          required
          minlength="8"
        />
      </div>

      {#if error}
        <p class="ld-error" role="alert">{error}</p>
      {/if}

      <button class="ld-submit" type="submit" disabled={loading}>
        {#if loading}
          <span class="ld-spinner" aria-hidden="true"></span>
          {mode === "login" ? "Signing in…" : "Creating account…"}
        {:else}
          {mode === "login" ? "Sign in" : "Create account"}
        {/if}
      </button>
    </form>

    <p class="ld-switch">
      {mode === "login" ? "Don't have an account?" : "Already have an account?"}
      <button
        class="ld-switch-btn"
        onclick={() => switchMode(mode === "login" ? "register" : "login")}
        type="button"
      >
        {mode === "login" ? "Create one" : "Sign in"}
      </button>
    </p>
  </div>
</Dialog>

<style>
  .login-dialog {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Brand mark */
  .ld-brand {
    display: flex;
    justify-content: center;
    padding-top: 0.25rem;
  }

  .ld-mark {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    background: var(--color-text, #0d1b3e);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    border-radius: 10px;
  }

  /* Tabs */
  .ld-tabs {
    display: flex;
    gap: 0;
    background: var(--color-surface, #eff6ff);
    border-radius: 8px;
    padding: 3px;
  }

  .ld-tab {
    flex: 1;
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    background: transparent;
    border-radius: 6px;
    color: var(--color-text-muted, #4a6080);
    cursor: pointer;
    transition:
      background 150ms,
      color 150ms,
      box-shadow 150ms;
  }

  .ld-tab.active {
    background: #fff;
    color: var(--color-text, #0d1b3e);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }

  /* Form */
  .ld-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .ld-field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .ld-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--color-text, #0d1b3e);
    letter-spacing: 0.01em;
  }

  .ld-input {
    padding: 0.625rem 0.875rem;
    font-size: 0.925rem;
    border: 1.5px solid var(--color-border, #bfdbfe);
    border-radius: 8px;
    color: var(--color-text, #0d1b3e);
    background: #fff;
    transition:
      border-color 150ms,
      box-shadow 150ms;
    outline: none;
    width: 100%;
    box-sizing: border-box;
  }

  .ld-input::placeholder {
    color: #b0bec5;
  }

  .ld-input:focus {
    border-color: var(--color-accent, #4169e1);
    box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.12);
  }

  /* Error */
  .ld-error {
    font-size: 0.82rem;
    color: #d32f2f;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
    margin: 0;
  }

  /* Submit */
  .ld-submit {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.7rem 1.5rem;
    font-size: 0.925rem;
    font-weight: 700;
    background: var(--color-accent, #4169e1);
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background 150ms,
      transform 100ms,
      opacity 150ms;
    margin-top: 0.25rem;
  }

  .ld-submit:hover:not(:disabled) {
    background: var(--color-accent-dark, #2d4fc0);
  }

  .ld-submit:active:not(:disabled) {
    transform: translateY(1px);
  }

  .ld-submit:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* Spinner */
  .ld-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
  }

  /* Switch */
  .ld-switch {
    text-align: center;
    font-size: 0.82rem;
    color: var(--color-text-muted, #4a6080);
    margin: 0;
  }

  .ld-switch-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    font-weight: 600;
    color: var(--color-accent, #4169e1);
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 120ms;
  }

  .ld-switch-btn:hover {
    color: var(--color-accent-dark, #2d4fc0);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
