import * as echarts from 'echarts';
import { getChartColorMapping } from './colors';
import { getVariableValueLabels, CANCER_STATISTICS, STATISTICS_CONFIG } from './variables';
import type { Statistic } from './variables';
import type { 
	IncidenceProcessedRow, 
	IncidenceBaseSeries, 
	IncidenceChartSeries, 
	IncidenceTableSeries, 
	IncidenceSeriesLabels, 
	IncidenceFilter, 
	IncidenceFilterVariable, 
	SurvivalProcessedRow,
	SurvivalSeries,
	SurvivalFilter,
	ChartArgs,
	TableArgs,
} from "../types";


// --- Helper functions within module ---

// Validate processed data for one series (line)
// Checks that IncidenceProcessedRow[] arrays (rates for different years, but same filters) 
// have same metadata.
function validateSeriesMetadata(series: IncidenceProcessedRow[] | SurvivalProcessedRow[], statistic: typeof CANCER_STATISTICS[number]) {
  if (series.length === 0) {
    throw new Error('No data is available for this combination of filters.');
  }

  // Get variables used for labels for statistic
  const labelVariables = STATISTICS_CONFIG[statistic].labelVariables

  // Use first array as expected values
  const first = series[0];

  // Loop through all fields used to create labels
  for (const field of labelVariables) {
    const expected = first[field];

    const consistent = series.every(row => row[field] === expected);

    if (!consistent) {
      throw new Error(
        `Inconsistent ${field} values within chart series`
      );
    }
  }
}

// Get the name of the series (i.e., the data in IncidenceProcessedRow[]) from one row (array)
// Also stories the variables and variable values used to make the name
// Use validateSeriesMetadata first to check that each row has same metadata
function getSeriesLabels(row: IncidenceProcessedRow | SurvivalProcessedRow, statistic: typeof CANCER_STATISTICS[number]): IncidenceSeriesLabels {
	
	// Get variables used for labels for statistic
  	const labelVariables = STATISTICS_CONFIG[statistic].labelVariables

	// Get values for each of the label variables
    const variables = labelVariables
		// Only keep values that don't start with "all" (case insensitive)
        .filter(field => !row[field].toLowerCase().startsWith('all'))
		// Get the 
        .reduce((result, field) => {
            result[field] = row[field];
            return result;
        }, {} as Partial<Record<typeof labelVariables[number], string>>);

    return {
        name: Object.values(variables).join(', '),
        variables: variables
    };
}

