import type { CSVRow, CSVDataInput, CSVData } from '../types';
import Papa from 'papaparse';

const BASE_URL = import.meta.env.BASE_URL;

 /* in the case where 3 query items are joined by /, the male query also greedy matches the female record
  and the additional result needs to be filtered out */

export function filterArray(data: CSVRow[], query: string){	

	var deleteUnwanted = false;
	var unwantedFormat = /^Female\/\w+\/?.*$/;
	// grab the first part of the string
	var array = query.split('/');

	data.forEach(function (item){
		if (item.table.match(unwantedFormat) && array[0] === 'male'){
			deleteUnwanted = true;
		}
	})

	if(deleteUnwanted){
  		data.splice(1,1);
	}
	return data;
 }

// determines which spreadsheet should be used
export function cancerType(value: string){

	var CSV_file = '';

	switch (value) {
		case "Head and Neck":
			CSV_file = BASE_URL + '/Incidence-HNC.csv';
			break;
		case "Laryngeal":
			CSV_file = BASE_URL + '/Incidence-Larynx.csv';
			break;
		case "Oral Cavity":
			CSV_file = BASE_URL + '/Incidence-OralCavity.csv';
			break;
		case "Oropharyngeal":
			CSV_file = BASE_URL + '/Incidence-Oropharynx.csv';
			break;
		default:
			console.log(`Cancer type not recognised`);
		}

	return CSV_file;
 }

// generates a table
export function generateTable(tableData: CSVRow[]){

	const string = tableData.map(item => `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="10" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${item.table.slice(0, -1)} - Year of diagnosis: ${item.diagnosisYear}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Age</th>	
					</tr>	
					<tr style="border: 1px solid #ccc;" >
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">0-49</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">50-54</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">55-59</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">60-64</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">65-69</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">70-74</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">75-79</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">80-84</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">85-89</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">90+</th>
					</tr>
					<tr style="border: 1px solid #ccc;" >
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge0_49 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge50_54 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge55_59 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge60_64 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge65_69 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge70_74 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge75_79 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge80_84 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge85_89 * 100) / 100}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${Math.round(item.ageSpecificIncidenceAge90 * 100) / 100}</td>
					</tr>
				</tbody>
			</table>
			</div>
           `).join(''); 

		   return string;
  }

// maps the data
export function dataMap(data: any[]) {

	const fixedArray = [ data.map((row: { ageSpecificIncidenceAge0_49: any; }) => row.ageSpecificIncidenceAge0_49).filter(Boolean),
    	data.map((row: { ageSpecificIncidenceAge50_54: any; }) => row.ageSpecificIncidenceAge50_54).filter(Boolean),
		data.map((row: { ageSpecificIncidenceAge55_59: any; }) => row.ageSpecificIncidenceAge55_59).filter(Boolean),
  		data.map((row: { ageSpecificIncidenceAge60_64: any; }) => row.ageSpecificIncidenceAge60_64).filter(Boolean),
		data.map((row: { ageSpecificIncidenceAge65_69: any; }) => row.ageSpecificIncidenceAge65_69).filter(Boolean),
		data.map((row: { ageSpecificIncidenceAge70_74: any; }) => row.ageSpecificIncidenceAge70_74).filter(Boolean),
    	data.map((row: { ageSpecificIncidenceAge75_79: any; }) => row.ageSpecificIncidenceAge75_79).filter(Boolean),
		data.map((row: { ageSpecificIncidenceAge80_84: any; }) => row.ageSpecificIncidenceAge80_84).filter(Boolean),
  		data.map((row: { ageSpecificIncidenceAge85_89: any; }) => row.ageSpecificIncidenceAge85_89).filter(Boolean),
		data.map((row: { ageSpecificIncidenceAge90: any; }) => row.ageSpecificIncidenceAge90).filter(Boolean)];

		return fixedArray;
}

/*
export function getCSVData({yearQuery, keyQuery, keyQueryTwo, csvText}: CSVDataInput): CSVData {

	var matchedItems: CSVRow[] = [];
	// declared in case a second query is needed (optional)
	var matchedItemsSecond: CSVRow[] = [];
	var result: CSVData[] = []; 

	// parse CSV text directly into JSON format
	Papa.parse<CSVRow>(csvText, {
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
		

