import { file } from 'astro:schema';
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

  export function createDownloadFile(rates: string[], lowerBounds: number[], upperBounds: number[]){

  	// Convert array of values to CSV string
  	const csvRows = [ 	// headers	
 		[
			'2016','ciLb','ciUb',
			'2017','ciLb','ciUb',
			'2018','ciLb','ciUb',
			'2019','ciLb','ciUb',
			'2020','ciLb','ciUb',
			'2021','ciLb','ciUb',
			'2022','ciLb','ciUb',
			'2023','ciLb','ciUb',
			'All Years','ciLb','ciUb'
		], 
  		[
		rates[0] + ',' + lowerBounds[0] + ',' + upperBounds[0], 
		rates[1] + ',' + lowerBounds[1] + ',' + upperBounds[1],  
		rates[2] + ',' + lowerBounds[2] + ',' + upperBounds[2], 
		rates[3] + ',' + lowerBounds[3] + ',' + upperBounds[3],  
		rates[4] + ',' + lowerBounds[4] + ',' + upperBounds[4],  
		rates[5] + ',' + lowerBounds[5] + ',' + upperBounds[5],  
		rates[6] + ',' + lowerBounds[6] + ',' + upperBounds[6],  
		rates[7] + ',' + lowerBounds[7] + ',' + upperBounds[7],  
		rates[8] + ',' + lowerBounds[8] + ',' + upperBounds[8], 
		rates[9] + ',' + lowerBounds[9] + ',' + upperBounds[9] 
  		]
	];
  	const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");;

 	const encodedUri = encodeURI(csvContent);
 	return encodedUri;
}

 export function createMultiDownloadFile(allDownloadRates: string[]){

  	// Convert array of values to CSV string
  	//const csvRowHeaderString = `Key,2016,2017,2018,2019,2020,2021,2022,2023,All Years\n`;

	const csvRowHeaderString =`Key,2016,ciLb,ciUb,2017,ciLb,ciUb,2018,ciLb,ciUb,2019,ciLb,ciUb,2020,ciLb,ciUb,2021,ciLb,ciUb,2022,ciLb,ciUb,2023,ciLb,ciUb,All Years,ciLb,ciUb\n`

	var rowsString: string = '';
	
	allDownloadRates.forEach(row => {
		var tempString = `${row[0]},${row[1]},${row[2]},${row[3]},${row[4]},${row[5]},${row[6]},${row[7]},${row[8]},${row[9]},\n`;
		rowsString += tempString;
	});

  	const csvContent = "data:text/csv;charset=utf-8," + csvRowHeaderString + rowsString;

 	const encodedUri = encodeURI(csvContent);
 	return encodedUri;
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

/*
export function getCSVData({yearQuery, keyQuery, keyQueryTwo, csvText}: CSVDataInput): CSVData {

	var matchedItems: IncidenceCSVRow[] = [];
	// declared in case a second query is needed (optional)
	var matchedItemsSecond: IncidenceCSVRow[] = [];
	var result: CSVData[] = []; 

	// parse CSV text directly into JSON format
	Papa.parse<IncidenceCSVRow>(csvText, {
	header: true, // Uses row 1 keys mapping row values into key-value objects
	skipEmptyLines: true,
	complete: (results) => {
		matchedItems = results.data.filter(item => 
			item.table?.toLowerCase().includes(keyQuery) &&
			item.diagnosisYear?.toLowerCase().includes(yearQuery) 
		);

		// if we have a second search for the female records
		if(keyQueryTwo !== ''){
			matchedItemsSecond = results.data.filter(item => 
			item.table?.toLowerCase().includes(keyQueryTwo) &&
			item.diagnosisYear?.toLowerCase().includes(yearQuery) 
			);
		}
	
		// filter to catch unwanted extra matches where 'male' also brings back 'female' records
		if(matchedItems.length !== 0){
			filterArray(matchedItems, keyQuery);
		}

		if(matchedItemsSecond.length !== 0){
			filterArray(matchedItemsSecond, keyQueryTwo);
		}

		return result = {
			matchedRows = matchedItems,
			matchedRowsSecond = matchedItemsSecond
		}
		
	}
	
	})
} */
		

