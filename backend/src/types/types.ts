type Journey = {
	departureDate: string;
	returnDate: string;
	departureStationId: number;
	departureStationName: string;
	returnStationId: number;
	returnStationName: string;
	coveredDistance: number;
	duration: number;
};

type ValidateData = {
	valid: boolean;
	journey?: Journey;
};

export { Journey, ValidateData };
