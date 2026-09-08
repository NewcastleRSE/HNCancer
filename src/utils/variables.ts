/*
Descriptions of the variables used to filter/compare cancer incidence and survival.

Used for charts/tables and generating UI components.

Uses separate variables for different statistics (incidence and survival) for simplicity,
although could potentially be refactored to reduce redundancy.
*/

import type { IncidenceFilterVariable, SurvivalFilterVariable } from "../types";

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

// Variables used to create series names/labels
// Info from these variables is also used for symbol/colour encoding
// Order determines order of labels and prioritisation for colour encoding 
// (if multiple variables have different values across the series)
export const INCIDENCE_LABEL_VARIABLES = [
    'sex',
    'ageBand',
    'dep',
    'region',
    'route',
    'stage'
] as const;

// Options for each variable that is used to filter the Indicence data 
// Values must match possible values in CSV tables, but "all" values are excluded here -
// these are the possible levels when a variable is used as a filter.
// See INCIDENCE_VARIABLE_ALL for "all" values.
export const INCIDENCE_VARIABLE_OPTIONS = {
    dep: [
        { value: 'IMD Q1', label: 'IMD Q1 (most deprived)' },
        { value: 'IMD Q2', label: 'IMD Q2' },
        { value: 'IMD Q3', label: 'IMD Q3' },
        { value: 'IMD Q4', label: 'IMD Q4' },
        { value: 'IMD Q5', label: 'IMD Q5 (least deprived)' },
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
        { value: "Early", label: "Early Stage (TNM I and II)"},
        { value: "Advanced", label: "Advanced Stage (TNM III and IV)"}
    ],

} as const;

// "All" options for each variable
// Values correspond to spreadsheet values for each variable and should not be changed 
// unless spreadsheet format changes.
// Labels can be used to label UI elements; updating these will only impact the displayed
// text in the UI.
export const INCIDENCE_VARIABLE_ALL = {
    dep: {value: "All IMD Quintiles", label: "All IMD Quintiles"},
    region: {value: "All Regions", label: "All Regions"},
    sex: {value: "All Persons", label: "All Persons"},
    ageBand: {value: "all ages", label: "All Ages"},
    route: {value: "All Routes", label: "All Routes"},
    stage: {value: "All Stages", label: "All Stages"}

} as const;

// ----------------
// --- SURVIVAL ---
// ----------------

// Survival data has a similar format to Incidence data, but adds "diagnosisYear" as an
// additional variable used to filter the data (x and y data are instead quarterYear and survival).
// Most of these constants therefore build off of Incidence constants to add diagnosisYear information.

// Variables used to filter spreadsheet (use spreadsheet column names)
export const SURVIVAL_FILTER_VARIABLES = [
    "diagnosisYear",
    ...INCIDENCE_FILTER_VARIABLES
] as const;

// Labels for each variable for the UI
export const SURVIVAL_FILTER_LABELS: Record<
  SurvivalFilterVariable,
  string
> = {
    diagnosisYear: "Year diagnosed",
    ...INCIDENCE_FILTER_LABELS
} as const;

// Variables used to create series names/labels
// Info from these variables is also used for symbol/colour encoding
// Order determines order of labels and prioritisation for colour encoding 
// (if multiple variables have different values across the series)
export const SURVIVAL_LABEL_VARIABLES = [
    'diagnosisYear',
    ...INCIDENCE_LABEL_VARIABLES
] as const;

// Options for each variable that is used to filter the Survival data.
// These are the same as for Indicence data, with the addition of the diagnosisYear
// variable.
// Values must match possible values in CSV tables, but "all" values are excluded here -
// these are the possible levels when a variable is used as a filter.
// See SURVIVAL_VARIABLE_ALL for "all" values.
export const SURVIVAL_VARIABLE_OPTIONS = {

    // Add incidence variables
    ...INCIDENCE_VARIABLE_OPTIONS,

    // Add diagnosisYear as additional variable
    diagnosisYear: [
        { value: '2016', label: '2016' },
        { value: '2017', label: '2017' },
        { value: '2018', label: '2018' },
        { value: '2019', label: '2019' },
        { value: '2020', label: '2020' },
        { value: '2021', label: '2021' },
    ],
} as const;

// "All" options for each variable
// Values correspond to spreadsheet values for each variable and should not be changed 
// unless spreadsheet format changes.
// Labels can be used to label UI elements; updating these will only impact the displayed
// text in the UI.
export const SURVIVAL_VARIABLE_ALL = {
    diagnosisYear: {value: "All Years", label: "All Years"},
    ...INCIDENCE_VARIABLE_ALL

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
    stage: "categorical",
    diagnosisYear: "continuous",
} as const;

// ----------------------------
// --- STATISTICS CONSTANTS ---
// ----------------------------

/* Possible statistics */
export const CANCER_STATISTICS = ["incidence", "survival"] as const;
export type Statistic = typeof CANCER_STATISTICS[number];

/* Cancer statistics options, with labels */
export const CANCER_STATISTICS_OPTIONS: {
  value: Statistic,
  label: string
}[] = [
    {value: "incidence", label: "Incidence"},
    {value: "survival", label: "Survival"}
]

/* Variables for each statistic */
export const STATISTICS_CONFIG = {
  incidence: {
    // Values for variables in spreadsheet
    variableOptions: INCIDENCE_VARIABLE_OPTIONS,
    variableAll: INCIDENCE_VARIABLE_ALL,
    // Variables used to filter data in query
    filterVariables: INCIDENCE_FILTER_VARIABLES,
    filterLabels: INCIDENCE_FILTER_LABELS,
    // Variables used to create chart labels
    labelVariables: INCIDENCE_LABEL_VARIABLES
  },
  survival: {
    // Values for variables in spreadsheet
    variableOptions: SURVIVAL_VARIABLE_OPTIONS,
    variableAll: SURVIVAL_VARIABLE_ALL,
    // Variables used to filter data in query
    filterVariables: SURVIVAL_FILTER_VARIABLES,
    filterLabels: SURVIVAL_FILTER_LABELS,
    // Variables used to create chart labels
    labelVariables: SURVIVAL_LABEL_VARIABLES
  }
} as const satisfies Record<Statistic, object>;

// --------------------
// --- CANCER TYPES ---
// --------------------

export const CANCER_TYPES = [
    "Head and Neck",
    "Laryngeal",
	"Oral Cavity", 
	"Oropharyngeal",
	"Other"
] as const;

// ------------------------
// --- HELPER FUNCTIONS ---
// ------------------------

// Conversion function from values to labels
export function getVariableValueLabels(
  key: IncidenceFilterVariable,
  values: string[],
  statistic: typeof CANCER_STATISTICS[number]
): string[] {

    // Get variables for statistic
    const { variableOptions, variableAll } = STATISTICS_CONFIG[statistic];

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