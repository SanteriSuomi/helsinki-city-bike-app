import moment from "moment";
import { MIN_DISTANCE, MIN_DURATION } from "../constants";
import { ValidateData } from "../types/types";

/**
 * Validate CSV data
 * @param csv CSV data
 * @param i Index of the row that should be validated
 * @returns True if valid, also returns the data as an object
 */
export default function validate(csv: any, i: number): ValidateData {
	const departureDate = csv[i][0];
	const returnDate = csv[i][1];
	const departureStationId = csv[i][2];
	const departureStationName = csv[i][3];
	const returnStationId = csv[i][4];
	const returnStationName = csv[i][5];
	const coveredDistance = csv[i][6];
	const duration = csv[i][7];

	const valid =
		validateStrings(
			departureDate,
			returnDate && departureStationName,
			returnStationName
		) &&
		validateDates(departureDate, returnDate) &&
		validateNumbers(
			departureStationId,
			returnStationId,
			coveredDistance,
			duration
		) &&
		coveredDistance >= MIN_DISTANCE &&
		duration >= MIN_DURATION;

	if (valid) {
		return {
			valid: true,
			journey: {
				departureDate: departureDate,
				returnDate: returnDate,
				departureStationId: departureStationId,
				departureStationName: departureStationName,
				returnStationId: returnStationId,
				returnStationName: returnStationName,
				coveredDistance: coveredDistance,
				duration: duration,
			},
		};
	}
	return { valid: false };
}

/**
 * Validate start & end dates (e.g departure and return)
 * @param start Start date
 * @param end End date
 * @returns True if dates are valid
 */
function validateDates(start: string, end: string) {
	if (!start || !end) return false;
	const startMoment = moment(start);
	const endMoment = moment(end);
	return (
		startMoment.isValid() &&
		endMoment.isValid() &&
		startMoment.isBefore(endMoment)
	);
}

/**
 * Validate numbers - they should not be NaN
 * @param num Numbers
 * @returns True if numbers are valid
 */
function validateNumbers(...numbers: string[]) {
	if (numbers.length === 0) return false;
	numbers.forEach((num) => {
		if (!num || Number.isNaN(num)) return false;
	});
	return true;
}

/**
 * Validate strings - they have at least one character
 * @param strings Strings
 * @returns True if strings are valid
 */
function validateStrings(...strings: string[]) {
	if (strings.length === 0) return false;
	strings.forEach((str) => {
		if (!str || str.length === 0) return false;
	});
	return true;
}
