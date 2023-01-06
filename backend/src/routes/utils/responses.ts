import { Response } from "express";

enum HttpStatus {
	SUCCESS = 200,
	CREATED = 201,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	CONFLICT = 409,
	INTERNAL_ERROR = 500,
}

enum Message {
	SUCCESS_DATA = "Success",
	SUCCESS_CREATED = "Success - Created",
	SUCCESS_EMPTY = "Success - No Data",
	BAD_REQUEST = "Bad Request",
	CONFLICT = "Not Modified - Item Likely Already Exists",
	INTERNAL_ERROR = "Internal Error or Bad Request - See Content",
}

function sendResponse(
	res: Response,
	status: HttpStatus,
	message: Message,
	content?: any
) {
	content = content ?? "";
	res.status(status).json({ message, content });
}

function sendBadRequest(res: Response, error: any) {
	sendResponse(
		res,
		HttpStatus.BAD_REQUEST,
		Message.BAD_REQUEST,
		error.message
	);
}

function sendInternalError(res: Response, error: any) {
	sendResponse(
		res,
		HttpStatus.INTERNAL_ERROR,
		Message.INTERNAL_ERROR,
		error.message
	);
}

function sendSuccessData(res: Response, data: any) {
	sendResponse(res, HttpStatus.SUCCESS, Message.SUCCESS_DATA, data);
}

function sendSuccessEmpty(res: Response) {
	sendResponse(res, HttpStatus.SUCCESS, Message.SUCCESS_EMPTY);
}

export {
	HttpStatus,
	Message,
	sendResponse,
	sendBadRequest,
	sendInternalError,
	sendSuccessData,
	sendSuccessEmpty,
};
