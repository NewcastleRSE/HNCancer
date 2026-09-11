/*
Module for loading and saving data files.
*/

import type { IncidenceProcessedRow, SurvivalProcessedRow } from '../types';
import { CANCER_TYPES, CANCER_STATISTICS } from '../utils/variables';
import Papa from "papaparse";

const BASE_URL = import.meta.env.BASE_URL;

// Mapping from cancer type to filename
const CANCER_FILENAME_PREFIX: Record<typeof CANCER_TYPES[number], string> = { 
	"Head and Neck": "HNC", 
	"Laryngeal": "larynx", 
	"Oral Cavity": "oral_cavity", 
	"Oropharyngeal": "oropharynx", 
	"Other": "other" 
} as const;

// Get the filename of the spreadsheet to load based on the type of cancer and statistic
// Filenames must have the format 
// <CANCER_FILENAME_PREFIX[cancerType]>_<statistic>_data_file.csv
export function getCancerCSVFilename(cancerType: typeof CANCER_TYPES[number], statistic: typeof CANCER_STATISTICS[number]){

	const filenameSuffix = `_${statistic}_data_file.csv`
	const csvFile = BASE_URL + "/" + CANCER_FILENAME_PREFIX[cancerType] + filenameSuffix;
	console.log("CSV file: ", csvFile)

	return csvFile;
 }


// Download function and helpers for tidy data format
// (one observation - year and filter options - per row)
type DownloadRow = Record<string, string | undefined>;

function isGroupedRows(
    rows: DownloadRow[] | DownloadRow[][],
): rows is DownloadRow[][] {
    return Array.isArray(rows[0]);
}

// Download function for tidy data format
// (one observation - year and filter options - per row)
export function createTidyDownloadFile(
    groupedResults: DownloadRow[] | DownloadRow[][],
): string {
    let rows: DownloadRow[];

    if (isGroupedRows(groupedResults)) {
        rows = groupedResults.flat();
    } else {
        rows = groupedResults;
    }

    // Create CSV format using PapaParse
    const csv = Papa.unparse(rows);

    // Format for download
    return (
        "data:text/csv;charset=utf-8," +
        encodeURIComponent(csv)
    );
}

// Filename for download
// Timestamp + string (local time)
export function createDownloadFilename(name: string): string {
  const now = new Date();

  const pad = (value: number) =>
    value.toString().padStart(2, "0");

  const timestamp =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `T${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

  const suffix = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_");

  return `${timestamp}_${suffix}.csv`;
}
		

