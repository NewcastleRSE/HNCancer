import { setChartOptions, setMultiChartOptions } from "../utils/filter-new";
import * as echarts from 'echarts';
import type { ProcessedRow, ChartSeries } from "../types";

// --- Helper functions within module ---

// Fields used to create labels
// Order determines order of labels
const CHART_LABEL_FIELDS = [
	'sex',
    'ageBand',
    'dep',
    'region',
    'route',
    'stage'
] as const;

// Validate processed data for one series (line)
// Checks that ProcessedRow[] arrays (rates for different years, but same filters) 
// have same metadata.
function validateSeriesMetadata(series: ProcessedRow[]) {
  if (series.length === 0) {
    throw new Error('Chart series contains no data');
  }

  // Use first array as expected values
  const first = series[0];

  // Loop through all fields used to create labels
  for (const field of CHART_LABEL_FIELDS) {
    const expected = first[field];

    const consistent = series.every(row => row[field] === expected);

    if (!consistent) {
      throw new Error(
        `Inconsistent ${field} values within chart series`
      );
    }
  }
}

// Get the name of the series (i.e., the data in ProcessedRow[]) from one row (array)
// Use validateSeriesMetadata first to check that each row has same metadata
function getSeriesName(row: ProcessedRow): string {
  return CHART_LABEL_FIELDS
	// Get value for each of the label fields
    .map(field => row[field])
	// Only keep values that don't start with "all" (case insensitive)
    .filter(value => !value.toLowerCase().startsWith('all'))
	// Concatenate remaining values together to create label for series
    .join(', ');
}

// --- Exported functions ---

export function returnAllChartSeries(allMatchedItems: ProcessedRow[][]): ChartSeries[] {

	console.log("allMatchedItems: ", allMatchedItems)
	//console.log("rate type: ", typeof allMatchedItems[0][0].rate);	

	// Create chart data 
	var allChartSeries: ChartSeries[] = [];

	if (allMatchedItems){ 

		// Validate metadata across different years within each series
		allMatchedItems.forEach(validateSeriesMetadata);

		// Create each chart series
		// Here, 
		// 		series = incidence rates for one set of filters, across all years
		// 		row = data for one incidence rate
        allMatchedItems.forEach(series => {

            // Remove the "all years" result
			// (will remove any years starting with "all", case insensitive)
            const rows = series.filter(row => !row.diagnosisYear.toLowerCase().startsWith('all'));

			// Use first row to get label
            const name = getSeriesName(rows[0]);

			// Get years and change to numbers
            const years = rows.map(row => Number(row.diagnosisYear));

			// Get incidence rates and change to numbers
			// Note - no longer filter out undefined values - will handle any in 
			// charting step  instead.
			// If do filter out missing values, will need to ensure that years array
			// is also filtered to match
            const rates = rows.map(row => Number(row.rate))

            allChartSeries.push({
                name: name,
                years: years,
                rates: rates
            });
        });
    }

	console.log("allChartSeries: ", allChartSeries)

	return allChartSeries;

}
    
// function to initialize the EChart
export function renderChart(cancerType: string, data: any[], chartInstance: echarts.ECharts) {
    
  	const rates = data.map((row: { rate: any; }) => row.rate).filter(Boolean);

    //remove all years result
	rates.pop();

	const option = setChartOptions(rates, cancerType);
    // Set options to render the chart
    chartInstance.setOption(option);

    // Optional: Make the chart responsive to window resizing
    window.addEventListener('resize', () => {
      chartInstance.resize();
    });
}

 // function to initialize the EChart
export function renderMultiChart(cancerType: string, allSeries: ChartSeries[], chartInstance: echarts.ECharts) {

	console.log('in multi-chart render');
	console.log(allSeries);

	
	// expects an multi-dimensional array of string values
	const option = setMultiChartOptions(allSeries, cancerType);

	// Clear previous chart/options
	// Otherwise, options will add new data to existing data (instead of replacing existing data)
	chartInstance.clear();

    // Set options to render the chart
     chartInstance.setOption(option);

     // Optional: Make the chart responsive to window resizing
     window.addEventListener('resize', () => {
       chartInstance.resize();
     });
}

// creates a blank chart with null values and wipes out any previous multi-line chart 
export function renderBlankChart(cancerType: string, chartInstance: echarts.ECharts){

	const allRates: any[] = [
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A'],
		['#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A','#N/A']
	];

	const option = setMultiChartOptions(allRates, cancerType);
	
    // Set options to render the chart
     chartInstance.setOption(option);

     // Optional: Make the chart responsive to window resizing
     window.addEventListener('resize', () => {
       chartInstance.resize();
     });

}


// not currently used
export function getRatesFromMatchedItems(allMatchedItems: any[]){

	var allRates: string[] = [];

		if (allMatchedItems){ 
			// get the indicence rates
			allMatchedItems.forEach(item => {
			var temp = item.map((row: { rate: any; }) => row.rate).filter(Boolean);
			allRates.push(temp);
		});

		return allRates;

   	}
};