// Base function for creating chart/table Incidence series - 
// used by returnAllIncidenceChartSeries and returnAllIncidenceTableSeries
// removeAll Years: whether to remove "all years" values from series (keep for table, remove for chart)
function returnAllIncidenceSeries<T extends number | string>(
  allMatchedItems: IncidenceProcessedRow[] | IncidenceProcessedRow[][],
  yearConverter: (row: IncidenceProcessedRow) => T,
  removeAllYears = true,
): IncidenceBaseSeries<T>[] {
	console.log("allMatchedItems: ", allMatchedItems)

	const statistic = "incidence";

	// If input data is IncidenceProcessedRow[] (representing one series), convert to 
	// IncidenceProcessedRow[][] by wrapping in outer array
	const seriesData: IncidenceProcessedRow[][] =
    Array.isArray(allMatchedItems[0])
        ? allMatchedItems as IncidenceProcessedRow[][]
        : [allMatchedItems as IncidenceProcessedRow[]];

	// Create chart data 
	var allSeries: IncidenceBaseSeries<T>[] = [];

	if (seriesData){ 

		// Validate metadata across different years within each series
		seriesData.forEach(series => validateSeriesMetadata(series, statistic));

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
            const labels = getSeriesLabels(rows[0], statistic);

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

// Helper for calculating margins, depending on amount of space needed for labels
function computeLabelMargins(
	allSeries: { name: string }[], minSize: number, maxSize: number
) {
	// Calculate size of margin based on label lengths
	// Will be length of longest label * 7, with min of minSize and max of maxSize
	const longestNameLength = Math.max(
    ...allSeries.map(series => series.name.length)
	);
	const margin = Math.min(
		maxSize,
		Math.max(minSize, longestNameLength * 7)
	);
	return margin
}

export function formatFilterSubtitle(
  filter: IncidenceFilter | SurvivalFilter,
  maxLength: number,
  statistic: typeof CANCER_STATISTICS[number],
): { subtitle: string; lineCount: number } {

  // Get labels for variables for this statistic
  const filterLabels = STATISTICS_CONFIG[statistic].filterLabels;

  const fields = Object.entries(filter)
    .filter(
      ([key, values]) =>
        values.length > 0 &&
        key in filterLabels
    )
    .map(([key, values]) => {
      const label =
        filterLabels[
          key as keyof typeof filterLabels
        ];

      // Convert filter values to their display labels
      const valueLabels = getVariableValueLabels(
        key as IncidenceFilterVariable,
        values,
		"incidence"
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

// Get chart/table title and location from top of chart
function getTitle(args: ChartArgs | TableArgs) {
	let titleText = "";

	if (args.statistic === "incidence") {

		// Get year range from data
		// Need to remove "all years" from table version first
		const allYears = args.allSeries
			.flatMap((series) =>
				series.years
					.filter(
						(year) =>
							String(year).toLowerCase() !== "all years",
					)
					.map(Number),
			);

		const minYear = Math.min(...allYears);
		const maxYear = Math.max(...allYears);

		// Need to add "age-standardised" if all ages is filter
		let ageText = ""; 
		if (args.filter.ageBand[0] === String(STATISTICS_CONFIG[args.statistic].variableAll.ageBand.value)) {
			ageText = "age-standardised "; // include trailing space in string
		}
		titleText = `Trends in ${ageText}incidence of ${args.cancer.toLowerCase()} cancer: England ${minYear}-${maxYear}`
	} else if (args.statistic === "survival") {
		titleText = `Net survival of ${args.cancer.toLowerCase()} cancer: England`;

	} else {
		throw new Error("Unsupported statistic");
	}

	return titleText
}

// Fixed chart sizes
const CHART_GRID_TOP = 60;
const CHART_GRID_BOTTOM = 100;
const CHART_SUBTITLE_LINE = 16;
const CHART_LEFT_MARGIN = 150;
const CHART_LEFT_BUFFER = 0; // additional left margin buffer to align text/legends with y-axis
const CHART_AXIS_LABEL_SIZE = 14;
const CHART_AXIS_LABEL_WEIGHT = "normal";
const CHART_AXIS_LABEL_COLOR = "#555"
const CHART_MAX_SUBTITLE_LENGTH = 140;

// Options for single or multi line chart
// Also adds data to the chart
function setLineChartOptions(
	chartArgs: ChartArgs
){
	// Initialise options/settings/text for
	// - x-axis
	// - y-axis label (implemented as graphic to have control over location) and location
	// - data 
	let xOpt = {};
	let yLabText = ""; // text only - label settings are the same for both statistics
	let yLabLeft = 0; // Controls horizontal location for y-axis label
	let yNDec = 0; // How many decimal places values should have
	let seriesData: [number, number][][];

	// Subtitle from search terms
	let {subtitle, lineCount: nSubtitleLines} = formatFilterSubtitle(
		chartArgs.filter, CHART_MAX_SUBTITLE_LENGTH, chartArgs.statistic
	);

	// Statistic-specific logic to create data and labels
	if (chartArgs.statistic === "incidence") {

		// Get year range from data for the x-axis
		const allYears = chartArgs.allSeries.flatMap(series => series.years);
		const minYear = Math.min(...allYears);
		const maxYear = Math.max(...allYears);

		// x-axis settings
		xOpt = {
			// Treat years as "value" to make more robust 
			// (e.g., to nonchronological orders or missing years)
			type: 'value',
			min: minYear,
			max: maxYear,
			interval: 1,
			name: 'Year of diagnosis',
			nameLocation: 'middle',
		  	nameGap: 25, //distance from the axis
			nameTextStyle: {
				fontWeight: CHART_AXIS_LABEL_WEIGHT,
			    color: CHART_AXIS_LABEL_COLOR,
				fontSize: CHART_AXIS_LABEL_SIZE,
			},
			// Format years as strings to prevent commas from being inserted
			axisLabel: {
				formatter: (value: number) => value.toString()
			}
		}

		// custom y-axis label - depends on if data is filtered to all ages
		let ageText = (
		  (chartArgs.filter.ageBand[0] === String(STATISTICS_CONFIG[chartArgs.statistic].variableAll.ageBand.value))?
		  "standardised": "specific" 
		)
		yLabText = `Age-${ageText}\nincidence\n(per 100,000\nperson-years)`
		yLabLeft = (
		  (chartArgs.filter.ageBand[0] === String(STATISTICS_CONFIG[chartArgs.statistic].variableAll.ageBand.value))?
		  4: 26 // need more space for "standardised" case 
		)
		yNDec = 1;

		// Series data
		seriesData = chartArgs.allSeries.map(series =>
			series.years.map((year, i) => [
				year,
				series.rates[i]
			])
		);
	} else if (chartArgs.statistic === "survival") {

		// Get quarterYear range from data for the x-axis
		const allQYears = chartArgs.allSeries.flatMap(series => series.quarterYear);
		const minQYear = Math.min(...allQYears);
		const maxQYear = Math.max(...allQYears);

		// x-axis settings
		xOpt = {
			type: 'value',
			min: minQYear,
			max: maxQYear,
			interval: 1, // to label whole years only
			name: 'Years since diagnosis',
			nameLocation: 'middle',
		  	nameGap: 25, //distance from the axis
			nameTextStyle: {
				fontWeight: CHART_AXIS_LABEL_WEIGHT,
			    color: CHART_AXIS_LABEL_COLOR,
				fontSize: CHART_AXIS_LABEL_SIZE,
			}
		}

		// custom y-axis label and location
		yLabText = "Net survival";
		yLabLeft = 25;
		yNDec = 0;

		// Series data
		seriesData = chartArgs.allSeries.map(series =>
			series.quarterYear.map((quarterYear, i) => [
				quarterYear,
				series.survival[i]
			])
		);
	} else {
		throw new Error("Unsupported statistic");
	}

	// Title
	let titleText = getTitle(chartArgs);

	// Create ylabel object
	let yLab = {
		type: "text",
		left: yLabLeft,
		top: CHART_GRID_TOP + (CHART_SUBTITLE_LINE * (nSubtitleLines - 0.5)) + 2,
		style: {
			text: yLabText,
			fontWeight: CHART_AXIS_LABEL_WEIGHT,
			textAlign: "right",
			textVerticalAlign: "middle",
			fill: CHART_AXIS_LABEL_COLOR,
			lineHeight: CHART_AXIS_LABEL_SIZE,
			fontSize: CHART_AXIS_LABEL_SIZE
		},
	}

	// Calculate size of right margin based on label lengths
	// Will be length of longest label * 7, with min of 150 and max of 275
	const rightMargin = computeLabelMargins(chartArgs.allSeries, 150, 275)

	// Whether there are multiple series
	const isMulti = chartArgs.allSeries.length > 1;

	// Colours
	const cmap = getChartColorMapping(chartArgs);
	const seriesColors = chartArgs.allSeries.map((series) => {
		// If no colour variable, use the series name.
		if (!cmap.key) {
			return cmap.colors[series.name];
		}

		// It there is a colour variable, get the variable's value for this series from 
		// series.variables.
		const colorValue =
			(series.variables as Record<string, string>)[cmap.key];

		// Look up the colour for that value.
		// Fall back to the series name if the variable isn't present.
		return cmap.colors[colorValue ?? series.name];
	});

	// Options
    const option = {
		title: [
			{
				text: titleText,
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
			valueFormatter: (value: number) => value.toFixed(yNDec),
			axisPointer: {
				label: {
				formatter: (params: any) => String(params.value)
				}
			}
		},
		xAxis: xOpt,
		graphic: [yLab],
		yAxis: {
			type: 'value',
			axisLabel: {
				formatter: (value: number) => {
					return chartArgs.statistic === "survival"? `${value}%`: value;
				}
			}
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
      	series: chartArgs.allSeries.map((series, i) => ({
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
                color: seriesColors[i]
            },

            lineStyle: {
                color: seriesColors[i]
            },

			// x,y pairs
			data: seriesData[i]
		}))
    };

	return option;
}

// Table sizes
// Cell sizes depend on statistic - incidence needs more space
const TABLE_ROW_HEIGHT = {
	"incidence": 70,
	"survival": 50
}
const TABLE_COL_WIDTH = {
	"incidence": 90,
	"survival": 80
}
const TABLE_GRID_TOP = 90;
const TABLE_GRID_BOTTOM = 20;
const TABLE_SUBTITLE_LINE = 16;

// Helper function for calculating height of table
function getTableChartHeight(numberOfSeries: number, nSubtitleLines: number, statistic: Statistic): number {
  return (
    TABLE_GRID_TOP +
    TABLE_GRID_BOTTOM +
	(nSubtitleLines * TABLE_SUBTITLE_LINE) + 
    (numberOfSeries * TABLE_ROW_HEIGHT[statistic])
  );
}

// Create chart options for eCharts table
function setTableChartOptions(
	tableArgs: TableArgs,
) {

	// Statistic-specific logic for generating data and text
	let tableData;
	let xData;
	let cMin = 0;
	let cMax = 0;
	let cellFormatter: (params: any) => string;

	if (tableArgs.statistic === "incidence") {

		// Get set of ordered years across all series
		const years = [...new Set(
			tableArgs.allSeries.flatMap(series => series.years)
		)].sort((a, b) => {
			if (a.toLowerCase() === "all years") return 1;
			if (b.toLowerCase() === "all years") return -1;

			return Number(a) - Number(b);
		});

		// Get column index, row index, and data for each cell
		tableData = tableArgs.allSeries.flatMap((series, rowIndex) =>
			series.years.map((year, yearIndex) => [
				years.indexOf(year),
				rowIndex,
				series.rates[yearIndex].toFixed(1),
				series.ciLb[yearIndex].toFixed(1),
				series.ciUb[yearIndex].toFixed(1),
				series.count[yearIndex],
			])
		);
		xData = years;
		cMin = Math.min(...tableArgs.allSeries.flatMap(series => series.rates));
		cMax = Math.max(...tableArgs.allSeries.flatMap(series => series.rates));

		// Formatter for displaying data in each cell
		// First line: rate
		// Second line: (ciLb, ciUb)
		// Third line: n = count
		cellFormatter = (params: any) => {
			const [, , rate, ciLb, ciUb, count] = params.value;

			return [
				`{main|${rate}}`,
				`{details|(${ciLb}, ${ciUb})}`,
				`{details|n = ${count}}`,
			].join("\n");
		};

	} else if (tableArgs.statistic === "survival") {
		// Get set of ordered quarter years across all series
		const quarterYear = [...new Set(
			tableArgs.allSeries.flatMap(series => series.quarterYear)
		)].sort((a, b) => {
			return a - b;
		});

		// Get column index, row index, and data for each cell
		tableData = tableArgs.allSeries.flatMap((series, rowIndex) =>
			series.quarterYear.map((year, yearIndex) => [
				quarterYear.indexOf(year),
				rowIndex,
				series.survival[yearIndex].toFixed(0),
				series.ciLb[yearIndex].toFixed(0),
				series.ciUb[yearIndex].toFixed(0),
			])
		);
		xData = quarterYear.map(year => `${year} yrs`);

		cMin = Math.min(...tableArgs.allSeries.flatMap(series => series.survival));
		cMax = Math.max(...tableArgs.allSeries.flatMap(series => series.survival));

		// Formatter for displaying data in each cell
		// First line: surival, as percentage
		// Second line: (ciLb, ciUb)
		cellFormatter = (params: any) => {
			const [, , survival, ciLb, ciUb] = params.value;

			return [
				`{main|${survival}%}`,
				`{details|(${ciLb}%, ${ciUb}%)}`
			].join("\n");
		};
	} else {
    	throw new Error("Unsupported statistic.");
	}

	// Title
	let titleText = getTitle(tableArgs);

	// Get labels (names) for each series
	const names = tableArgs.allSeries.map(series => series.name);

	// Match left margin to chart; will wrap if value overflows
	const leftMargin = CHART_LEFT_MARGIN;

	// Subtitle from search terms
	const {subtitle, lineCount: nSubtitleLines} = formatFilterSubtitle(
		tableArgs.filter, CHART_MAX_SUBTITLE_LENGTH, tableArgs.statistic
	);

	// Set chart options to create table
	const options = {

		title: [
			{
				text: titleText,
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
			data: xData,
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
			min: cMin,
			max: cMax,
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
					// How to display text in cell
					formatter: cellFormatter,

					// Format cell text - rate is larger and heavier weight
					rich: {
					main: {
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
export function returnAllIncidenceChartSeries(
  allMatchedItems: IncidenceProcessedRow[] | IncidenceProcessedRow[][],
): IncidenceChartSeries[] {
  return returnAllIncidenceSeries(
    allMatchedItems,
    row => Number(row.diagnosisYear),
    true,
  );
}

// For table series, want years to be a string array with "allyears"
export function returnAllIncidenceTableSeries(
  allMatchedItems: IncidenceProcessedRow[] | IncidenceProcessedRow[][],
): IncidenceTableSeries[] {
	let series = returnAllIncidenceSeries(
		allMatchedItems,
		row => String(row.diagnosisYear),
		false,
	);

	// Convert "allyears" text to "All years"
	series = series.map(IncidenceTableSeries => ({
		...IncidenceTableSeries,
		years: IncidenceTableSeries.years.map(year =>
		year.toLowerCase() === "allyears" ? "All years" : year
		),
	}));
	console.log("IncidenceTableSeries: ", series)

  	return series;

}

// Function for creating chart/table Survival series
// Can use same function for charts and tables since do not have values that need to remove for chart
// (unlike incidence data)
export function returnAllSurvivalSeries(
  allMatchedItems: SurvivalProcessedRow[] | SurvivalProcessedRow[][],
): SurvivalSeries[] {
	console.log("allMatchedItems: ", allMatchedItems)

	const statistic = "survival";

	// If input data is IncidenceProcessedRow[] (representing one series), convert to 
	// IncidenceProcessedRow[][] by wrapping in outer array
	const seriesData: SurvivalProcessedRow[][] =
    Array.isArray(allMatchedItems[0])
        ? allMatchedItems as SurvivalProcessedRow[][]
        : [allMatchedItems as SurvivalProcessedRow[]];

	// Create chart data 
	var allSeries: SurvivalSeries[] = [];

	if (seriesData){ 

		// Validate metadata across different years within each series
		seriesData.forEach(series => validateSeriesMetadata(series, statistic));

		// Create each chart series
		// Here, 
		// 		series = survival rates for one set of filters, across all quarter years
		// 		row = data for one survival rate
        seriesData.forEach(series => {

			let rows = series;

			// Use first row to get label
            const labels = getSeriesLabels(rows[0], statistic);

			// Get survival data and ensure numeric
			// Also multiply survival and CIs by 100 to transform to percentaage
            const quarterYear = rows.map(row => Number(row.quarterYear))
			const survival = rows.map(row => Number(row.survival) * 100)
			const ciLb = rows.map(row => Number(row.ciLb) * 100)
			const ciUb = rows.map(row => Number(row.ciUb) * 100)

            allSeries.push({
                name: labels.name,
                quarterYear: quarterYear,
                survival: survival,
				ciLb: ciLb,
				ciUb: ciUb,
				variables: labels.variables
            });
        });
    }

	console.log("allSeries: ", allSeries)

	return allSeries;

}

// Function to initialise an eCharts chart
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
	chartInstance: echarts.ECharts, 
	chartArgs: ChartArgs
) {

	console.log('in line chart render');
	console.log("chart series: ", chartArgs.allSeries);
	
	const options = setLineChartOptions(chartArgs);

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
				series: chartArgs.allSeries.map(() => ({
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
	chartInstance: echarts.ECharts, 
	tableArgs: TableArgs
) {

	console.log('in table render');
	console.log("chart series: ", tableArgs.allSeries);
	
	// Create options for table (matrix) chart for this data
	const {options, nSubtitleLines} = setTableChartOptions(tableArgs);

	// Clear previous chart/options
	// Otherwise, options will add new data to existing data (instead of replacing existing data)
	chartInstance.clear();

	// Resize table element to match number of rows in table
	const tableElement = chartInstance.getDom();
	const height = getTableChartHeight(tableArgs.allSeries.length, nSubtitleLines, tableArgs.statistic);
	tableElement.style.height = `${height}px`;

	// Resize table element to fix cell width across different plots (with different label lengths)
	const numberOfColumns = options.xAxis.data.length;

	const width =
		options.grid.left +
		numberOfColumns * TABLE_COL_WIDTH[tableArgs.statistic] +
		options.grid.right;
	tableElement.style.width = `${width}px`;

	// Resize
	chartInstance.resize();

    // Set options to render the chart
     chartInstance.setOption(options);

}

// creates a blank chart with null values and wipes out any previous chart 
// Could potentially update to instead only clear series data (keeping labels etc.)
export function renderBlankChart(chartInstance: echarts.ECharts){

	// Clear previous chart/options
	chartInstance.clear();

}