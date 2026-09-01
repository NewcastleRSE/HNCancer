<script lang="ts">
  import CheckboxGroup from "./CheckboxGroup.svelte";
  import SingleSelectDropdown from "./SingleSelectDropdown.svelte";
  import { initIncidenceFilter, processIncidenceFilter } from "../utils/query";
  import {
    INCIDENCE_VARIABLE_OPTIONS,
    INCIDENCE_VARIABLE_ALL,
    INCIDENCE_FILTER_VARIABLES,
    INCIDENCE_FILTER_LABELS,
  } from "../utils/variables";
  import type { IncidenceFilter, IncidenceFilterVariable } from "../types";

  // Initialise variable for storing filter state (updated using UI inputs)
  let filter = $state<IncidenceFilter>(initIncidenceFilter());

  // --- Initial UI states ---

  // Variable selected for comparison using dropdown
  // Also keep track of previous selection so that those options can be cleared from the
  // filter variable when the comparison variable is changed
  let comparisonVariable = $state<IncidenceFilterVariable | "">("");
  let previousComparisonVariable: IncidenceFilterVariable | "" = "";

  // Whether to compare male and female

  let compareMaleFemale = $state(false);

  // Single select options
  let singleSelections = $state<Record<IncidenceFilterVariable, string>>({
    dep: INCIDENCE_VARIABLE_ALL.dep.value,
    region: INCIDENCE_VARIABLE_ALL.region.value,
    sex: INCIDENCE_VARIABLE_ALL.sex.value,
    ageBand: INCIDENCE_VARIABLE_ALL.ageBand.value,
    route: INCIDENCE_VARIABLE_ALL.route.value,
    stage: INCIDENCE_VARIABLE_ALL.stage.value,
  });

  // --- Variables to show in filter section ---

  let singleSelectVariables = $derived(
    INCIDENCE_FILTER_VARIABLES.filter(
      (variable) =>
        variable !== comparisonVariable &&
        !(variable === "sex" && compareMaleFemale),
    ),
  );

  // --- Helpers for creating components ---
  function getSingleSelectOptions(variable: IncidenceFilterVariable) {
    return [
      INCIDENCE_VARIABLE_ALL[variable],
      ...INCIDENCE_VARIABLE_OPTIONS[variable],
    ];
  }

  // ---  Functions for UI updates ---

  // Handle changing comparison variable
  function handleComparisonChange() {
    // Clear the old comparison variable's comparison selections
    if (previousComparisonVariable) {
      filter[previousComparisonVariable] = [];
    }

    // The newly selected comparison variable is no longer controlled
    // by its single-select dropdown - reset filter for that variable
    if (comparisonVariable) {
      filter[comparisonVariable] = [];
    }

    // Also reset dropdown value for the corresponding single-select dropdown
    if (comparisonVariable) {
      singleSelections[comparisonVariable] =
        INCIDENCE_VARIABLE_ALL[comparisonVariable].value;
    }

    // Set new comparison variable
    previousComparisonVariable = comparisonVariable;
  }

  // Handle changing whether to compare by sex
  function handleCompareMaleFemaleChange() {
    if (compareMaleFemale) {
      filter.sex = ["Male", "Female"];
    } else {
      filter.sex = [];
    }
  }

  function handleSingleSelectChange(variable: IncidenceFilterVariable) {
    filter[variable] = [singleSelections[variable]];
  }

  // --- Functions for submit/reset ---

  // Handle passing filter object to astro page for query
  function submitQuery() {
    const processedFilter = processIncidenceFilter(filter);

    document.dispatchEvent(
      new CustomEvent<IncidenceFilter>("incidence-query", {
        detail: processedFilter,
      }),
    );
  }

  // Handle resetting the filter values and the UI state
  function resetQuery() {
    // Reset filter settings
    filter = initIncidenceFilter();

    // Update UI variables/state
    comparisonVariable = "";
    previousComparisonVariable = "";
    compareMaleFemale = false;
    singleSelections = {
      dep: INCIDENCE_VARIABLE_ALL.dep.value,
      region: INCIDENCE_VARIABLE_ALL.region.value,
      sex: INCIDENCE_VARIABLE_ALL.sex.value,
      ageBand: INCIDENCE_VARIABLE_ALL.ageBand.value,
      route: INCIDENCE_VARIABLE_ALL.route.value,
      stage: INCIDENCE_VARIABLE_ALL.stage.value,
    };
  }
</script>

<div class="query-inputs">
  <h2 class="query-section">Compare</h2>
  <div class="query-inputs-compare">
    <label class="compare-checkbox">
      <input
        type="checkbox"
        bind:checked={compareMaleFemale}
        onchange={handleCompareMaleFemaleChange}
      />
      <span>Compare by Sex</span>
    </label>
    <div class="compare-dropdown">
      <span class="compare-bullet" aria-hidden="true">•</span>

      <label>
        <span>Compare by</span>
        <div class="select select-compact">
          <select
            id="select-compare-variable"
            bind:value={comparisonVariable}
            onchange={handleComparisonChange}
          >
            <option value="">Select variable</option>

            {#each INCIDENCE_FILTER_VARIABLES as variable}
              {#if variable !== "sex"}
                <option value={variable}>
                  {INCIDENCE_FILTER_LABELS[variable]}
                </option>
              {/if}
            {/each}
          </select>
        </div>
      </label>
    </div>
  </div>

  <div class="compare-checkbox-group">
    {#if comparisonVariable}
      <CheckboxGroup
        label={"Choose " +
          INCIDENCE_FILTER_LABELS[comparisonVariable].toLowerCase() +
          " values to compare"}
        options={INCIDENCE_VARIABLE_OPTIONS[comparisonVariable]}
        bind:selectedValues={filter[comparisonVariable]}
      />
    {/if}
  </div>
  <hr />
  <h2 class="query-section">Additional filters</h2>
  <div class="query-inputs-filter">
    <div class="single-select-filters">
      {#each singleSelectVariables as variable}
        <SingleSelectDropdown
          label={INCIDENCE_FILTER_LABELS[variable]}
          options={getSingleSelectOptions(variable)}
          bind:selectedValue={singleSelections[variable]}
          onChange={() => handleSingleSelectChange(variable)}
        />
      {/each}
    </div>
  </div>
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

<style>
  .query-inputs > * + * {
    margin-top: 1rem;
  }

  label {
    font-weight: 400;
    font-size: 1rem;
  }

  option {
    font-size: 2rem;
  }

  .single-select-filters {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  /* Min height for checkbox group so doesn't move components beneath when added dynamically */
  .compare-checkbox-group {
    min-height: 135px;
  }

  /* Buttons */
  .button-container {
    display: flex;
    gap: 1.5rem;
    align-items: center;
  }

  /* Set up grid for compare components */

  .query-inputs-compare {
    display: grid;
    grid-template-columns: 1.25rem auto;
    row-gap: 0.25rem;
    align-items: center;
  }

  .compare-checkbox {
    display: contents;
  }

  .compare-checkbox input {
    grid-column: 1;
    justify-self: start;
  }

  .compare-checkbox span {
    grid-column: 2;
  }
  .compare-dropdown {
    grid-column: 1 / 3;
    display: grid;
    grid-template-columns: 1.25rem auto;
    align-items: center;
  }

  .compare-bullet {
    grid-column: 1;
    font-size: 1.5rem;
    line-height: 1;
    justify-self: center;
    align-self: center;
  }

  .compare-dropdown label {
    grid-column: 2;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>
