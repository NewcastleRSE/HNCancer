<script lang="ts">
  // Component for providing inputs and corresponding buttons for searching cancer data.
  // Used in sidebar.
  import SingleSelectDropdownNoDefault from "./SingleSelectDropdownNoDefault.svelte";
  import QuerySelectionsDynamic from "./QuerySelectionsDynamic.svelte";
  import type { Statistic } from "../utils/variables";
  import { CANCER_TYPES, CANCER_STATISTICS_OPTIONS } from "../utils/variables";
  import type { IncidenceFilter, SurvivalFilter } from "../types";

  // Turn cancer types into object with values/label fields for select components
  const cancerOptions = CANCER_TYPES.map((value) => ({
    value: value,
    label: value,
  }));

  // Dropdown states
  let cancerSelection = $state("");
  let statisticSelection: Statistic | "" = $state("");

  //   // Filter state
  //   type Filter = IncidenceFilter | SurvivalFilter;
  //   let filter = $state<Filter | null>(null);

  // --- Functions for submit/reset ---

  // Handle passing statistic and filter object to astro page for query
  //   function submitQuery() {
  //     if (statistic === "incidence") {
  //       const processedFilter = processFilter({
  //         statistic: "incidence",
  //         filter: filter as IncidenceFilter,
  //       });

  //       document.dispatchEvent(
  //         new CustomEvent("cancer-query", {
  //           detail: {
  //             statistic: "incidence",
  //             filter: processedFilter,
  //           },
  //         }),
  //       );
  //     } else {
  //       const processedFilter = processFilter({
  //         statistic: "survival",
  //         filter: filter as SurvivalFilter,
  //       });

  //       document.dispatchEvent(
  //         new CustomEvent("cancer-query", {
  //           detail: {
  //             statistic: "survival",
  //             filter: processedFilter,
  //           },
  //         }),
  //       );
  //     }
  //   }

  // Handle resetting the filter values and the UI state
  function resetQuery() {
    // Reset dropdowns
    cancerSelection = "";
    statisticSelection = "";
  }
</script>

<div class="search-inputs">
  <h1 class="h1-search"><em>Search cancer data:</em></h1>
  <div class="search-section">
    <h2 class="query-section">Cancer</h2>
    <SingleSelectDropdownNoDefault
      id="cancertype"
      defaultDisabledText="Select a type of cancer..."
      options={cancerOptions}
      bind:selectedValue={cancerSelection}
    />
    <h2 class="query-section">Statistic</h2>
    <SingleSelectDropdownNoDefault
      id="statistic"
      defaultDisabledText="Select a statistic..."
      options={CANCER_STATISTICS_OPTIONS}
      bind:selectedValue={statisticSelection}
    />
    <hr />
    {#if statisticSelection}
      <!-- Recreate this component every time the statistic changes -->
      {#key statisticSelection}
        <QuerySelectionsDynamic statistic={statisticSelection} />
      {/key}
    {/if}
  </div>
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
</style>
