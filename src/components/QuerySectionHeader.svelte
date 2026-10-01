<script lang="ts">
  import type { Snippet } from "svelte";
  interface Props {
    title: string;
    children: Snippet;
  }

  let { title, children }: Props = $props();
  let isOpen = $state(false);

  let container: HTMLDivElement | null = null;

  function handleDocumentClick(event: MouseEvent) {
    if (isOpen && container && !container.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  $effect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });
</script>

<div class="query-section-header" bind:this={container}>
  <h2 class="query-section">{title}</h2>

  <button
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
    <div class="query-section-info">
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
    top: 100%;
    left: 0;
    z-index: 20;

    width: 16rem;
    padding: 0.75rem 1rem;
    margin-left: 2rem;

    background-color: var(--bulma-background-color);

    border: 1px solid var(--bulma-border);
    border-radius: 4px;
    box-shadow: 0.15rem 0.2rem 0.4rem rgb(10 10 10 / 12%);

    font-size: 1rem;
    color: var(--bulma-body-color);
  }

  .icon-button {
    background-color: transparent;
    padding: 0.1rem;
  }

  .button.icon-button .button-icon {
    font-size: 1.3rem;
  }
</style>
