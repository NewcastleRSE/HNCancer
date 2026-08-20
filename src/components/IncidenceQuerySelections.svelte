<script lang="ts">
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import {
    INCIDENCE_FILTER_VARIABLES,
    INCIDENCE_FILTER_LABELS,
    initIncidenceFilter,
  } from "../utils/query";
  import { VARIABLE_OPTIONS } from "../utils/variables";
  import type { IncidenceFilter } from "../types";

  // Initialise variable for storing filter state (updated using UI inputs)
  let filter: IncidenceFilter = initIncidenceFilter();
</script>

<div>
  {#each INCIDENCE_FILTER_VARIABLES as variable}
    <CheckboxGroup
      label={INCIDENCE_FILTER_LABELS[variable]}
      options={VARIABLE_OPTIONS[variable]}
      bind:selectedValues={filter[variable]}
    />
  {/each}
</div>
