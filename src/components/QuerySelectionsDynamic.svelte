<script lang="ts">
  // Component that generates the inputs for selecting the variables to use to filter
  // the Incidence or Survival data
  // Note - this was originally designed solely for Incidence data and has been generalised
  // to handle Survival data as well, which has made the types much more complicated.
  // We use type assertions here as a relatively simple fix, but typing could be improved
  // if the statistics become more complicated.

  // IMPORTANT: this component does not handle updating the UI if the input "statistic"
  // is changed - it relies on being destroyed and recreated when the statistic is changed.

  import CheckboxGroup from "./CheckboxGroup.svelte";
  import SingleSelectDropdown from "./SingleSelectDropdown.svelte";
  import { STATISTICS_CONFIG } from "../utils/variables";
  import type { Statistic } from "../utils/variables";
  import type {
    IncidenceFilter,
    IncidenceFilterVariable,
    SurvivalFilter,
    SurvivalFilterVariable,
  } from "../types";

  // Props
  let {
    statistic,
    filter = $bindable(),
  }: {
    statistic: Statistic;
    filter: Filter;
  } = $props();

  // Helper functions to fix types - use assertions to tell Typescript which
  // types are being used based on the statistic
  function getVariableAll(variable: FilterVariable) {
    if (statistic === "incidence") {
      return STATISTICS_CONFIG.incidence.variableAll[
        variable as IncidenceFilterVariable
      ];
    }

    return STATISTICS_CONFIG.survival.variableAll[
      variable as SurvivalFilterVariable
    ];
  }

  function getVariableOptions(variable: FilterVariable) {
    if (statistic === "incidence") {
      return STATISTICS_CONFIG.incidence.variableOptions[
        variable as IncidenceFilterVariable
      ];
    }

    return STATISTICS_CONFIG.survival.variableOptions[
      variable as SurvivalFilterVariable
    ];
  }

  function getFilterLabel(variable: FilterVariable) {
    if (statistic === "incidence") {
      return STATISTICS_CONFIG.incidence.filterLabels[
        variable as IncidenceFilterVariable
      ];
    }

    return STATISTICS_CONFIG.survival.filterLabels[
      variable as SurvivalFilterVariable
    ];
  }

  // Get filter variables for the statistic
  const filterVariables = STATISTICS_CONFIG[statistic].filterVariables;

  type FilterVariable = IncidenceFilterVariable | SurvivalFilterVariable;
  type Filter = IncidenceFilter | SurvivalFilter;

  // --- Initial UI states ---

  // Variable selected for comparison using dropdown
  // Also keep track of previous selection so that those options can be cleared from the
  // filter variable when the comparison variable is changed
  let comparisonVariable = $state<FilterVariable | "">("");
  let previousComparisonVariable: FilterVariable | "" = "";

  // Whether to compare male and female

  let compareMaleFemale = $state(false);

  // Single select options - set to "all" values by default
  let singleSelections = $state(
    Object.fromEntries(
      filterVariables.map((variable) => [
        variable,
        getVariableAll(variable).value,
      ]),
    ),
  );

  // --- Variables to show in filter section ---

  let singleSelectVariables = $derived(
    filterVariables.filter(
      (variable) =>
        variable !== comparisonVariable &&
        !(variable === "sex" && compareMaleFemale),
    ),
  );

  // --- Helpers for creating components ---
  function getSingleSelectOptions(variable: FilterVariable) {
    return [getVariableAll(variable), ...getVariableOptions(variable)];
  }

  function setFilterValue(variable: FilterVariable, value: string[]) {
    if (statistic === "incidence") {
      (filter as IncidenceFilter)[variable as IncidenceFilterVariable] = value;
      return;
    }

    (filter as SurvivalFilter)[variable as SurvivalFilterVariable] = value;
  }

  // ---  Functions for UI updates ---

  // Handle changing comparison variable
  function handleComparisonChange() {
    // Clear the old comparison variable's comparison selections
    if (previousComparisonVariable) {
      setFilterValue(previousComparisonVariable, []);
    }

    // The newly selected comparison variable is no longer controlled
    // by its single-select dropdown - reset filter for that variable
    if (comparisonVariable) {
      setFilterValue(comparisonVariable, []);
    }

    // Also reset dropdown value for the corresponding single-select dropdown
    if (comparisonVariable) {
      singleSelections[comparisonVariable] =
        getVariableAll(comparisonVariable).value;
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

  function handleSingleSelectChange(variable: FilterVariable) {
    setFilterValue(variable, [singleSelections[variable]]);
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
      <span>by sex</span>
    </label>
    <div class="compare-dropdown">
      <span class="compare-bullet" aria-hidden="true">•</span>

      <label>
        <span>by </span>
        <div class="select select-compact">
          <select
            id="select-compare-variable"
            bind:value={comparisonVariable}
            onchange={handleComparisonChange}
          >
            <option value="">Select variable (optional)</option>

            {#each filterVariables as variable}
              {#if variable !== "sex"}
                <option value={variable}>
                  {getFilterLabel(variable)}
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
      <!-- branch to handle typing -->
      {#if statistic === "incidence"}
        <CheckboxGroup
          options={getVariableOptions(comparisonVariable)}
          bind:selectedValues={
            (filter as IncidenceFilter)[
              comparisonVariable as IncidenceFilterVariable
            ]
          }
        />
      {:else}
        <CheckboxGroup
          options={getVariableOptions(comparisonVariable)}
          bind:selectedValues={
            (filter as SurvivalFilter)[
              comparisonVariable as SurvivalFilterVariable
            ]
          }
        />
      {/if}
    {/if}
  </div>
  <hr />
  <h2 class="query-section">Additional filters</h2>
  <div class="query-inputs-filter">
    <div class="single-select-filters">
      {#each singleSelectVariables as variable}
        <SingleSelectDropdown
          label={getFilterLabel(variable)}
          options={getSingleSelectOptions(variable)}
          bind:selectedValue={singleSelections[variable]}
          onChange={() => handleSingleSelectChange(variable)}
        />
      {/each}
    </div>
  </div>
</div>
<hr />

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
