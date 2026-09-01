import type { IncidenceFilter, IncidenceProcessedRow } from '../types';
import { messageContainer } from '../types';

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
		case "Other":
			CSV_file = BASE_URL + '/Incidence-Other.csv';
			break;
			default:
			console.log(`Cancer type not recognised`);
		}

	return CSV_file;
 }

// -- Messages --


// Set 
export function setMessageText(
  message: string,
  type: "normal" | "danger" = "normal",
) {
  if (!messageContainer) return;

  // Replace any previous message
  messageContainer.textContent = message;

  // Update styling
  messageContainer.className = "search-message";

  // If "danger", update class
  if (type === "danger") {
    messageContainer.classList.add("has-text-danger");
  }

  messageContainer.classList.remove("is-hidden");
}

export function clearMessageText() {
  if (!messageContainer) return;

  messageContainer.textContent = "";
  messageContainer.className = "search-message is-hidden";
}

// --- Tables ---

// Helper functions for tables

function getSearchTerms(filter: IncidenceFilter): string {
    const format = (value: string | string[]) =>
        Array.isArray(value) ? value.join(", ") : value;

    return [
        format(filter.sex),
        format(filter.ageBand),
        format(filter.dep),
        format(filter.region),
    ].join(" : ");
}

function processedRowsToTableData(rows: IncidenceProcessedRow[]) {
    const rates: number[] = [];
    const counts: (string | number)[] = [];
    const lowerBounds: number[] = [];
    const upperBounds: number[] = [];

    rows.forEach(row => {
        rates.push(row.rate);
        counts.push(row.count);
        lowerBounds.push(row.ciLb);
        upperBounds.push(row.ciUb);
    });

    return {
        rates,
        counts,
        lowerBounds,
        upperBounds,
    };
}

// --- exported table functions ---

// generates a table
	export function generateSingleRowTable(
    cancerType: string,
    rows: IncidenceProcessedRow[],
    filter: IncidenceFilter
) {
	// Get table data from IncidenceProcessedRow[] array
    const {
        rates,
        counts,
        lowerBounds,
        upperBounds,
    } = processedRowsToTableData(rows);

	// Get search terms from filters used
    const searchTerms = getSearchTerms(filter);

	// Create table
	const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year - Rate (Lb, Ub) - Count</th>	
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
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[0]} (<em>${lowerBounds[0]}, ${upperBounds[0]}</em>) <strong>${counts[0]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[1]} (<em>${lowerBounds[1]}, ${upperBounds[1]}</em>) <strong>${counts[1]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[2]} (<em>${lowerBounds[2]}, ${upperBounds[2]}</em>) <strong>${counts[2]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[3]} (<em>${lowerBounds[3]}, ${upperBounds[3]}</em>) <strong>${counts[3]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[4]} (<em>${lowerBounds[4]}, ${upperBounds[4]}</em>) <strong>${counts[4]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[5]} (<em>${lowerBounds[5]}, ${upperBounds[5]}</em>) <strong>${counts[5]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[6]} (<em>${lowerBounds[6]}, ${upperBounds[6]}</em>) <strong>${counts[6]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[7]} (<em>${lowerBounds[7]}, ${upperBounds[7]}</em>) <strong>${counts[7]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[8]} (<em>${lowerBounds[8]}, ${upperBounds[8]}</em>) <strong>${counts[8]}</strong></td>
					</tr>
				</tbody>
			</table>

			<div class="mb-4 is-size-7 is-italic">Where the Count is less than 10, the number is suppressed and shown as <strong>'S'</strong></div>
			</div>
           `;

		   return string;
  }

  // generates a table

 
  
export function generateMultiRowTable(
    cancerType: string,
    groupedResults: IncidenceProcessedRow[][],
    filter: IncidenceFilter
) {
	// Get search terms from filters used
    const searchTerms = getSearchTerms(filter);

	// Get formatted data from IncidenceProcessedRow[][] arrays
    const allRates = groupedResults.map(rows => {
        const {
            rates,
            counts,
            lowerBounds,
            upperBounds,
        } = processedRowsToTableData(rows);

        const key =
            rows[0]?.dep ??
            rows[0]?.region ??
            rows[0]?.ageBand ??
            "";

        const formattedRates = rates.map((rate, i) =>
            `${rate} (<em>${lowerBounds[i]}, ${upperBounds[i]}</em>) <strong>${counts[i]}</strong>`
        );

        return [key, ...formattedRates];
    });

	// console.log('in table gen function');
	// console.log(allRates);

	const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year - Rate (Lb, Ub) - Count</th>	
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
							<div class="mb-4 is-size-7 is-italic">Where the Count is less than 10, the number is suppressed and shown as <strong>'S'</strong></div>
						`;

		   return string + extraString + endString;
}

