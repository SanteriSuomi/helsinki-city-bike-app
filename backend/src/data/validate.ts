import moment from "moment";
import { ValidationRule } from "../types/types";

/**
 * Validate a row of csv data
 * @param data Row array where each column is a point of data
 * @param rules Rules applied to this row for validation
 * @returns True if valid and the data as a string delimited by commas (ready for an insert query)
 */
export default function validate(data: string[], rules: ValidationRule[]) {
	for (const [index, rule] of rules.entries()) {
		const field = data[rule.index ?? index];
		if (rule.isString) {
			if (!validateStrings(field)) return false;
		}
		if (rule.isNumber) {
			if (!validateNumbers(field)) return false;
		}
		if (rule.isDate) {
			if (!validateDates(field)) return false;
		}
		if (rule.custom && !rule.custom(field)) return false;
	}
	return true;
}

/**
 * Validate date string (whether the string indeed represents a date)
 * @param date Date string
 * @returns True if date is valid
 */
function validateDates(date: string) {
	if (!date) return false;
	return moment(date).isValid();
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
