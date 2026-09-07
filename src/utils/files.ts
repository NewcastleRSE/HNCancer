/*
Module for loading and saving data files.
*/

import type { IncidenceProcessedRow } from '../types';
import Papa from "papaparse";

const BASE_URL = import.meta.env.BASE_URL;

// Mapping from cancer type to filename
const CANCER_FILENAME_PREFIX = { 
	"Head and Neck": "HNC", 
	"Laryngeal": "larynx", 
	"Oral Cavity": "oral_cavity", 
	"Oropharyngeal": "oropharynx", 
	"Other": "other" 
} as const;

// determines which spreadsheet should be used
export function cancerType(value: keyof typeof CANCER_FILENAME_PREFIX){

	const filenameSuffix = "_incidence_data_file.csv"
	const csvFile = BASE_URL + "/" + CANCER_FILENAME_PREFIX[value] + filenameSuffix;
	console.log("CSV file: ", csvFile)

	return csvFile;
 }

// Download function for tidy data format (one observation - year and filter options - per row)
export function createTidyDownloadFile(
  groupedResults: IncidenceProcessedRow[] | IncidenceProcessedRow[][]
): string {
  // Flatten data
  const rows = Array.isArray(groupedResults[0])
    ? (groupedResults as IncidenceProcessedRow[][]).flat()
    : (groupedResults as IncidenceProcessedRow[]);

  // Create csv format using Papaparse
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
		

