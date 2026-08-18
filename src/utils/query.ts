import type { IncidenceFilter, CSVRow, ProcessedRow } from "../types";

/* Functions for querying incidence and survival spreadsheets */

// --- Helper functions and types used locally ---

type IncidenceFilterVariable = keyof IncidenceFilter;

const INCIDENCE_FILTER_VARIABLES: IncidenceFilterVariable[] = [
    "dep",
    "region",
    "sex",
    "ageBand",
    "route",
    "stage",
];

/**
 * Returns true when a row value satisfies a filter value.
 *
 * String filter:
 *     rowValue === filterValue
 *
 * Array filter:
 *     rowValue matches any selected value
 */
function matchesFilterValue(
    rowValue: string | undefined,
    filterValue: string | string[],
): boolean {
    if (Array.isArray(filterValue)) {
        return filterValue.includes(rowValue ?? "");
    }

    return rowValue === filterValue;
}

/**
 * Apply an IncidenceFilter to a set of rows.
 *
 * Every filter variable is an AND constraint.
 * If a variable contains an array, the values within that
 * array use OR logic.
 */
function queryIncidenceRows(
    rows: CSVRow[],
    filter: Partial<IncidenceFilter>,
): ProcessedRow[] {
    return rows.filter((row) =>
        INCIDENCE_FILTER_VARIABLES.every((variable) => {
            const filterValue = filter[variable];

            // Variable isn't part of this particular filter.
            if (filterValue === undefined) {
                return true;
            }

            return matchesFilterValue(row[variable], filterValue);
        }),
    );
}

/**
 * Return the variables which have multiple selected values.
 */
function getMultiSelectVariables(
    filter: IncidenceFilter,
): IncidenceFilterVariable[] {
    return INCIDENCE_FILTER_VARIABLES.filter((variable) =>
        Array.isArray(filter[variable]),
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

type FilterSelection = Partial<IncidenceFilter>;

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

        if (!Array.isArray(values)) {
            continue;
        }

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

// --- Exported functions ---

