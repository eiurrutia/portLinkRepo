export class Port {
    id: number;
    shipName: string;
    initalDate: any; // Date
    modelsQuantityInPacking: number;
    unitsToCollect: number;
    collectedUnits: number; // Date
    totalDriversConsidered: number;
    thirdDriversConsidered: number;
    ownDriversConsidered: number;
    turnsEstimated: number;
    turnsMade: number;
    extraBigUnitsQuantity: number; // Total
    bigUnitsQuantity: number; // Total
    mediumUnitsQuantity: number; // Total
    littleUnitsQuantity: number; // Total
    collectedExtraBigUnits: number; // Collected
    collectedBigUnits: number; // Collected
    collectedMediumUnits: number; // Collected
    collectedLittleUnits: number; // Collected
    toCollectExtraBigUnits: number; // To Collect
    toCollectBigUnits: number; // To Collect
    toCollectMediumUnits: number; // To Collect
    toCollectLittleUnits: number; // To Collect
    models: any; // I need a list with models
    brands: any;
    port: string;
    destination: string;
    observation: string;
    expectedBilling: number;
    state: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactCellphone: string;
    // Stats
    timeNeeded: number; // Number of days
    totalTurns: number;
    averageOfUnitsPerTurn: number;
    averageTimePerTurn: number;
    damages: number;
    advancedPercentage: number;
    // State in frontend
    showDetail: boolean;
}
