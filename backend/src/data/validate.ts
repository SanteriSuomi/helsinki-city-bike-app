import moment from "moment";
import { ValidationRule } from "../types/types";

/**
 * Validates a row of CSV data
 * @param data Row array where each column is a point of data
 * @param rules Rules applied to this row for validation
 * @returns True if valid and the data as a string delimited by commas (ready for an insert query)
 */
export default function validate(data: string[], rules: ValidationRule[]) {
	for (const [index, rule] of rules.entries()) {
		const field = data[rule.index ?? index];
		if (!validateRule(field, rule)) return false;
	}
	return true;
}

function validateRule(field: string, rule: ValidationRule) {
	return (
		(!rule.isString || validateString(field)) &&
		(!rule.isNumber || validateNumber(field)) &&
		(!rule.isDate || validateDate(field)) &&
		(!rule.customCheck || rule.customCheck(field))
	);
}

function validateDate(date: string) {
	return date && moment(date).isValid();
}

function validateNumber(num: string) {
	return num && num.length > 0 && !Number.isNaN(Number(num));
}

function validateString(str: string) {
	return str && str.trim().length > 0;
}
