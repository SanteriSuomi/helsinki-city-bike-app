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
	internalError(res: Response, error: any) {
		res.status(500).json({
			message: "Internal Error",
			content: error,
		});
	},
};
