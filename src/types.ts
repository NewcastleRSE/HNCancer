export interface CSVRow {
    diagnosisYear: string;
    ageBand: string;
    sex: string;
    dep: string;
    region: string;
    stage: string;
    route: string;
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
export const linkContainerOne = document.getElementById('download-link-table-one') as HTMLInputElement;	
export const linkContainerTwo = document.getElementById('download-link-table-two') as HTMLInputElement;	
export const stage_input = document.getElementById('stage-input') as HTMLInputElement;
export const region_input = document.getElementById('region-input') as HTMLInputElement;
export const route_input = document.getElementById('route-input') as HTMLInputElement;

