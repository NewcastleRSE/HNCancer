import { INCIDENCE_FILTER_VARIABLES, INCIDENCE_LABEL_VARIABLES } from "./utils/variables"

// --- UI components ---
export const cancer_type = document.getElementById('cancer-type') as HTMLInputElement;
export const messageContainer = document.getElementById('search-message') as HTMLInputElement;
export const downloadLinkBtn = document.getElementById('download-link') as HTMLInputElement;	

// --- Data ---

// --- Raw incidence CSV data ---
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
}
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
}

// Possible keys for IncidenceFilter - must be in INCIDENCE_FILTER_VARIABLES
export type IncidenceFilterVariable =
    (typeof INCIDENCE_FILTER_VARIABLES)[number];

// Object for filtering Incidence spreadsheet
// TODO: Make the values more specific based on INCIDENCE_VARIABLE_OPTIONS and INCIDENCE_VARIABLE_ALL
// spreadsheet values
export type IncidenceFilter = {
    [K in IncidenceFilterVariable]: string[];
};

// --- Charts ---

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

// Create colormapping for chart
export interface ChartColorMapping {
    key: typeof INCIDENCE_LABEL_VARIABLES[number] | null;
    colors: Record<string, string>;
}