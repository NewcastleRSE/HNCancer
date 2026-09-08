<script lang="ts">
  // Component for providing inputs and corresponding buttons for searching cancer data.
  // Used in sidebar.
  import SingleSelectDropdownNoDefault from "./SingleSelectDropdownNoDefault.svelte";
  import IncidenceQuerySelectionsDynamic from "./IncidenceQuerySelectionsDynamic.svelte";
  import { CANCER_TYPES, CANCER_STATISTICS_OPTIONS } from "../utils/variables";

  // Turn cancer types into object with values/label fields for select components
  const cancerOptions = CANCER_TYPES.map((value) => ({
    value: value,
    label: value,
  }));

  // Dropdown states
  let cancerSelection = $state("");
  let statisticSelection = $state("");
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
    <IncidenceQuerySelectionsDynamic />
  </div>
</div>

<style>
  .h1-search {
    font-size: var(--font-size-h3);
    font-weight: 400;
  }
</style>
