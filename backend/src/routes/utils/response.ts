import { Response } from "express";

export default {
	successData(res: Response, data: any) {
		res.status(200).json({
			message: "Success - No Content",
			content: data,
		});
	},
	successCreated(res: Response, data?: any) {
		res.status(201).json({
			message: "Success - Created",
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
	neutralConflict(res: Response) {
		res.status(409).json({
			message: "Not Modified - Item Likely Already Exists",
			content: "",
		});
	},
	internalError(res: Response, error: any) {
		res.status(500).json({
			message: "Internal Error or Bad Request - See Content",
			content: error,
		});
	},
};
