import { setChartOptions, setMultiChartOptions } from "../utils/filter-new";
import * as echarts from 'echarts';
    
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
