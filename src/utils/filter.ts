import type { CSVRow } from '../types';

const BASE_URL = import.meta.env.BASE_URL;

 /* in the case where 3 query items are joined by /, the male query also greedy matches the female record
  and the additional result needs to be filtered out */

// export function filterArray(data: CSVRow[], query: string){	

// 	var deleteUnwanted = false;
// 	var unwantedFormat = /^Female\/\w+\/?.*$/;
// 	// grab the first part of the string
// 	var array = query.split('/');

// 	data.forEach(function (item){
// 		if (item.table.match(unwantedFormat) && array[0] === 'male'){
// 			deleteUnwanted = true;
// 		}
// 	})

// 	if(deleteUnwanted){
//   		data.splice(1,1);
// 	}
// 	return data;
//  }

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



/*
export function setChartOptions(data: any[], dataSecond: any[], year: string[], optionString: string){

	// create arrays of arrays
	const ages = dataMap(data);
	const agesSecond = dataMap(dataSecond);
	// flatten each to a single array
	const ageSeries = ages.flat(1);
	const ageSeriesTwo = agesSecond.flat(1);

	console.log(ages);
	console.log(ageSeries);

    const option = {
      title: {
        text: optionString.slice(0, -1) + ' - Incidents by Age - Diagnosis Year : ' + year 
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: ["0-49", "50-54", "55-59", "60-64", "65-69", "70-74", "75-79", "80-84", "85-89", "90+"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: ageSeries,
          type: 'line',
          smooth: true
        },
		{
          data: ageSeriesTwo,
          type: 'line',
          smooth: true
        } 
      ]
    };

	return option;
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
		

