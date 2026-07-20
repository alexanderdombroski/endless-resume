<script lang="ts">
  import { sanitizeRichText } from "$lib/rich-text";

  interface Props {
    value?: string;
    multiline?: boolean;
    placeholder?: string;
    ariaLabel?: string;
    class?: string;
  }

  let {
    value = $bindable(""),
    multiline = false,
    placeholder = "",
    ariaLabel,
    class: className = ""
  }: Props = $props();

  let el: HTMLDivElement | null = $state(null);
  let lastEmitted = $state("");

  $effect(() => {
    if (el && value !== lastEmitted && value !== el.innerHTML) {
      const clean = sanitizeRichText(value);
      // eslint-disable-next-line svelte/no-dom-manipulating
      el.innerHTML = clean;
      lastEmitted = clean;
    }
  });

  function handleInput() {
    if (!el) return;
    lastEmitted = el.innerHTML;
    value = el.innerHTML;
  }

  function handleBlur() {
    if (!el) return;
    const clean = sanitizeRichText(el.innerHTML);
    if (clean !== el.innerHTML) {
      // eslint-disable-next-line svelte/no-dom-manipulating
      el.innerHTML = clean;
    }
    lastEmitted = clean;
    value = clean;
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    document.execCommand("insertText", false, e.clipboardData?.getData("text/plain") ?? "");
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!multiline && e.key === "Enter") {
      e.preventDefault();
    }
  }

  function format(command: "bold" | "italic" | "underline") {
    el?.focus();
    document.execCommand(command);
    handleInput();
  }
</script>

<div class="rich-text-field {className}">
  <span class="rich-text-toolbar" role="toolbar" aria-label="Text formatting">
    <button
      type="button"
      class="rich-text-btn"
      onmousedown={(e) => {
        e.preventDefault();
        format("bold");
      }}
      aria-label="Bold"
      title="Bold (Ctrl+B)"><b>B</b></button
    >
    <button
      type="button"
      class="rich-text-btn"
      onmousedown={(e) => {
        e.preventDefault();
        format("italic");
      }}
      aria-label="Italic"
      title="Italic (Ctrl+I)"><i>I</i></button
    >
    <button
      type="button"
      class="rich-text-btn"
      onmousedown={(e) => {
        e.preventDefault();
        format("underline");
      }}
      aria-label="Underline"
      title="Underline (Ctrl+U)"><u>U</u></button
    >
  </span>

  <div
    bind:this={el}
    class="rich-text-editable"
    contenteditable="true"
    role="textbox"
    tabindex="0"
    aria-multiline={multiline}
    aria-label={ariaLabel}
    data-placeholder={placeholder}
    oninput={handleInput}
    onblur={handleBlur}
    onpaste={handlePaste}
    onkeydown={handleKeydown}
  ></div>
</div>

<style>
  .rich-text-field {
    position: relative;
  }

  .rich-text-editable {
    font: inherit;
    color: inherit;
    text-align: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    outline: none;
    cursor: text;
    min-width: 1px;
  }

  .rich-text-editable:empty::before {
    content: attr(data-placeholder);
    color: var(--color-text-muted);
    pointer-events: none;
  }

  .rich-text-toolbar {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 0;
    display: flex;
    gap: 2px;
    background: #1e293b;
    border-radius: 6px;
    padding: 3px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    opacity: 0;
    pointer-events: none;
    transform: translateY(4px);
    transition:
      opacity 0.12s ease,
      transform 0.12s ease;
    z-index: 100;
  }

  .rich-text-field:focus-within .rich-text-toolbar {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  .rich-text-btn {
    display: grid;
    place-items: center;
    width: 22px;
    height: 20px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: #ffffff;
    font-size: 0.7rem;
    line-height: 1;
    cursor: pointer;
  }

  .rich-text-btn:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  @media print {
    .rich-text-toolbar {
      display: none !important;
    }
  }
</style>
