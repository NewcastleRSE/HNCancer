import type { CSVRow } from '../types';
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
			CSV_file = BASE_URL + '/HNC.csv';
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