export function generateDichotomyMultiRowTable(
    cancerType: string,
    groupedResults: IncidenceProcessedRow[][],
    filter: IncidenceFilter
) {
	// Get search terms from filters used
    const searchTerms = getSearchTerms(filter);

	// Get formatted data from ProcessedRows[][] data
    const allRates = groupedResults.map(rows => {
        const {
            rates,
            counts,
            lowerBounds,
            upperBounds,
        } = processedRowsToTableData(rows);

        const key =
            rows[0]?.dep ??
            rows[0]?.region ??
            rows[0]?.ageBand ??
            "";

        const sex = rows[0]?.sex ?? "";

        const formattedRates = rates.map((rate, i) =>
            `${rate} (<em>${lowerBounds[i]}, ${upperBounds[i]}</em>) <strong>${counts[i]}</strong>`
        );

        return [key, sex, ...formattedRates];
    });

	// console.log('in table gen function');
	// console.log(allRates);

	const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year - Rate (Lb, Ub) - Count</th>	
					</tr>	
					<tr style="border: 1px solid #ccc;" >

						<th style="border: 1px solid #ccc; background-color: #e1ecec; padding: 1rem">Key</th>
						<th style="border: 1px solid #ccc; background-color: #e1ecec; padding: 1rem"></th>
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
						<td style="border: 1px solid #ccc; padding: 1rem; background-color: #f0f8f8;">${row[1]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[2]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[3]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[4]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[5]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[6]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[7]}</td>	
						<td style="border: 1px solid #ccc; padding: 1rem">${row[8]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[9]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[10]}</td>
					</tr>	
						`
						extraString += tempString;
					})

					const endString = `</tbody>
							</table>
							</div>
							<div class="mb-4 is-size-7 is-italic">Where the Count is less than 10, the number is suppressed and shown as <strong>'S'</strong></div>
						`;

		   return string + extraString + endString;
}

// --- DEPRECATED TABLE FUNCTIONS ---
// For testing refactor

// generates a table
export function generateSingleRowTableDEPRECATED(cancerType: string, rates: string[], counts: string [], lowerBounds: number[], upperBounds: number[], searchTerms: string){

	const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year - Rate (Lb, Ub) - Count</th>	
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
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[0]} (<em>${lowerBounds[0]}, ${upperBounds[0]}</em>) <strong>${counts[0]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[1]} (<em>${lowerBounds[1]}, ${upperBounds[1]}</em>) <strong>${counts[1]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[2]} (<em>${lowerBounds[2]}, ${upperBounds[2]}</em>) <strong>${counts[2]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[3]} (<em>${lowerBounds[3]}, ${upperBounds[3]}</em>) <strong>${counts[3]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[4]} (<em>${lowerBounds[4]}, ${upperBounds[4]}</em>) <strong>${counts[4]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[5]} (<em>${lowerBounds[5]}, ${upperBounds[5]}</em>) <strong>${counts[5]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[6]} (<em>${lowerBounds[6]}, ${upperBounds[6]}</em>) <strong>${counts[6]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[7]} (<em>${lowerBounds[7]}, ${upperBounds[7]}</em>) <strong>${counts[7]}</strong></td>
						<td style="border: 1px solid #ccc; padding: 1rem">${rates[8]} (<em>${lowerBounds[8]}, ${upperBounds[8]}</em>) <strong>${counts[8]}</strong></td>
					</tr>
				</tbody>
			</table>

			<div class="mb-4 is-size-7 is-italic">Where the Count is less than 10, the number is suppressed and shown as <strong>'S'</strong></div>
			</div>
           `;

		   return string;
  }

  // generates a table

 
  
export function generateMultiRowTableDEPRECATED(cancerType: string, allRates: string[], searchTerms: string){

	// console.log('in table gen function');
	// console.log(allRates);

		const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year - Rate (Lb, Ub) - Count</th>	
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
							<div class="mb-4 is-size-7 is-italic">Where the Count is less than 10, the number is suppressed and shown as <strong>'S'</strong></div>
						`;

		   return string + extraString + endString;
}

export function generateDichotomyMultiRowTableDEPRECATED(cancerType: string, allRates: string[], searchTerms: string){

	// console.log('in table gen function');
	// console.log(allRates);

const string = `
		  <div class="table-container">
			<table id="ageTable" class="table" style="border: 1px solid #ccc; padding: 1rem; margin-bottom: 0.5rem; border-radius: 4px; border-collapse: collapse" caption="Result table by age">
				<thead>
					<th colspan="11" style="border: 1px solid #ccc; background-color: #dcf5f5; padding: 1rem" >${cancerType} - Incidence rates - ${searchTerms}</th>
				</thead>
				<tbody>
					<tr>
						<th colspan="10" style="border: 1px solid #ccc; padding: 1rem">Incidence rate by Year - Rate (Lb, Ub) - Count</th>	
					</tr>	
					<tr style="border: 1px solid #ccc;" >

						<th style="border: 1px solid #ccc; background-color: #e1ecec; padding: 1rem">Key</th>
						<th style="border: 1px solid #ccc; background-color: #e1ecec; padding: 1rem"></th>
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
						<td style="border: 1px solid #ccc; padding: 1rem; background-color: #f0f8f8;">${row[1]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[2]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[3]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[4]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[5]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[6]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[7]}</td>	
						<td style="border: 1px solid #ccc; padding: 1rem">${row[8]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[9]}</td>
						<td style="border: 1px solid #ccc; padding: 1rem">${row[10]}</td>
					</tr>	
						`
						extraString += tempString;
					})

					const endString = `</tbody>
							</table>
							</div>
							<div class="mb-4 is-size-7 is-italic">Where the Count is less than 10, the number is suppressed and shown as <strong>'S'</strong></div>
						`;

		   return string + extraString + endString;
}

// --- Inputs ---

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




