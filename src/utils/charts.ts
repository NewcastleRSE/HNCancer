import { setLineChartOptions } from "../utils/filter-new";
import * as echarts from 'echarts';
import type { ProcessedRow, ChartSeries, SeriesLabels } from "../types";

// --- Constants --- 

// Variables used to create series names/labels
// Info from these variables is also used for symbol/colour encoding
// Order determines order of labels and prioritisation for colour encoding 
// (if multiple variables have different values across the series)
export const CHART_LABEL_VARIABLES = [
	'sex',
    'ageBand',
    'dep',
    'region',
    'route',
    'stage'
] as const;

// --- Helper functions within module ---

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
  for (const field of CHART_LABEL_VARIABLES) {
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
// Also stories the variables and variable values used to make the name
// Use validateSeriesMetadata first to check that each row has same metadata
function getSeriesLabels(row: ProcessedRow): SeriesLabels {
	// Get values for each of the label variables
    const variables = CHART_LABEL_VARIABLES
		// Only keep values that don't start with "all" (case insensitive)
        .filter(field => !row[field].toLowerCase().startsWith('all'))
		// Get the 
        .reduce((result, field) => {
            result[field] = row[field];
            return result;
        }, {} as Partial<Record<typeof CHART_LABEL_VARIABLES[number], string>>);

    return {
        name: Object.values(variables).join(', '),
        variables: variables
    };
}

// --- Exported functions ---

export function returnAllChartSeries(allMatchedItems: ProcessedRow[] | ProcessedRow[][]): ChartSeries[] {

	console.log("allMatchedItems: ", allMatchedItems)

	// If input data is ProcessedRow[] (representing one series), convert to 
	// ProcessedRow[][] by wrapping in outer array
	const seriesData: ProcessedRow[][] =
    Array.isArray(allMatchedItems[0])
        ? allMatchedItems as ProcessedRow[][]
        : [allMatchedItems as ProcessedRow[]];

	// Create chart data 
	var allChartSeries: ChartSeries[] = [];

	if (seriesData){ 

		// Validate metadata across different years within each series
		seriesData.forEach(validateSeriesMetadata);

		// Create each chart series
		// Here, 
		// 		series = incidence rates for one set of filters, across all years
		// 		row = data for one incidence rate
        seriesData.forEach(series => {

            // Remove the "all years" result
			// (will remove any years starting with "all", case insensitive)
            const rows = series.filter(row => !row.diagnosisYear.toLowerCase().startsWith('all'));

			// Use first row to get label
            const labels = getSeriesLabels(rows[0]);

			// Get years and change to numbers
            const years = rows.map(row => Number(row.diagnosisYear));

			// Get incidence rates and change to numbers
			// Note - no longer filter out undefined values - will handle any in 
			// charting step  instead.
			// If do filter out missing values, will need to ensure that years array
			// is also filtered to match
            const rates = rows.map(row => Number(row.rate))

            allChartSeries.push({
                name: labels.name,
                years: years,
                rates: rates,
				variables: labels.variables
            });
        });
    }

	console.log("allChartSeries: ", allChartSeries)

	return allChartSeries;

}


// Function in initialise a single- or multi-line chart
// "element" is the id of the DOM element where the chart will be added
export function initLineChart(element: string): echarts.ECharts {
	const chartDom = document.getElementById(element);
  	const chartInstance = echarts.init(chartDom);

	// Event listener for window resizing
     window.addEventListener('resize', () => {
       chartInstance.resize();
     });

	return chartInstance

}

 // function to render a single- or multi-line chart
export function renderLineChart(cancerType: string, allSeries: ChartSeries[], chartInstance: echarts.ECharts) {

	console.log('in line chart render');
	console.log("chart series: ", allSeries);
	
	// expects an multi-dimensional array of string values
	const option = setLineChartOptions(allSeries, cancerType);

	// Clear previous chart/options
	// Otherwise, options will add new data to existing data (instead of replacing existing data)
	chartInstance.clear();

	// Show the end labels for each line after the animation has finished
	const showLabels = () => {
	    // Remove any existing listeners
		chartInstance.off('finished', showLabels);

		requestAnimationFrame(() => {
			chartInstance.setOption({
			    // Turn off future animations (e.g., for legend toggling)
				animation: false,
			    // Show end label when animation finishes
				series: allSeries.map(() => ({
					endLabel: {
						show: true
					}
				}))
			});
		});
	};

    chartInstance.on('finished', showLabels);

    // Set options to render the chart
     chartInstance.setOption(option);

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

	const option = setLineChartOptions(allRates, cancerType);
	
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
