export interface CSVRow {
    id: number;
    table: string;
    diagnosisYear: string;
    ageSpecificIncidenceAge0_49: number;
    ageSpecificIncidenceAge50_54: number;
    ageSpecificIncidenceAge55_59: number;
    ageSpecificIncidenceAge60_64: number;
    ageSpecificIncidenceAge65_69: number;
    ageSpecificIncidenceAge70_74: number;
    ageSpecificIncidenceAge75_79: number;
    ageSpecificIncidenceAge80_84: number;
    ageSpecificIncidenceAge85_89: number;
    ageSpecificIncidenceAge90: number;
    ageStandardisedIncidence: number;
} 

export interface CSVDataInput {
	yearQuery: string;
	keyQuery: string;
	keyQueryTwo: string;
	csvText: string;
}

export interface CSVData {
	matchedRows: CSVRow[];
	matchedRowsSecond: CSVRow[];
}

// used in all searches
export const year_input = document.getElementById('year-input') as HTMLInputElement;
export const deprivation_input = document.getElementById('deprivation-input') as HTMLInputElement;
export const male_checkbox = document.getElementById('maleckbox') as HTMLInputElement;
export const female_checkbox = document.getElementById('femaleckbox') as HTMLInputElement;
export const cancer_type = document.getElementById('cancer-type') as HTMLInputElement;
export const resultsContainer = document.getElementById('search-results') as HTMLInputElement;
export const resultsContainerTwo = document.getElementById('search-results-two') as HTMLInputElement;
export const linkContainerOne = document.getElementById('download-link-table-one') as HTMLInputElement;	
export const linkContainerTwo = document.getElementById('download-link-table-two') as HTMLInputElement;	
export const stage_input = document.getElementById('stage-input') as HTMLInputElement;
export const region_input = document.getElementById('region-input') as HTMLInputElement;
export const route_input = document.getElementById('route-input') as HTMLInputElement;

