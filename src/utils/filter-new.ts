import type { CSVRow } from '../types';

const BASE_URL = import.meta.env.BASE_URL;

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

 /*
 export function createInequalitiesDownloadFile(tableData: CSVRow[]){

	// Convert JSON data to CSV string
	const csvRows = [
	// headers	
	['diagnosisYear:',
		'ageBand',
		'sex',
		'dep',
		'region',
		'stage',
		'route',
		'rate',
		'ciLb',
		'ciUb'
	], 
	...tableData.map(item => [item.diagnosisYear, 
	item.ageBand,
	item.sex,
	item.dep,
	item.region,
	item.stage,
	item.route,
	item.rate,
	item.ciLb,
	item.ciUb
	])
	];
	const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
	const encodedUri = encodeURI(csvContent);
	console.log(encodedUri);
	return encodedUri;	
}

*/

// generates a table
export function generateInequalitiesTable(cancerType: string, rates: string[], searchTerms: string){

	const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year</th>	
					</tr>	
					<tr style="border: 1px solid #ccc;" >
				
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2016</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2017</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2018</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2019</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2020</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2021</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2022</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2023</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">All Years</th>

					</tr>
					<tr style="border: 1px solid #ccc;" >
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[0]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[1]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[2]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[3]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[4]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[5]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[6]}</td>	
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[7]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[8]}</td>
					</tr>
				</tbody>
			</table>
			</div>
           `;

		   return string;
  }

  // generates a table
export function generateMultiInequalitiesTable(cancerType: string, allRates: string[], searchTerms: string){

	console.log('in table gen function');
	console.log(allRates);

	const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year</th>	
					</tr>	
					<tr style="border: 1px solid #ccc;" >

						<th style="border: 1px solid #ccc; background-color: #e1ecec; padding: 1rem">Key</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2016</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2017</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2018</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2019</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2020</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2021</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2022</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">2023</th>
						<th style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem">All Years</th>

					</tr>`;

					var extraString: string = ''

					allRates.forEach(row => {
						var tempString = `
							<tr style="border: 1px solid #ccc;" >
						<td style="border: 1px solid #ccc; padding: 1rem; background-color: #f0f8f8;">${row[0]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[1]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[2]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[3]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[4]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[5]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[6]}</td>	
						<td style="border: 1px solid #ccc; padding: 1rem">${row[7]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[8]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[9]}</td>
					</tr>	
						`
						extraString += tempString;
					})

					const endString = `</tbody>
							</table>
							</div>
						`;

		   return string + extraString + endString;
  }


export function setChartOptions(rates: string[], optionString: string){

    const option = {
       title: {
        text: optionString + ' - Incident rates by Diagnosis Year' 
      },
       tooltip: {
         trigger: 'axis'
       },
       xAxis: {
         type: 'category',
         data: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
       },
       yAxis: {
         type: 'value'
      },
	  legend: {
    	// data: ['searchTerms']
 		},
      series: [
         {
           	data: rates,
			//name: searchTerms,
          	type: 'line',
           	smooth: false,
		  	label: true
         }
       ]
     };

 	return option;
 }

export function setMultiChartOptions(allRates: string[], optionString: string){

    const option = {
		title: {
			text: optionString + ' - Incident rates by Diagnosis Year' 
		},
		tooltip: {
			trigger: 'axis'
		},
		xAxis: {
			type: 'category',
			data: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
		},
		yAxis: {
			type: 'value'
		},
      	series: [
        {
          	data: allRates[0],
          	type: 'line',
          	smooth: false,
		 	 label: true
        },
		{
          	data: allRates[1],
          	type: 'line',
          	smooth: false,
		  	label: true
        },
		{
          	data: allRates[2],
          	type: 'line',
          	smooth: false,
			label: true
        },
		{
          	data: allRates[3],
          	type: 'line',
          	smooth: false,
		 	 label: true
        },
		{
          	data: allRates[4],
          	type: 'line',
          	smooth: false,
		  	label: true
        },
		{
          	data: allRates[5],
          	type: 'line',
          	smooth: true,
			label: true
        },
		{
          	data: allRates[6],
          	type: 'line',
          	smooth: true,
		 	 label: true
        },
		{
          	data: allRates[7],
          	type: 'line',
          	smooth: true,
		  	label: true
        },
		{
          	data: allRates[8],
          	type: 'line',
          	smooth: false,
			label: true
        },
		{
          	data: allRates[9],
          	type: 'line',
          	smooth: false,
			label: true
        }
      ]
    };

	return option;
}

export function setConfidenceChartOptions(rates: string[], lowerBounds: number[], upperBounds: number[], optionString: string){

	console.log(lowerBounds);
	console.log(rates);
	console.log(upperBounds);

	const option = {
		title: {
			text: optionString + ' - Incident rates and confidence bands' 
		},
		tooltip: {
			trigger: 'axis'
		},
		xAxis: {
			type: 'category',
			data: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"]
		},
		yAxis: {
			type: 'value'
		},
      	series: [
        {
          	data: lowerBounds,
          	type: 'line',
          	smooth: false,
		 	label: true,
			lineStyle: {
				normal: {
				color: 'grey',
				width: 1,
				type: 'dashed'
				}
			}
        },
		{
          	data: rates,
          	type: 'line',
          	smooth: false,
		  	label: true,
			lineStyle: {
				normal: {
				color: 'black',
				width: 1,
				type: 'solid'
				}
			}
        },
		{
          	data: upperBounds,
          	type: 'line',
          	smooth: false,
			label: true,
			lineStyle: {
				normal: {
				color: 'grey',
				width: 1,
				type: 'dashed'
				}
			}
        },
	
      ]
    };

	return option;

}

export function determineSexInput(sexes: string[]){

	if(sexes.length === 2 || sexes.length === 0){
		// search term used in csv
		return 'All Persons';
	}
	else if(sexes.length === 1){
		return sexes[0];
	}
	else {
		return '';
	}

}

export function determineAgeInput(ages: string[]){

	if(ages.length === 0){
		
		return 'all ages';
	}
	else if(ages.length === 1){
		return ages[0];
	}
	else if(ages.length > 1){
		return 'Multiple Ages';
	}
	else {
		return '';
	}

}

export function determineDepInput(deprivation: string[]){

	if(deprivation.length === 0){
		
		return 'All IMD Quintiles';
	}
	else if(deprivation.length === 1){
		return deprivation[0];
	}
	else if(deprivation.length > 1){
		return 'Multiple IMD';
	}
	else {
		return '';
	}

}

export function determineRegionInput(regions: string[]){

	if(regions.length === 0){
		
		return 'All Regions';
	}
	else if(regions.length === 1){
		return regions[0];
	}
	else if(regions.length > 1){
		return 'Multiple Regions';
	}
	else {
		return '';
	}

}

export function determineStageInput(stages: string[]){

	if(stages.length === 2 || stages.length === 0){
		// search term used in csv
		return 'All Stages';
	}
	else if(stages.length === 1){
		return stages[0];
	}
	else {
		return '';
	}

}

export function determineRouteInput(routes: string[]){

	if(routes.length === 2 || routes.length === 0){
		console.log(routes.length);
		// search term used in csv
		return 'All Routes';
	}
	else if(routes.length === 1){
		return routes[0];		
	}
	else {
		return '';
	}

}




