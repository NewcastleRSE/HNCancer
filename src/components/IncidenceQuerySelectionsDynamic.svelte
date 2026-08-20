<script lang="ts">
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import {
    INCIDENCE_FILTER_VARIABLES,
    INCIDENCE_FILTER_LABELS,
    initIncidenceFilter,
    processIncidenceFilter,
  } from "../utils/query";
  import { VARIABLE_OPTIONS } from "../utils/variables";
  import type { IncidenceFilter, IncidenceFilterVariable } from "../types";

  // Initialise variable for storing filter state (updated using UI inputs)
  let filter: IncidenceFilter = initIncidenceFilter();

  // Variable selected for comparison using dropdown
  // Also keep track of previous selection so that those options can be cleared from the
  // filter variable when the comparison variable is changed
  let comparisonVariable: IncidenceFilterVariable | "" = "";
  let previousComparisonVariable: IncidenceFilterVariable | "" = "";

  // Handle changing comparison variable
  function handleComparisonChange() {
    // Clear options for previous variable
    if (previousComparisonVariable) {
      filter[previousComparisonVariable] = [];
    }
    // Update comparison variable
    previousComparisonVariable = comparisonVariable;
  }

  // Handle passing filter object to astro page for query
  function submitQuery() {
    const processedFilter = processIncidenceFilter(filter);

    document.dispatchEvent(
      new CustomEvent<IncidenceFilter>("incidence-query", {
        detail: processedFilter,
      }),
    );
  }

  // Handle reset the filter
  function resetQuery() {
    filter = initIncidenceFilter();
  }
</script>

<div>
  <div>
    <label>
      Compare by
      <select bind:value={comparisonVariable} onchange={handleComparisonChange}>
        <option value="">Select variable</option>

        {#each INCIDENCE_FILTER_VARIABLES as variable}
          {#if variable !== "sex"}
            <option value={variable}>
              {INCIDENCE_FILTER_LABELS[variable]}
            </option>
          {/if}
        {/each}
      </select>
    </label>
  </div>

  {#if comparisonVariable}
    <CheckboxGroup
      label={INCIDENCE_FILTER_LABELS[comparisonVariable]}
      options={VARIABLE_OPTIONS[comparisonVariable]}
      bind:selectedValues={filter[comparisonVariable]}
    />
  {/if}
  <!-- 
  {#each INCIDENCE_FILTER_VARIABLES as variable}
    <CheckboxGroup
      label={INCIDENCE_FILTER_LABELS[variable]}
      options={VARIABLE_OPTIONS[variable]}
      bind:selectedValues={filter[variable]}
    />
  {/each} -->
</div>

<div class="mb-2">
  <button type="button" class="button" onclick={submitQuery}> Search </button>

  <button type="button" class="button" onclick={resetQuery}> Reset </button>
</div>
