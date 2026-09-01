import type { ChartSeries, ChartColorMapping } from "../types";
import { CHART_LABEL_VARIABLES } from "./charts";
import { INCIDENCE_VARIABLE_OPTIONS, VARIABLE_TYPE } from "./variables";
import chroma from "chroma-js";

// --- Helper functions ---

// Get which variables in set of chart series that have more than one value across the 
// different series
function getChartVariablesWithMultipleValues(
    allSeries: ChartSeries[]
): typeof CHART_LABEL_VARIABLES[number][] {

    return CHART_LABEL_VARIABLES.filter(variable => {
        const values = new Set(
            allSeries.map(series => series.variables[variable])
        );

        return values.size > 1;
    });
}

// --- Colors and colormaps ---

//const CMAP_CONT = chroma.scale('Viridis')

const CMAP_CONT = chroma.scale([
    "#291f5b",
    "#4b206b",
    "#701f6f",
    "#a2256d",
    "#d33159",
    "#f87a08",
    "#f7c922"
])
// echarts default
const CMAP_CAT = [
    '#5070dd',
    '#b6d634',
    '#505372',
    '#ff994d',
    '#0ca8df',
    '#ffd10a',
    '#fb628b',
    '#785db0',
    '#3fbe95'
];

// Male/Female categorical
// const CMAP_MF = [
//     '#12a4ac',
//     '#934fb5',
// ]

const CMAP_MF = [
    '#4c96c4',
    '#9b2643'
]

const CLR_SERIES_DEFAULT = '#384585';

export const VARIABLE_CMAPS = Object.fromEntries(
    Object.entries(INCIDENCE_VARIABLE_OPTIONS).map(([variable, options]) => {

        // Colormap depends on if continuous or categorical variables
        var colors: string[] = []
        if (variable === "sex") {
            colors = CMAP_MF;
        } else {
            colors =
                VARIABLE_TYPE[variable as keyof typeof VARIABLE_TYPE] === 'continuous'
                    ? CMAP_CONT.colors(options.length)
                    : options.map(
                        (_, index) => CMAP_CAT[index % CMAP_CAT.length]
                    );
        }

        return [
            variable,
            Object.fromEntries(
                options.map((option, index) => [
                    option.value,
                    colors[index]
                ])
            )
        ];
    })
);

// --- Exported functions ---

// From chart series data, determine which variables to use for color encoding and
// return color mapping
export function getChartColorMapping(
    allSeries: ChartSeries[]
): ChartColorMapping {

    // Which variables in the chart have multiple values
    const multipleVariables = getChartVariablesWithMultipleValues(allSeries);

    // ---- Multiple series ----

    if (allSeries.length > 1) {

        // Exactly one varying variable -> use that variable
        if (multipleVariables.length === 1) {
            const key = multipleVariables[0];

            return {
                key,
                colors: VARIABLE_CMAPS[key]
            };
        }

        // Sex + exactly one other variable -> use other variable
        if (
            multipleVariables.length === 2 &&
            multipleVariables.includes('sex')
        ) {
            const key = multipleVariables.find(
                variable => variable !== 'sex'
            )!;

            return {
                key,
                colors: VARIABLE_CMAPS[key]
            };
        }

        // Multiple variables -> color by full series label (don't use variables for encoding)
        const cmap = allSeries.map(
            (_, index) => CMAP_CAT[index % CMAP_CAT.length]
        );

        return {
            key: null,
            colors: Object.fromEntries(
                allSeries.map((series, index) => [
                    series.name,
                    cmap[index]
                ])
            )
        };
    }

    // ---- Single series ----

    const variables = Object.keys(allSeries[0].variables) as
        typeof CHART_LABEL_VARIABLES[number][];

    // Only one variable
    if (
        variables.length === 1
    ) {
        return {
            key: 'sex',
            colors: VARIABLE_CMAPS[variables[0]]
        };
    }

    // Sex + another variable -> use the other variable
    const nonSexVariable = variables.find(
        variable => variable !== 'sex'
    );

    if (nonSexVariable) {
        return {
            key: nonSexVariable,
            colors: VARIABLE_CMAPS[nonSexVariable]
        };
    }

    // Nothing suitable for color encoding -> use default color (don't use variables for encoding)
    return {
        key: null,
        colors: {
            [allSeries[0].name]: CLR_SERIES_DEFAULT
        }
    };
}