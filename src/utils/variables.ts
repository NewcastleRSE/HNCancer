/*
Descriptions of the variables used to filter/compare cancer incidence and survival.

Used for charts/tables and generating UI components.

Uses separate variables for different statistics (incidence and survival) for simplicity,
although could potentially be refactored to reduce redundancy.
*/

import type { IncidenceFilterVariable } from "../types";

// -----------------
// --- Incidence ---
// -----------------

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
export const INCIDENCE_FILTER_LABELS: Record<
  IncidenceFilterVariable,
  string
> = {
    dep: "Deprivation",
    region: "Region",
    sex: "Sex",
    ageBand: "Age",
    route: "Route",
    stage: "Stage",
} as const;

// Options for each variable
// Values must match possible values in CSV tables, but "all" values are excluded here -
// these are the possible levels when a variable is used as a filter.
export const INCIDENCE_VARIABLE_OPTIONS = {
    dep: [
        { value: 'IMD1', label: 'IMD1 (most deprived)' },
        { value: 'IMD2', label: 'IMD2' },
        { value: 'IMD3', label: 'IMD3' },
        { value: 'IMD4', label: 'IMD4' },
        { value: 'IMD5', label: 'IMD5 (least deprived)' },
    ],

    region: [
        { value: 'East Midlands', label: 'East Midlands' },
        { value: 'East of England', label: 'East of England' },
        { value: 'London', label: 'London' },
        { value: 'North East', label: 'North East' },
        { value: 'North West', label: 'North West' },
        { value: 'South East', label: 'South East' },
        { value: 'South West', label: 'South West' },
        { value: 'West Midlands', label: 'West Midlands' },
        { value: 'Yorkshire and The Humber', label: 'Yorkshire and the Humber' },
    ],

    // Note - sex does not match current UI component since there is also a 
    // "Male and Female" option
    sex: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
    ],

    ageBand: [
        { value: '0-49', label: '0-49' },
        { value: '50-54', label: '50-54' },
        { value: '55-59', label: '55-59' },
        { value: '60-64', label: '60-64' },
        { value: '65-69', label: '65-69' },
        { value: '70-74', label: '70-74' },
        { value: '75-79', label: '75-79' },
        { value: '80-84', label: '80-84' },
        { value: '85-89', label: '85-89' },
        { value: '90+', label: '90+' },
    ],

    route: [
        { value: "Emergency", label: "Emergency"},
        { value: "Non-emergency", label: "Non-Emergency"}
    ],

    stage: [
        { value: "Early", label: "Early Stage"},
        { value: "Advanced", label: "Advanced Stage"}
    ],

} as const;

// "All" options for each variable
// Values correspond to spreadsheet values for each variable and should not be changed 
// unless spreadsheet format changes.
// Labels can be used to label UI elements; updated these will only impact the displayed
// text in the UI.
export const INCIDENCE_VARIABLE_ALL = {
    dep: {value: "All IMD Quintiles", label: "All IMD Quintiles"},
    region: {value: "All Regions", label: "All Regions"},
    sex: {value: "All Persons", label: "All Persons"},
    ageBand: {value: "all ages", label: "All Ages"},
    route: {value: "All Routes", label: "All Routes"},
    stage: {value: "All Stages", label: "All Stages"}

} as const;

// ----------------------
// --- All statistics ---
// ----------------------

// Type of each variable (continuous or categorical)
// Used for both survival and incidence data
export const VARIABLE_TYPE = {
    dep: "continuous",
    region: "categorical",
    sex: "categorical",
    ageBand: "continuous",
    route: "categorical",
    stage: "categorical"
} as const;

// ----------------------------
// --- STATISTICS CONSTANTS ---
// ----------------------------

/* Array of possible statistics */
const CANCER_STATISTICS = ["incidence"] as const;

/* Variables for each statistic */
const STATISTIC_CONFIG = {
  incidence: {
    // Values for variables in spreadsheet
    variableOptions: INCIDENCE_VARIABLE_OPTIONS,
    variableAll: INCIDENCE_VARIABLE_ALL,
    // Variables used to filter data in query
    filterVariables: INCIDENCE_FILTER_VARIABLES,
    filterLabels: INCIDENCE_FILTER_LABELS
  }
} as const;

// --- HELPER FUNCTIONS ---

// Conversion function from values to labels
export function getVariableValueLabels(
  key: IncidenceFilterVariable,
  values: string[],
  statistic: typeof CANCER_STATISTICS[number]
): string[] {

    // Get variables for statistic
    const { variableOptions, variableAll } = STATISTIC_CONFIG[statistic];

    // Get options for specified variable
    const options = variableOptions[key as keyof typeof variableOptions];

    // Map values to options
    return values.map(value => {

        // Check for an "all" value first
        const allOption = variableAll[key as keyof typeof variableAll];

        if (allOption?.value === value) {
        return allOption.label;
        }

        // Otherwise find the matching variable option
        const option = options?.find(option => option.value === value);

        return option?.label ?? value;
    });
}