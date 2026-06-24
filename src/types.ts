export interface CSVRow {
    id: number;
    table: string;
    diagnosisYear: string;
    ageSpecificIncidenceAge0_49: number;
    ageSpecificIncidenceAge50_54: number;
    ageSpecificIncidenceAge55_59: number;
    ageSpecificIncidenceAge60_64: number;
    ageSpecificIncidenceAge65_69: number;
    ageSpecificIncidenceAge70_74: number;
    ageSpecificIncidenceAge75_79: number;
    ageSpecificIncidenceAge80_84: number;
    ageSpecificIncidenceAge85_89: number;
    ageSpecificIncidenceAge90: number;
} 

export interface CSVDataInput {
	yearQuery: string;
	keyQuery: string;
	keyQueryTwo: string;
	csvText: string;
}

export interface CSVData {
	matchedRows: CSVRow[];
	matchedRowsSecond: CSVRow[];
}
