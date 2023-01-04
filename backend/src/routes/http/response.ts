import { Response } from "express";

export default {
	successData(res: Response, data: any) {
		res.status(200).json({
			message: "Success",
			content: data,
		});
	},
	successEmpty(res: Response) {
		res.status(204).json({
			message: "Success - No Data",
			content: "",
		});
	},
	badRequestError(res: Response, error: any) {
		res.status(400).json({
			message: "Bad Request",
			content: error,
		});
	},
	internalError(res: Response, error: any) {
		res.status(500).json({
			message: "Bad Request or Internal Error - See Content",
			content: error,
		});
	},
};
