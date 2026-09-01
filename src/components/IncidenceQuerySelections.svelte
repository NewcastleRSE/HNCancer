<script lang="ts">
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import {
    INCIDENCE_FILTER_VARIABLES,
    INCIDENCE_FILTER_LABELS,
    initIncidenceFilter,
    processIncidenceFilter,
  } from "../utils/query";
  import { INCIDENCE_VARIABLE_OPTIONS } from "../utils/variables";
  import type { IncidenceFilter } from "../types";

  // Initialise variable for storing filter state (updated using UI inputs)
  let filter: IncidenceFilter = initIncidenceFilter();

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
  {#each INCIDENCE_FILTER_VARIABLES as variable}
    <CheckboxGroup
      label={INCIDENCE_FILTER_LABELS[variable]}
      options={INCIDENCE_VARIABLE_OPTIONS[variable]}
      bind:selectedValues={filter[variable]}
    />
  {/each}
</div>

<div class="mb-2">
  <button type="button" class="button" onclick={submitQuery}> Search </button>

  <button type="button" class="button" onclick={resetQuery}> Reset </button>
</div>
