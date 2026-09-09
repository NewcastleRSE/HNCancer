import { STATISTICS_CONFIG } from "./variables";
import type { IncidenceFilter, SurvivalFilter, IncidenceCSVRow, SurvivalCSVRow } from "../types";

/* Functions for querying incidence and survival spreadsheets */

// --- Helper functions and types used locally ---

type FilterSelection<T extends string> = Partial<
    Record<T, string>
>;


/**
 * Apply a Filter to a set of rows.
 *
 * Every filter variable is an AND constraint.
 * If a variable contains an array, the values within that
 * array use OR logic.
 */
function queryRows<
    TFilterVariable extends string,
    TRow extends Record<TFilterVariable, string | undefined>,
>(
    rows: TRow[],
    filter:
        | Partial<Record<TFilterVariable, string[]>>
        | FilterSelection<TFilterVariable>,
    filterVariables: readonly TFilterVariable[],
): TRow[] {
    return rows.filter((row) =>
        filterVariables.every((variable) => {
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
function getMultiSelectVariables<T extends string>(
    filter: Record<T, string[]>,
    filterVariables: readonly T[],
): T[] {
    return filterVariables.filter(
        (variable) => filter[variable].length > 1,
    );
}

/**
 * Validate Filter.
 * 
 * Current restriction:
 * - Normally only one variable can contain multiple values.
 * - sex may also contain multiple values at the same time as
 *   one other variable.
 */
function validateFilter<T extends string>(
    filter: Record<T, string[]>,
    filterVariables: readonly T[],
): void {
    const multiVariables = getMultiSelectVariables(
        filter,
        filterVariables,
    );

    if (multiVariables.length <= 1) {
        return;
    }

    if (
        multiVariables.length === 2 &&
        multiVariables.includes("sex" as T)
    ) {
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
function buildPreQueryFilter<T extends string>(
    filter: Record<T, string[]>,
    multiVariables: T[],
    filterVariables: readonly T[],
): Partial<Record<T, string[]>> {
    const preQueryFilter: Partial<Record<T, string[]>> = {};

    for (const variable of filterVariables) {
        if (multiVariables.includes(variable)) {
            continue;
        }

        preQueryFilter[variable] = filter[variable];
    }

    return preQueryFilter;
}

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
function buildSelectionCombinations<T extends string>(
    filter: Record<T, string[]>,
    multiVariables: T[],
): FilterSelection<T>[] {
    if (multiVariables.length === 0) {
        return [{}];
    }

    let combinations: FilterSelection<T>[] = [{}];

    for (const variable of multiVariables) {
        const values = filter[variable];

        const nextCombinations: FilterSelection<T>[] = [];

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
 * Processes filter values by:
 * - ordering selections according to the variable options
 * - replacing empty selections with the corresponding "all" value
 *
 * The original filter is not modified.
 */
function processFilterValues<T extends string>(
    filter: Record<T, string[]>,
    filterVariables: readonly T[],
    variableOptions: {
        readonly [K in T]: readonly { value: string }[];
    },
    variableAll: {
        readonly [K in T]: { value: string };
    },
): Record<T, string[]> {
    const processedFilter = { ...filter };

    for (const variable of filterVariables) {
        const optionOrder = variableOptions[variable].map(
            (option) => option.value,
        );

        processedFilter[variable] = [...processedFilter[variable]].sort(
            (a, b) =>
                optionOrder.indexOf(a) - optionOrder.indexOf(b),
        );
    }

    for (const variable of filterVariables) {
        if (processedFilter[variable].length === 0) {
            processedFilter[variable] = [
                variableAll[variable].value,
            ];
        }
    }

    return processedFilter;
}
/**
 * Processes an IncidenceFilter.
 */
function processIncidenceFilter(
    filter: IncidenceFilter,
): IncidenceFilter {
    const config = STATISTICS_CONFIG.incidence;

    return processFilterValues(
        filter,
        config.filterVariables,
        config.variableOptions,
        config.variableAll,
    );
}

/**
 * Processes a SurvivalFilter.
 */
function processSurvivalFilter(
    filter: SurvivalFilter,
): SurvivalFilter {
    const config = STATISTICS_CONFIG.survival;

    return processFilterValues(
        filter,
        config.filterVariables,
        config.variableOptions,
        config.variableAll,
    );
}


/**
 * Run a Filter against the CSV rows.
 *
 * Returns one IncidenceProcessedRow[] or one SurvivalProcessedRow[] for every logical 
 * result/series.
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
function queryFilterRows<T extends string>(
    rows: Record<T, string | undefined>[],
    filter: Record<T, string[]>,
    filterVariables: readonly T[],
): Record<T, string | undefined>[][] {
    const multiVariables = getMultiSelectVariables(
        filter,
        filterVariables,
    );

    // ---------------------------------------------------------
    // No multi-selection:
    //
    // Just perform one query.
    // ---------------------------------------------------------

    if (multiVariables.length === 0) {
        const matchedRows = queryRows(
            rows,
            filter,
            filterVariables,
        );

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
        filterVariables,
    );

    const preQueryRows = queryRows(
        rows,
        preQueryFilter,
        filterVariables,
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

    const groupedResults: Record<T, string | undefined>[][] = [];

    for (const combination of combinations) {
        const matchedRows = queryRows(
            preQueryRows,
            combination,
            filterVariables,
        );

        if (matchedRows.length > 0) {
            groupedResults.push(matchedRows);
        }
    }

    return groupedResults;
}

// --- Exported functions ---

/**
 * Process a filter - see processFilterValues
 */

type ProcessFilterArgs =
    | {
        statistic: "incidence";
        filter: IncidenceFilter;
    }
    | {
        statistic: "survival";
        filter: SurvivalFilter;
    };


export function processFilter(
    args: ProcessFilterArgs,
): IncidenceFilter | SurvivalFilter {
    if (args.statistic === "incidence") {
        return processIncidenceFilter(args.filter);
    }

    return processSurvivalFilter(args.filter);
}


type QueryFilterArgs =
    | {
        statistic: "incidence";
        rows: IncidenceCSVRow[];
        filter: IncidenceFilter;
    }
    | {
        statistic: "survival";
        rows: SurvivalCSVRow[];
        filter: SurvivalFilter;
    };

export function queryFilter(args: QueryFilterArgs) {
    if (args.statistic === "incidence") {
        return queryFilterRows(
            args.rows,
            args.filter,
            STATISTICS_CONFIG.incidence.filterVariables,
        );
    } else if (args.statistic === "survival") {
        return queryFilterRows(
            args.rows,
            args.filter,
            STATISTICS_CONFIG.survival.filterVariables,
        );
    } else {
        throw new Error("Unsupported statistic.");
    }
}

/**
 * Creates an empty IncidenceFilter or SurvivalFilter with an empty selection for each 
 * variable.
 */
export function initFilter<T extends string>(
    filterVariables: readonly T[],
): Record<T, string[]> {
    return filterVariables.reduce(
        (filter, variable) => {
            filter[variable] = [];
            return filter;
        },
        {} as Record<T, string[]>,
    );
}