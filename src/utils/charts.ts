import * as echarts from 'echarts';
import { getChartColorMapping } from './colors';
import { INCIDENCE_FILTER_LABELS } from "./query"
import { getVariableValueLabels } from './variables';
import type { 
	ProcessedRow, BaseSeries, ChartSeries, TableSeries, SeriesLabels, 
	IncidenceFilter, IncidenceFilterVariable 
} from "../types";

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

// Base function for creating chart/table series - used by returnAllChartSeries and returnAllTableSeries
// removeAll Years: whether to remove "all years" values from series (keep for table, remove for chart)
function returnAllSeries<T extends number | string>(
  allMatchedItems: ProcessedRow[] | ProcessedRow[][],
  yearConverter: (row: ProcessedRow) => T,
  removeAllYears = true,
): BaseSeries<T>[] {
	console.log("allMatchedItems: ", allMatchedItems)

	// If input data is ProcessedRow[] (representing one series), convert to 
	// ProcessedRow[][] by wrapping in outer array
	const seriesData: ProcessedRow[][] =
    Array.isArray(allMatchedItems[0])
        ? allMatchedItems as ProcessedRow[][]
        : [allMatchedItems as ProcessedRow[]];

	// Create chart data 
	var allSeries: BaseSeries<T>[] = [];

	if (seriesData){ 

		// Validate metadata across different years within each series
		seriesData.forEach(validateSeriesMetadata);

		// Create each chart series
		// Here, 
		// 		series = incidence rates for one set of filters, across all years
		// 		row = data for one incidence rate
        seriesData.forEach(series => {

			let rows = series;

            // Remove the "all years" result if requested
			// (will remove any years starting with "all", case insensitive)
			if (removeAllYears) {
            	rows = series.filter(row => !row.diagnosisYear.toLowerCase().startsWith('all'));
			} 

			// Use first row to get label
            const labels = getSeriesLabels(rows[0]);

			// Get years
			if (removeAllYears) {
				// Remove "allyears" option in requested
				rows = series.filter(
					row => !row.diagnosisYear.toLowerCase().startsWith("all"),
				);
			} 

			// Convert to desired type
			const years = rows.map(yearConverter);

			// Get incidence rates (and confidence intervals) and change to numbers
			// Note - no longer filter out undefined values - will handle any in 
			// charting step instead.
			// If do filter out missing values, will need to ensure that years array
			// is also filtered to match
			// Also get counts, but keep as strings - may be text value if n < 10
            const rates = rows.map(row => Number(row.rate))
			const ciLb = rows.map(row => Number(row.ciLb))
			const ciUb = rows.map(row => Number(row.ciUb))
			const count = rows.map(row => String(row.count))

            allSeries.push({
                name: labels.name,
                years: years,
                rates: rates,
				ciLb: ciLb,
				ciUb: ciUb,
				count: count,
				variables: labels.variables
            });
        });
    }

	console.log("allSeries: ", allSeries)

	return allSeries;

}

// Helper for calculating margins
function computeLabelMargins(allSeries: ChartSeries[] | TableSeries[], minSize: number, maxSize: number) {
	// Calculate size of margin based on label lengths
	// Will be length of longest label * 7, with min of 150 and max of 275
	const longestNameLength = Math.max(
    ...allSeries.map(series => series.name.length)
	);
	const margin = Math.min(
		maxSize,
		Math.max(minSize, longestNameLength * 7)
	);
	return margin
}

// Helper for formatting chart subtitles from search terms
// export function formatIncidenceFilterSubtitle(
//   filter: IncidenceFilter
// ): string {
//   return Object.entries(filter)
//     .filter(
//       ([key, values]) =>
//         values.length > 0 &&
//         key in INCIDENCE_FILTER_LABELS
//     )
//     .map(([key, values]) => {
//       const label =
//         INCIDENCE_FILTER_LABELS[
//           key as keyof typeof INCIDENCE_FILTER_LABELS
//         ];

//       // Convert filter values to their display labels
//       const valueLabels = getVariableValueLabels(
//         key as IncidenceFilterVariable,
//         values
//       );

//       // Format the label and values for ECharts rich text
//       return `{key|${label}}{value|: ${valueLabels.join(", ")}}`;
//     })
//     .join("   ");
// }

