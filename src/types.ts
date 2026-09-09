import { 
    INCIDENCE_FILTER_VARIABLES, 
    INCIDENCE_LABEL_VARIABLES, 
    SURVIVAL_FILTER_VARIABLES,
    SURVIVAL_LABEL_VARIABLES,
    CANCER_TYPES
} from "./utils/variables"

// ---------------------
// --- UI components ---
// ---------------------

export const cancer_type = document.getElementById('cancer-type') as HTMLInputElement;
export const messageContainer = document.getElementById('search-message') as HTMLInputElement;
export const downloadLinkBtn = document.getElementById('download-link') as HTMLInputElement;	

// ------------
// --- Data ---
// ------------

// --- Incidence ---

// Raw incidence CSV data
export interface IncidenceCSVRow {
    diagnosisYear: string;
    ageBand: string;
    sex: string;
    dep: string;
    region: string;
    stage: string;
    route: string;
    count: string | number;
    rate: number;
    ciLb: number;
    ciUb: number;
};

// Object with data and metadata for one indicidence value (rate) 
// Created by filtering/aggregating IncidenceCSVRow data
// Unlike IncidenceCSVRow, ciLb, ciUb, and rate may be strings
export interface IncidenceProcessedRow {
  ageBand: string,
  ciLb: number,
  ciUb: number,
  count: string | number,
  dep: string,
  diagnosisYear: string,
  rate: number,
  region: string,
  route: string,
  sex: string,
  stage: string
};

// Possible keys for IncidenceFilter - must be in INCIDENCE_FILTER_VARIABLES
export type IncidenceFilterVariable =
    (typeof INCIDENCE_FILTER_VARIABLES)[number];

// Object for filtering Incidence spreadsheet
export type IncidenceFilter = {
    [K in IncidenceFilterVariable]: string[];
};

// --- Survival ---

// Raw survival CSV data
// Unlike incidence CSV data, 
// - has: quarterYear, survival
// - does not have: count, rate
export interface SurvivalCSVRow {
    quarterYear: number,
    survival: number,
    diagnosisYear: string;
    ageBand: string;
    sex: string;
    dep: string;
    region: string;
    stage: string;
    route: string;
    ciLb: number;
    ciUb: number;
};

// Object with data and metadata for one survival row (quarterYear survival value) 
// Created by filtering SurvivalCSVRow data
export interface SurvivalProcessedRow {
    quarterYear: number,
    survival: number,
    diagnosisYear: string;
    ageBand: string;
    sex: string;
    dep: string;
    region: string;
    stage: string;
    route: string;
    ciLb: number;
    ciUb: number;
};

// Possible keys for SurvivalFiler - must be in SURVIVAL_FILTER_VARIABLES
export type SurvivalFilterVariable = 
    (typeof SURVIVAL_FILTER_VARIABLES)[number];

// Object for filtering Survival spreadsheet
export type SurvivalFilter = {
    [K in SurvivalFilterVariable]: string[];
};

// --------------
// --- Charts ---
// --------------

// --- Incidence ---

// Incidence data used for each series (line) in a chart or table
export interface IncidenceBaseSeries<TYear> {
  name: string;
  years: TYear[]; // Will be string[] for IncidenceTableSeries and number[] for IncidenceChartSeries
  rates: number[];
  ciLb: number[];
  ciUb: number[];
  count: string[];
  variables: Partial<Record<typeof INCIDENCE_LABEL_VARIABLES[number], string>>;
}

export type IncidenceChartSeries = IncidenceBaseSeries<number>;
export type IncidenceTableSeries = IncidenceBaseSeries<string>;

// Chart labels info (for any variables that are not "all")
// "variables" are the variable: value pairs before they were concatenated into the series name
export interface IncidenceSeriesLabels {
    name: string; // full label
    variables: Partial<Record<typeof INCIDENCE_LABEL_VARIABLES[number], string>>;
}

// --- Survival ---

// Survival data used for each series (line) in a chart or table
export interface SurvivalSeries {
  name: string;
  quarterYear: number[];
  survival: number[];
  ciLb: number[];
  ciUb: number[];
  variables: Partial<Record<typeof SURVIVAL_LABEL_VARIABLES[number], string>>;
}

// Chart labels info (for any variables that are not "all")
// "variables" are the variable: value pairs before they were concatenated into the series name
export interface SurvivalSeriesLabels {
    name: string; // full label
    variables: Partial<Record<typeof SURVIVAL_LABEL_VARIABLES[number], string>>;
}

// --- Colors ---

// Create colormapping for chart
export interface ChartColorMapping {
    key: typeof INCIDENCE_LABEL_VARIABLES[number] | typeof SURVIVAL_LABEL_VARIABLES[number] |  null;
    colors: Record<string, string>;
}

// ------------------------------------------------------------------------
// --- Types to descript relationship between statistic and other types ---
// ------------------------------------------------------------------------

export type SearchQuery =
    | {
        statistic: "incidence";
        cancer: typeof CANCER_TYPES[number];
        filter: IncidenceFilter;
    }
    | {
        statistic: "survival";
        cancer: typeof CANCER_TYPES[number];
        filter: SurvivalFilter;
    };

// Config for types by statistic
export type StatisticTypes = {
    incidence: {
        filter: IncidenceFilter;
        filterVariable: IncidenceFilterVariable;
    };
    survival: {
        filter: SurvivalFilter;
        filterVariable: SurvivalFilterVariable;
    };
};