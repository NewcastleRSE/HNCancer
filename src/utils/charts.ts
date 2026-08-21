import * as echarts from 'echarts';
import { getChartColorMapping } from './colors';
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
    throw new Error('No data is available for this combination of filters.');
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

// Options for single or multi line chart
// Also adds data to the chart
function setLineChartOptions(allSeries: ChartSeries[], optionString: string){

	// Get year range from data for the x-axis
	const allYears = allSeries.flatMap(series => series.years);
	const minYear = Math.min(...allYears);
	const maxYear = Math.max(...allYears);

	// Calculate size of right margin based on label lengths
	// Will be length of longest label * 7, with min of 150 and max of 275
	const longestNameLength = Math.max(
    ...allSeries.map(series => series.name.length)
	);
	const rightMargin = Math.min(
		275,
		Math.max(150, longestNameLength * 7)
	);

	// Whether there are multiple series
	const isMulti = allSeries.length > 1;

	// Get colormapping
	const cmap = getChartColorMapping(allSeries);
	console.log("Chart cmap: ", cmap)

	// Options
    const option = {
		title: {
			text: optionString + ' Cancer Rates' 
		},
		grid: {
        	right: rightMargin,
			// If legend, add extra white space between the legend and bottom of the chart
			// Otherwise, use default (60)
			bottom: isMulti? 100: 60, 
    	},
		tooltip: {
			trigger: 'axis',
			// To keep "year" as string in tooltip label
			axisPointer: {
				label: {
					formatter: (params: any) => params.value.toString()
				}
    		}
		},
		xAxis: {
			// Treat years as "value" to make more robust 
			// (e.g., to nonchronological orders or missing years)
			type: 'value',
			min: minYear,
			max: maxYear,
			interval: 1,
			name: 'Diagnosis year',
			nameLocation: 'middle',
			nameTextStyle: {
				fontWeight: 'bold'
			},
			// Format years as strings to prevent commas from being inserted
			axisLabel: {
				formatter: (value: number) => value.toString()
			}
		},
		yAxis: {
			type: 'value',
			name: 'Incidence\n(diagnoses per 100,000 people)',
			nameTextStyle: {
				fontWeight: 'bold'
			}
		},
		legend: {
			show: isMulti, // if multiple series, show legend
			type: 'scroll',
			orient: 'horizontal'
		},
      	series: allSeries.map(series => ({
			name: series.name,
			type: 'line',
			smooth: false,
			label: true,
			endLabel: {
				show: false,
				formatter: '{a}',
			},
			// Use square symbol if series is only male or female data
			// Note: assumes string "male" does not occur in any other filter options
			symbol: series.name.toLowerCase().includes("male") ? "emptyRect" : "emptyCircle",
			
			// If series is female data, also rotate rectangle
			symbolRotate: series.name.toLowerCase().includes("female") ? 45 : 0,

			// Colors - depends on specific variable (cmap.key) if present; otherwise
			// full label is used
			itemStyle: {
                color: cmap.colors[
                    cmap.key
                        ? series.variables[cmap.key]!
                        : series.name
                ]
            },

            lineStyle: {
                color: cmap.colors[
                    cmap.key
                        ? series.variables[cmap.key]!
                        : series.name
                ]
            },

			// Create year, rate data pairs
			data: series.years.map((year, i) => [
				year,
				series.rates[i]
			])
		}))
    };

	return option;
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
// Could potentially update to instead only clear series data (keeping labels etc.)
export function renderBlankChart(cancerType: string, chartInstance: echarts.ECharts){

	// Clear previous chart/options
	chartInstance.clear();

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