export function formatIncidenceFilterSubtitle(
  filter: IncidenceFilter,
  maxLength: number
): { subtitle: string; lineCount: number } {
  const fields = Object.entries(filter)
    .filter(
      ([key, values]) =>
        values.length > 0 &&
        key in INCIDENCE_FILTER_LABELS
    )
    .map(([key, values]) => {
      const label =
        INCIDENCE_FILTER_LABELS[
          key as keyof typeof INCIDENCE_FILTER_LABELS
        ];

      // Convert filter values to their display labels
      const valueLabels = getVariableValueLabels(
        key as IncidenceFilterVariable,
        values
      );

      // Format the label and values for ECharts rich text
      const formatted = `{key|${label}}{value|: ${valueLabels.join(", ")}}`;

      // Use the unformatted text when calculating the line length
      const plainText = `${label}: ${valueLabels.join(", ")}`;

      return {
        formatted,
        length: plainText.length,
      };
    });

  const lines: string[] = [];
  let currentLine = "";
  let currentLength = 0;

  for (const field of fields) {
    const separator = currentLine ? "   " : "";
    const separatorLength = currentLine ? 3 : 0;

    if (
      currentLine &&
      currentLength + separatorLength + field.length > maxLength
    ) {
      lines.push(currentLine);
      currentLine = field.formatted;
      currentLength = field.length;
    } else {
      currentLine += separator + field.formatted;
      currentLength += separatorLength + field.length;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return {
    subtitle: lines.join("\n"),
    lineCount: lines.length,
  };
}


// Fixed chart sizes
const CHART_GRID_TOP = 60;
const CHART_GRID_BOTTOM = 100;
const CHART_SUBTITLE_LINE = 16;
const CHART_LEFT_MARGIN = 135;
const CHART_LEFT_BUFFER = 0; // additional left margin buffer to align text/legends with y-axis

// Options for single or multi line chart
// Also adds data to the chart
function setLineChartOptions(allSeries: ChartSeries[], optionString: string, filter?: IncidenceFilter){

	// Get year range from data for the x-axis
	const allYears = allSeries.flatMap(series => series.years);
	const minYear = Math.min(...allYears);
	const maxYear = Math.max(...allYears);

	// Calculate size of right margin based on label lengths
	// Will be length of longest label * 7, with min of 150 and max of 275
	const rightMargin = computeLabelMargins(allSeries, 150, 275)

	// Subtitle from search terms
	let subtitle = ""
	let nSubtitleLines = 0
	if (filter) {
		const {subtitle, lineCount: nSubtitleLines} = formatIncidenceFilterSubtitle(filter, 150);
	}
	// Whether there are multiple series
	const isMulti = allSeries.length > 1;

	// Get colormapping
	const cmap = getChartColorMapping(allSeries);
	console.log("Chart cmap: ", cmap)

	// Axis colour
	const axisLabelColor = "#555";

	// Options
    const option = {
		title: [
			{
				text: optionString + ' Cancer Rates',
				left: CHART_LEFT_MARGIN + CHART_LEFT_BUFFER,
				top: 10
			},
			{
				text: subtitle,
				top: 15 + CHART_SUBTITLE_LINE,
				left: CHART_LEFT_MARGIN + CHART_LEFT_BUFFER,

				textStyle: {
					fontSize: 12,
					fontWeight: "normal",
					lineHeight: CHART_SUBTITLE_LINE,

				rich: {
					key: {
					fontWeight: "bold",
					},
				},
				},
			},
		],
		grid: {
			left: CHART_LEFT_MARGIN,
        	right: rightMargin,
			top: CHART_GRID_TOP + (CHART_SUBTITLE_LINE * nSubtitleLines),
			// If legend, add extra white space between the legend and bottom of the chart
			// Otherwise, use default (60)
			bottom: CHART_GRID_BOTTOM, 
			containLabel: false
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
		  	nameGap: 10, //distance from the axis
			nameTextStyle: {
				fontWeight: 'bold',
			    color: axisLabelColor,
			},
			// Format years as strings to prevent commas from being inserted
			axisLabel: {
				formatter: (value: number) => value.toString()
			}
		},
		graphic: [
			{
				type: "text",
				left: 10,
				top: CHART_GRID_TOP + (CHART_SUBTITLE_LINE * (nSubtitleLines - 0.5)),
				style: {
					text: 'Incidence\n(diagnoses per\n100,000 people)',
					fontWeight: "bold",
					textAlign: "right",
					textVerticalAlign: "middle",
					fill: axisLabelColor
				},
			},
			],
		yAxis: {
			type: 'value',
			// name: 'Incidence\n(diagnoses per 100,000 people)',
			// nameLocation: 'top',
			// nameTextStyle: {
			// 	fontWeight: 'bold'
			// }
		},
		legend: {
			left: CHART_LEFT_MARGIN + CHART_LEFT_BUFFER, 
			show: isMulti, // if multiple series, show legend
			type: 'scroll',
			orient: 'horizontal',
			padding: [
				0,  // top
				rightMargin, // right
				10,  // bottom
				0, // left
			]
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

// Table sizes
const TABLE_ROW_HEIGHT = 70;
const TABLE_COL_WIDTH = 90;
const TABLE_GRID_TOP = 90;
const TABLE_GRID_BOTTOM = 20;
const TABLE_SUBTITLE_LINE = 16;

// Helper function for calculating height of table
function getTableChartHeight(numberOfSeries: number, nSubtitleLines: number): number {
  return (
    TABLE_GRID_TOP +
    TABLE_GRID_BOTTOM +
	(nSubtitleLines * TABLE_SUBTITLE_LINE) + 
    (numberOfSeries * TABLE_ROW_HEIGHT)
  );
}

// Create chart options for eCharts table
function setTableChartOptions(allSeries: TableSeries[], optionString: string, filter: IncidenceFilter) {

	// --- Data formatting ---

	// Get set of ordered years across all series
	const years = [...new Set(
		allSeries.flatMap(series => series.years)
	)].sort((a, b) => {
		if (a.toLowerCase() === "all years") return 1;
		if (b.toLowerCase() === "all years") return -1;

		return Number(a) - Number(b);
	});

	// Get labels (names) for each series
	const names = allSeries.map(series => series.name);

	// Get column index, row index, and data for each cell
	const tableData = allSeries.flatMap((series, rowIndex) =>
		series.years.map((year, yearIndex) => [
			years.indexOf(year),
			rowIndex,
			series.rates[yearIndex],
			series.ciLb[yearIndex],
			series.ciUb[yearIndex],
			series.count[yearIndex],
		])
	);

	// Compute left margin size based on labels
	// Min set to match chart
	const leftMargin = computeLabelMargins(allSeries, CHART_LEFT_MARGIN, 275);

	// Subtitle from search terms
	const {subtitle, lineCount: nSubtitleLines} = formatIncidenceFilterSubtitle(filter, 150);

	// Set chart options to create table
	const options = {

		title: [
			{
				text: optionString + ' Cancer Rates',
				left: leftMargin,
				top: 10			
			},
			{
				text: subtitle,
				top: 15 + CHART_SUBTITLE_LINE,
				left: leftMargin,

				textStyle: {
					fontSize: 12,
					fontWeight: "normal",
					lineHeight: TABLE_SUBTITLE_LINE,

				rich: {
					key: {
					fontWeight: "bold",
					},
				},
				},
			},
			],

		grid: {
			left: leftMargin,
			right: 50,
			top: TABLE_GRID_TOP + (TABLE_SUBTITLE_LINE * nSubtitleLines),
			bottom: TABLE_GRID_BOTTOM,
			containLabel: false,
		},

		xAxis: {
			type: "category",
			data: years,
			position: "top",

			axisLabel: {
			  	fontWeight: "bold",
			},

			axisTick: {
				show: false,
			},

			axisLine: {
				show: true,
				lineStyle: {
					color: "#666",
					width: 2,
				},
			},

			splitLine: {
				show: false,
			},
		},

		yAxis: {
			type: "category",
			data: names, // Label for each series
			inverse: true,
			axisLabel: {
			  	fontWeight: "bold",
				width: leftMargin,
				overflow: 'break'
			},

			axisTick: {
				show: false,
			},

			axisLine: {
				show: false,
			},
			splitLine: {
				show: true,
				lineStyle: {
				width: 3,
				},
			}
		},

		// Create heatmap using rates values
		visualMap: {
			dimension: 2,
			min: Math.min(...allSeries.flatMap(series => series.rates)),
			max: Math.max(...allSeries.flatMap(series => series.rates)),
			calculable: false,
			show: false, // don't show colourbar

			inRange: {
			color: [
				"#f5f9fc",
				"#e2eef6",
				"#c9dfed",
				"#afd0e2",
				"#95bfd6",
			],
			},
		},

		series: [
			{
				type: "heatmap",

				data: tableData,

				encode: {
					x: 0,
					y: 1,
					value: 2,
				},

				itemStyle: {
					borderWidth: 0,
					borderBottomWidth: 1,
					borderColor: "#ccc",
				},

				label: {
					show: true,

					// First line: rate
					// Second line: (ciLb, ciUb)
					// Third line: n = count
					formatter: (params: any) => {
						const [, , rate, ciLb, ciUb, count] = params.value;

						return [
							`{rate|${rate}}`,
							`{details|(${ciLb}, ${ciUb})}`,
							`{details|n = ${count}}`,
						].join("\n");
					},

					// Format cell text - rate is larger and heavier weight
					rich: {
					rate: {
						fontSize: 14,
						fontWeight: "400",
						lineHeight: 18,
					},

					details: {
						fontSize: 12,
						fontWeight: "200",
						lineHeight: 16,
					},
					},
				},
			},
		],
		};
	return {options, nSubtitleLines}
}

// --- Exported functions ---

// For chart series, want years to be a number array without "allyears"
export function returnAllChartSeries(
  allMatchedItems: ProcessedRow[] | ProcessedRow[][]
): ChartSeries[] {
  return returnAllSeries(
    allMatchedItems,
    row => Number(row.diagnosisYear),
    true,
  );
}

// For table series, want years to be a string array with "allyears"
export function returnAllTableSeries(
  allMatchedItems: ProcessedRow[] | ProcessedRow[][]
): TableSeries[] {
	let series = returnAllSeries(
		allMatchedItems,
		row => String(row.diagnosisYear),
		false,
	);

	// Convert "allyears" text to "All years"
	series = series.map(tableSeries => ({
		...tableSeries,
		years: tableSeries.years.map(year =>
		year.toLowerCase() === "allyears" ? "All years" : year
		),
	}));
	console.log("tableSeries: ", series)

  	return series;

}


// Function in initialise an eCharts chart
// "element" is the id of the DOM element where the chart will be added
export function initChart(element: string, addResizeListener: boolean = true): echarts.ECharts {
	const chartDom = document.getElementById(element);
  	const chartInstance = echarts.init(chartDom);

	// Event listener for window resizing
	if (addResizeListener) {
		window.addEventListener('resize', () => {
		chartInstance.resize();
		});
	}
	return chartInstance

}

 // function to render a single- or multi-line chart
export function renderLineChart(
	cancerType: string, 
	allSeries: ChartSeries[], 
	chartInstance: echarts.ECharts, 
	filter?: IncidenceFilter // option, for creating subtitle with filter options
) {

	console.log('in line chart render');
	console.log("chart series: ", allSeries);
	
	const options = setLineChartOptions(allSeries, cancerType, filter);

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
     chartInstance.setOption(options);

}


 // Function to render a table
export function renderTableChart(
	cancerType: string, 
	allSeries: TableSeries[], 
	chartInstance: echarts.ECharts,
	filter: IncidenceFilter
) {

	console.log('in table render');
	console.log("chart series: ", allSeries);
	
	// Create options for table (matrix) chart for this data
	const {options, nSubtitleLines} = setTableChartOptions(allSeries, cancerType, filter);

	// Clear previous chart/options
	// Otherwise, options will add new data to existing data (instead of replacing existing data)
	chartInstance.clear();

	// Resize table element to match number of rows in table
	const tableElement = chartInstance.getDom();
	const height = getTableChartHeight(allSeries.length, nSubtitleLines);
	console.log("table height: ", height)
	tableElement.style.height = `${height}px`;

	// Resize table element to fix cell width across different plots (with different label lengths)
	const numberOfColumns = options.xAxis.data.length;

	const width =
		options.grid.left +
		numberOfColumns * TABLE_COL_WIDTH +
		options.grid.right;
	tableElement.style.width = `${width}px`;

	// Resize
	chartInstance.resize();

    // Set options to render the chart
     chartInstance.setOption(options);

}

// creates a blank chart with null values and wipes out any previous chart 
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