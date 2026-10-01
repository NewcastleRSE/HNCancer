<script lang="ts">
  // Sidebar for search page, containing search inputs
  // Can collapse using button on top right
  import SearchInputsDynamic from "./SearchInputsDynamic.svelte";

  let sidebarCollapsed = $state(false);
  let showSidebarContent = $state(true);

  function toggleSidebar() {
    if (sidebarCollapsed) {
      // Start expanding immediately
      sidebarCollapsed = false;

      // Reveal content after the width transition
      setTimeout(() => {
        showSidebarContent = true;
      }, 200);
    } else {
      // Hide content immediately
      showSidebarContent = false;
      sidebarCollapsed = true;
    }
  }
</script>

<aside id="search-panel" class:sidebar-collapsed={sidebarCollapsed}>
  <div class="sidebar-header">
    {#if showSidebarContent}
      <h1 class="h1-search"><em>Search cancer data:</em></h1>
    {/if}
    <button
      id="sidebar-toggle"
      class="button is-secondary"
      type="button"
      aria-label={sidebarCollapsed
        ? "Expand search panel"
        : "Collapse search panel"}
      aria-expanded={!sidebarCollapsed}
      onclick={toggleSidebar}
    >
      <span class="material-symbols-outlined">
        {sidebarCollapsed ? "chevron_right" : "chevron_left"}
      </span>
    </button>
  </div>

  {#if showSidebarContent}
    <SearchInputsDynamic />
  {/if}
</aside>

<style>
  #search-panel {
    flex: 0 0 22.5rem;
    height: 100%;
    min-height: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    background-color: var(--color-surface);
    padding: 0.75rem 1rem 1rem 1rem;

    border-right: 1.5px solid var(--color-border-div);
    border-bottom: 1.5px solid var(--color-border-div);
    border-bottom-right-radius: 0.75rem;

    transition: flex-basis 0.4s ease;
  }

  #sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0;
    margin-left: auto;
    border: 0;
    cursor: pointer;
  }

  #search-panel.sidebar-collapsed {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    flex-basis: 3rem;
  }

  #search-panel.sidebar-collapsed #sidebar-toggle {
    margin-left: auto;
    margin-right: auto;
  }

  /* Header styling */

  .h1-search {
    font-size: var(--font-size-h3);
    font-weight: 400;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-left: var(--search-padding-left);
  }

  /* responsiveness */
  @media (max-width: 768px) {
    #search-panel {
      border-bottom-right-radius: 0rem;
    }
  }
</style>
