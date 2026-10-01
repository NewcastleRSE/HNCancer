<script lang="ts">
  import type { Snippet } from "svelte";
  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
  let isOpen = $state(false);

  // To close pop-up if click outside
  let popup: HTMLDivElement | null = null;
  function handleDocumentClick(event: PointerEvent) {
    const target = event.target as Node;

    if (
      isOpen &&
      popup &&
      !popup.contains(target) &&
      !(
        target instanceof Element &&
        target.closest("#query-section-info-button")
      )
    ) {
      isOpen = false;
    }
  }

  $effect(() => {
    document.addEventListener("pointerdown", handleDocumentClick, true);

    return () => {
      document.removeEventListener("pointerdown", handleDocumentClick, true);
    };
  });
</script>

<div class="query-section-header">
  <h2 class="query-section">{title}</h2>

  <button
    id="query-section-info-button"
    type="button"
    class="button is-primary icon-button"
    aria-label={`More information about ${title}`}
    aria-expanded={isOpen}
    onclick={() => {
      isOpen = !isOpen;
    }}
  >
    <span class="material-symbols-outlined button-icon" aria-hidden="true"
      >info</span
    >
  </button>

  {#if isOpen}
    <div class="query-section-info" bind:this={popup}>
      {@render children()}
    </div>
  {/if}
</div>

<style>
  .query-section-header {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .query-section {
    margin: 0;
  }

  .query-section-info {
    position: absolute;
    top: calc(100%);
    left: 0;
    z-index: 20;

    width: 16rem;
    padding: 0.75rem 1rem;
    margin-left: 2rem;

    background-color: var(--bulma-background-color);

    border: 1px solid var(--bulma-border);
    border-radius: 4px;
    box-shadow: 0.15rem 0.2rem 0.4rem rgb(10 10 10 / 12%);

    font-size: 0.9rem;
    color: var(--bulma-body-color);
    line-height: 1.3;
  }

  .icon-button {
    background-color: transparent;
    padding: 0.1rem;
  }

  .button.icon-button .button-icon {
    font-size: 1.3rem;
  }

  .query-section-info :global(> * + *) {
    margin-top: 1rem;
  }
</style>
