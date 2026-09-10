<script lang="ts">
  // Component for providing inputs and corresponding buttons for searching cancer data.
  // Used in sidebar.
  import SingleSelectDropdownNoDefault from "./SingleSelectDropdownNoDefault.svelte";
  import QuerySelectionsDynamic from "./QuerySelectionsDynamic.svelte";
  import type { Statistic } from "../utils/variables";
  import {
    CANCER_TYPES,
    CANCER_STATISTICS_OPTIONS,
    STATISTICS_CONFIG,
  } from "../utils/variables";
  import type { IncidenceFilter, SurvivalFilter } from "../types";
  import { initFilter, processFilter } from "../utils/query";

  // Turn cancer types into object with values/label fields for select components
  const cancerOptions = CANCER_TYPES.map((value) => ({
    value: value,
    label: value,
  }));

  // Dropdown states
  let cancerSelection = $state("");
  let statisticSelection: Statistic | "" = $state("");

  // Filter state
  type Filter = IncidenceFilter | SurvivalFilter;
  let filter = $state<Filter | null>(null);

  // Function for initialising filter when statistic changes
  // Ensures creates filter with correct fields for that statistic
  function handleStatisticChange() {
    if (statisticSelection === "incidence") {
      filter = initFilter(STATISTICS_CONFIG.incidence.filterVariables);
    } else if (statisticSelection === "survival") {
      filter = initFilter(STATISTICS_CONFIG.survival.filterVariables);
    } else {
      filter = null;
    }
  }

  // --- Functions for submit/reset ---

  //   Handle passing cancer, statistic, and filter object to astro page for query
  function submitQuery() {
    // Return early if missing inputs with null values so can display message to user
    if (!statisticSelection || !filter || !cancerSelection) {
      const searchQuery = {
        statistic: statisticSelection,
        filter: null,
        cancer: cancerSelection,
      };

      document.dispatchEvent(
        new CustomEvent("cancer-query", {
          detail: searchQuery,
        }),
      );
    }

    // Create inputs for processing filter (need branch to handle typing)
    let processArgs = null;
    if (statisticSelection === "incidence") {
      processArgs = {
        statistic: statisticSelection,
        filter: filter as IncidenceFilter,
      };
    } else if (statisticSelection === "survival") {
      processArgs = {
        statistic: statisticSelection,
        filter: filter as SurvivalFilter,
      };
    }

    // Pass inputs to page
    if (processArgs) {
      const processedFilter = processFilter(processArgs);

      const searchQuery = {
        statistic: statisticSelection, // Statistic to display (determines spreadsheet used)
        filter: processedFilter, // Search filter (for querying spreadsheet using Papaparse)
        cancer: cancerSelection, // Type of cancer (also determines spreadsheet used)
      };

      document.dispatchEvent(
        new CustomEvent("cancer-query", {
          detail: searchQuery,
        }),
      );
    }
  }

  // Handle resetting the filter values and the UI state
  function resetQuery() {
    // Reset dropdowns
    cancerSelection = "";
    statisticSelection = "";
    // Reset filter
    filter = null;
  }
</script>

<!-- Note - Svelte components need to be wrapped in divs for * + * layout spacing to work -->
<div class="search-inputs">
  <h1 class="h1-search"><em>Search cancer data:</em></h1>
  <div class="search-scroll">
    <div class="search-section">
      <h2 class="query-section">HNC Subsite</h2>
      <div>
        <SingleSelectDropdownNoDefault
          id="cancertype"
          defaultDisabledText="Select a subsite..."
          options={cancerOptions}
          bind:selectedValue={cancerSelection}
        />
      </div>
    </div>
    <div class="search-section">
      <h2 class="query-section">Statistic</h2>
      <div>
        <SingleSelectDropdownNoDefault
          id="statistic"
          defaultDisabledText="Select a statistic..."
          options={CANCER_STATISTICS_OPTIONS}
          bind:selectedValue={statisticSelection}
          onChange={handleStatisticChange}
        />
      </div>
    </div>
    <!-- Create query components when statistic is selected -->
    <!-- Also explicitly check for filter so typescript knows that filter is not null -->
    {#if statisticSelection && filter}
      <hr />
      <div>
        <!-- Recreate this component every time the statistic changes -->
        {#key statisticSelection}
          <QuerySelectionsDynamic statistic={statisticSelection} bind:filter />
        {/key}
      </div>
    {/if}
  </div>
  <hr />
  <div class="button-container">
    <button type="button" class="button is-primary" onclick={submitQuery}>
      Search
    </button>

    <button type="button" class="button is-primary" onclick={resetQuery}>
      Reset
    </button>
  </div>
</div>

<style>
  .h1-search {
    font-size: var(--font-size-h3);
    font-weight: 400;
  }

  /* Buttons */
  .button-container {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  /* layout */

  .search-inputs {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .search-inputs > * + * {
    margin-top: 1rem;
  }

  .search-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .search-scroll > * + * {
    margin-top: 1rem;
  }

  .search-section > * + * {
    margin-top: 0.5rem;
  }

  .button-container {
    flex-shrink: 0;
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }
</style>
