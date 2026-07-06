import type { NewCSVRow, CSVDataInput, CSVData } from '../types';

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

// generates a table
export function generateInequalitiesTable(tableData: NewCSVRow[]){

	const string = tableData.map(item => `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${item.diagnosisYear} - Year of diagnosis: ${item.diagnosisYear}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="11" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Age</th>	
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
					</tr>
					<tr style="border: 1px solid #ccc;" >
						<td style="border: 1px solid #ccc; padding: 1rem">${item.diagnosisYear}</td>
						
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


export function setInequalitiesChartOptions(data: any[], rates: string[], optionString: string){

	// create arrays of arrays
	const years = dataMap(data);
	// flatten to a single array
	const yearSeries = years.flat(1);

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
          data: rates,
          type: 'line',
          smooth: true
        }
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

