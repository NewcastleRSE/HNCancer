import { CHART_LABEL_VARIABLES } from "./utils/charts"
import { INCIDENCE_FILTER_VARIABLES } from "./utils/query"

export interface CSVRow {
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


// used in all searches
export const year_input = document.getElementById('year-input') as HTMLInputElement;
export const deprivation_input = document.getElementById('deprivation-input') as HTMLInputElement;

// sex checkboxes
export const male_checkbox = document.getElementById('maleckbox') as HTMLInputElement;
export const female_checkbox = document.getElementById('femaleckbox') as HTMLInputElement;
// age checkboxes
export const age049checkbox = document.getElementById('0-49ckbox') as HTMLInputElement;
export const age5054checkbox = document.getElementById('50-54ckbox') as HTMLInputElement;
export const age5559checkbox = document.getElementById('55-59ckbox') as HTMLInputElement;
export const age6064checkbox = document.getElementById('60-64ckbox') as HTMLInputElement;
export const age6569checkbox = document.getElementById('65-69ckbox') as HTMLInputElement;
export const age7074checkbox = document.getElementById('70-74ckbox') as HTMLInputElement;
export const age7579checkbox = document.getElementById('75-79ckbox') as HTMLInputElement;
export const age8084checkbox = document.getElementById('80-84ckbox') as HTMLInputElement;
export const age8589checkbox = document.getElementById('85-89ckbox') as HTMLInputElement;
export const age90checkbox = document.getElementById('90ckbox') as HTMLInputElement;
// deprivation checkboxes
export const imd1checkbox = document.getElementById('imd1ckbox') as HTMLInputElement;
export const imd2checkbox = document.getElementById('imd2ckbox') as HTMLInputElement;
export const imd3checkbox = document.getElementById('imd3ckbox') as HTMLInputElement;
export const imd4checkbox = document.getElementById('imd4ckbox') as HTMLInputElement;
export const imd5checkbox = document.getElementById('imd5ckbox') as HTMLInputElement;
// region checkboxes
export const emcheckbox = document.getElementById('emckbox') as HTMLInputElement;
export const eecheckbox = document.getElementById('eeckbox') as HTMLInputElement;
export const locheckbox = document.getElementById('lockbox') as HTMLInputElement;
export const necheckbox = document.getElementById('neckbox') as HTMLInputElement;
export const nwcheckbox = document.getElementById('nwckbox') as HTMLInputElement;
export const secheckbox = document.getElementById('seckbox') as HTMLInputElement;
export const swcheckbox = document.getElementById('swckbox') as HTMLInputElement;
export const wmcheckbox = document.getElementById('wmckbox') as HTMLInputElement;
export const yhcheckbox = document.getElementById('yhckbox') as HTMLInputElement;
// stage checkboxes
export const earlyckbox = document.getElementById('earlyckbox') as HTMLInputElement;
export const advckbox = document.getElementById('advckbox') as HTMLInputElement;
// route checkboxes
export const emergckbox = document.getElementById('emergckbox') as HTMLInputElement;
export const nonemergckbox = document.getElementById('nonemergckbox') as HTMLInputElement;

export const cancer_type = document.getElementById('cancer-type') as HTMLInputElement;
export const resultsContainer = document.getElementById('search-results') as HTMLInputElement;
export const confidenceBandsChart = document.getElementById('confidence-bands-chart') as HTMLInputElement;
export const downloadLinkBtn = document.getElementById('download-link') as HTMLInputElement;	
export const stage_input = document.getElementById('stage-input') as HTMLInputElement;
export const region_input = document.getElementById('region-input') as HTMLInputElement;
export const route_input = document.getElementById('route-input') as HTMLInputElement;
export const chart_area = document.getElementById('csv-chart') as HTMLInputElement;

// --- Data ---

// Object with data and metadata for one indicidence value (rate) 
// Created by filtering/aggregating CSVRow data
// Unlike CSVRow, ciLb, ciUb, and rate may be strings
export interface ProcessedRow {
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
// TODO: Make the values more specific based on VARIABLE_OPTIONS and VARIABLE_ALL
// spreadsheet values
export type IncidenceFilter = {
    [K in IncidenceFilterVariable]: string[];
};

// --- Charts ---

// Data used for each series (line) in a chart or table
export interface ChartSeries {
    name: string;
    years: number[];
    rates: number[];
    ciLb: number[];
    ciUb: number[];
    count: string[];
    variables: Partial<Record<typeof CHART_LABEL_VARIABLES[number], string>>;
}

// Chart labels info (for any variables that are not "all")
// "variables" are the variable: value pairs before they were concatenated into the series name
export interface SeriesLabels {
    name: string; // full label
    variables: Partial<Record<typeof CHART_LABEL_VARIABLES[number], string>>;
}

// Create colormapping for chart
export interface ChartColorMapping {
    key: typeof CHART_LABEL_VARIABLES[number] | null;
    colors: Record<string, string>;
}