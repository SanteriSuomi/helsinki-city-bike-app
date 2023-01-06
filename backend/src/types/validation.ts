type ValidationRule = {
	index?: number;
	isString?: boolean;
	isNumber?: boolean;
	isDate?: boolean;
	customCheck?: (field: string) => boolean;
};

export { ValidationRule };
