import { setChartOptions, setMultiChartOptions, setConfidenceChartOptions } from "../utils/filter-new";
import * as echarts from 'echarts';

export function returnAllChartRates(allMatchedItems: any[]){

	var allChartRates: string[] = [];

	if (allMatchedItems){ 
		// get the indicence rates
		allMatchedItems.forEach(item => {
		var temp = item.map((row: { rate: any; }) => row.rate).filter(Boolean);
		// remove the all years result
		temp.pop();
		allChartRates.push(temp);
		});
	}
	return allChartRates;

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
export function renderMultiChart(cancerType: string, allRates: string[], chartInstance: echarts.ECharts) {

	console.log('in multi-chart render');
	console.log(allRates);

	// expects an array of string values
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

    
    // function to initialize the EChart
export function renderConfidenceChart(cancerType: string, rates: string[], lowerBounds: number[], upperBounds: number[], confidenceChartInstance: echarts.ECharts) {
    
    //remove all years result
	rates.pop();
	lowerBounds.pop();
	upperBounds.pop();

	const confidenceOption = setConfidenceChartOptions(rates, lowerBounds, upperBounds, cancerType);
    // Set options to render the chart
    confidenceChartInstance.setOption(confidenceOption);

    // Optional: Make the chart responsive to window resizing
    window.addEventListener('resize', () => {
      confidenceChartInstance.resize();
    });
}
