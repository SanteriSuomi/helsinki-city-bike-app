import moment from "moment";
import { ValidationRule } from "../types/types";

/**
 * Validate a row of data from a CSV file
 * @param data Row array where each column is a point of data
 * @param rules Rules applied to this row for validation
 * @returns True if valid and the data as a string delimited by commas (ready for an insert query)
 */
export default function validate(data: string[], rules: ValidationRule[]) {
	for (const [index, rule] of rules.entries()) {
		const field = data[rule.index ?? index];
		if (!validateField(field, rule)) return false;
	}
	return true;
}

function validateField(field: string, rule: ValidationRule) {
	if (rule.isString && !validateString(field)) return false;
	if (rule.isNumber && !validateNumber(field)) return false;
	if (rule.isDate && !validateDate(field)) return false;
	if (rule.customCheck && !rule.customCheck(field)) return false;
	return true;
}

function validateString(field: string) {
	return typeof field === "string";
}

function validateNumber(field: string) {
	return !isNaN(Number(field));
}

function validateDate(field: string) {
	return !isNaN(Date.parse(field));
}
