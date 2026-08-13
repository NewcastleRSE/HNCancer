/*
Descriptions of the variables used to filter/compare cancer rates.

Used for charts (could also be used for UI components).
*/

// Options for each variable
// Values must match possible values in CSV tables, but "all" values are excluded here -
// these are the possible levels when a variable is used as a filter.
export const VARIABLE_OPTIONS = {
    dep: [
        { value: 'IMD1', label: 'IMD1' },
        { value: 'IMD2', label: 'IMD2' },
        { value: 'IMD3', label: 'IMD3' },
        { value: 'IMD4', label: 'IMD4' },
        { value: 'IMD5', label: 'IMD5' },
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
        { value: "Early Stage", label: "Early Stage"},
        { value: "Late Stage", label: "Late Stage"}
    ],

} as const;

// TODO: object of "all" options for each variable

// Type of each variable (continuous or categorical)
export const VARIABLE_TYPE = {
    dep: "continuous",
    region: "categorical",
    sex: "categorical",
    ageBand: "continuous",
    route: "categorical",
    stage: "categorical"
} as const;

