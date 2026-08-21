import { VARIABLE_ALL, VARIABLE_OPTIONS } from "./variables";
import type { IncidenceFilterVariable, IncidenceFilter, CSVRow, ProcessedRow } from "../types";

/* Functions for querying incidence and survival spreadsheets */

// --- Constants ---

// Variables used to filter spreadsheet (use spreadsheet column names)
export const INCIDENCE_FILTER_VARIABLES = [
    "dep",
    "region",
    "sex",
    "ageBand",
    "route",
    "stage",
] as const;

// Labels for each variable for the UI
export const INCIDENCE_FILTER_LABELS = {
    dep: "Deprivation",
    region: "Region",
    sex: "Sex",
    ageBand: "Age",
    route: "Route",
    stage: "Stage",
} as const;

// --- Helper functions and types used locally ---

/**
 * Apply an IncidenceFilter to a set of rows.
 *
 * Every filter variable is an AND constraint.
 * If a variable contains an array, the values within that
 * array use OR logic.
 */
function queryIncidenceRows(
    rows: CSVRow[],
    filter: Partial<IncidenceFilter> | FilterSelection,
): ProcessedRow[] {
    return rows.filter((row) =>
        INCIDENCE_FILTER_VARIABLES.every((variable) => {
            const filterValue = filter[variable];

            if (filterValue === undefined) {
                return true;
            }

            return filterValue.includes(row[variable] ?? "");
        }),
    );
}

/**
 * Return the variables which have multiple selected values.
 */
function getMultiSelectVariables(
  filter: IncidenceFilter,
): IncidenceFilterVariable[] {
  return INCIDENCE_FILTER_VARIABLES.filter(
    (variable) => filter[variable].length > 1,
  );
}

/**
 * Validate incidence filter.
 * 
 * Current restriction:
 * - Normally only one variable can contain multiple values.
 * - sex may also contain multiple values at the same time as
 *   one other variable.
 */
function validateIncidenceFilter(filter: IncidenceFilter): void {
    const multiVariables = getMultiSelectVariables(filter);

    if (multiVariables.length <= 1) {
        return;
    }

    if (multiVariables.length === 2 && multiVariables.includes("sex")) {
        return;
    }

    throw new Error(
        "No records are currently available matching this combination of options.",
    );
}

/**
 * Build a filter containing only the fixed/scalar values.
 *
 * Multi-select variables are removed because they will be
 * applied separately when the individual result groups are built.
 */
function buildPreQueryFilter(
    filter: IncidenceFilter,
    multiVariables: IncidenceFilterVariable[],
): Partial<IncidenceFilter> {
    const preQueryFilter: Partial<IncidenceFilter> = {};

    for (const variable of INCIDENCE_FILTER_VARIABLES) {
        if (multiVariables.includes(variable)) {
            continue;
        }

        preQueryFilter[variable] = filter[variable];
    }

    return preQueryFilter;
}

type FilterSelection = Partial<
    Record<IncidenceFilterVariable, string>
>;
/**
 * Generate all combinations of the selected values in the
 * multi-select variables.
 *
 * Example:
 *
 * dep: ["IMD1", "IMD2"]
 * sex: ["Male", "Female"]
 *
 * becomes:
 *
 * [
 *   { dep: "IMD1", sex: "Male" },
 *   { dep: "IMD1", sex: "Female" },
 *   { dep: "IMD2", sex: "Male" },
 *   { dep: "IMD2", sex: "Female" }
 * ]
 */
function buildSelectionCombinations(
    filter: IncidenceFilter,
    multiVariables: IncidenceFilterVariable[],
): FilterSelection[] {
    if (multiVariables.length === 0) {
        return [{}];
    }

    let combinations: FilterSelection[] = [{}];

    for (const variable of multiVariables) {
        const values = filter[variable];

        const nextCombinations: FilterSelection[] = [];

        for (const combination of combinations) {
            for (const value of values) {
                nextCombinations.push({
                    ...combination,
                    [variable]: value,
                });
            }
        }

        combinations = nextCombinations;
    }

    return combinations;
}

// --- Exported functions ---


/**
 * Creates a processed IncidenceFilter by:
 * - ordering selections according to VARIABLE_OPTIONS
 * - replacing empty selections with the corresponding "all" value
 *
 * The original filter is not modified.
 */
export function processIncidenceFilter(
  filter: IncidenceFilter,
): IncidenceFilter {
  const processedFilter = { ...filter };

  // Sort selections according to VARIABLE_OPTIONS.
  for (const variable of INCIDENCE_FILTER_VARIABLES) {
    const optionOrder: string[] = VARIABLE_OPTIONS[variable].map(
      (option) => option.value,
    );

    processedFilter[variable] = [...processedFilter[variable]].sort(
      (a, b) => optionOrder.indexOf(a) - optionOrder.indexOf(b),
    );
  }

  // Replace empty selections with the corresponding "all" value.
  for (const variable of INCIDENCE_FILTER_VARIABLES) {
    if (processedFilter[variable].length === 0) {
      processedFilter[variable] = [VARIABLE_ALL[variable].value];
    }
  }

  return processedFilter;
}

/**
 * Run an IncidenceFilter against the CSV rows.
 *
 * Returns one ProcessedRow[] for every logical result/series.
 *
 * A single-selection query therefore returns:
 *
 * [
 *   [row1, row2, row3, ...]
 * ]
 *
 * A multi-selection query (for example, for IMD1, IMD2, and IMD3) returns:
 *
 * [
 *   [IMD1 rows...],
 *   [IMD2 rows...],
 *   [IMD3 rows...]
 * ]
 */
export function queryIncidenceFilter(
    rows: CSVRow[],
    filter: IncidenceFilter,
): ProcessedRow[][] {
    validateIncidenceFilter(filter);

    const multiVariables = getMultiSelectVariables(filter);

    // ---------------------------------------------------------
    // No multi-selection:
    //
    // Just perform one query.
    // ---------------------------------------------------------

    if (multiVariables.length === 0) {
        const matchedRows = queryIncidenceRows(rows, filter);

        return matchedRows.length > 0 ? [matchedRows] : [];
    }

    // ---------------------------------------------------------
    // Pre-query:
    //
    // Apply all fixed/scalar constraints first.
    // ---------------------------------------------------------

    const preQueryFilter = buildPreQueryFilter(
        filter,
        multiVariables,
    );

    const preQueryRows = queryIncidenceRows(
        rows,
        preQueryFilter,
    );

    // Nothing survived the fixed constraints.
    if (preQueryRows.length === 0) {
        return [];
    }

    // ---------------------------------------------------------
    // Generate one filter combination for every logical result.
    // ---------------------------------------------------------

    const combinations = buildSelectionCombinations(
        filter,
        multiVariables,
    );

    // ---------------------------------------------------------
    // Query the pre-query results for each combination.
    // ---------------------------------------------------------

    const groupedResults: ProcessedRow[][] = [];

    for (const combination of combinations) {
        const matchedRows = queryIncidenceRows(
            preQueryRows,
            combination,
        );

        if (matchedRows.length > 0) {
            groupedResults.push(matchedRows);
        }
    }

    return groupedResults;
}

/**
 * Creates an empty IncidenceFilter with an empty selection for each variable.
 */
export function initIncidenceFilter(): IncidenceFilter {
    return INCIDENCE_FILTER_VARIABLES.reduce(
        (filter, variable) => {
            filter[variable] = [];
            return filter;
        },
        {} as IncidenceFilter
    );
}