export class Port {
    id: number;
    shipName: string;
    initalDate: any; // Date
    unitsToCollect: number;
    collectedUnits: number; // Date
    totalDriversConsidered: number;
    thirdDriversConsidered: number;
    ownDriversConsidered: number;
    turnsEstimated: number;
    turnsMade: number;
    extraBigUnitsQuantity: number;
    bigUnitsQuantity: number;
    mediumUnitsQuantity: number;
    littleUnitsQuantity: number;
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
    damages: boolean;
    // State in frontend
    showDetail: boolean;
}
