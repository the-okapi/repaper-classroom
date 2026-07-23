export class HttpError extends Error {
	statusCode: number;

	constructor(message: string, statusCode: number) {
		super(message);

		this.statusCode = statusCode;
	}
}

export const ERROR_MESSAGE = 'Something went wrong. Please try again later.';

export function unwrap(response: { data: any; error: any }, code: number) {
	if (response.error) {
		console.error(response.error, 'Error Code ' + code);
		throw new HttpError(response.error.message, 500);
	} else {
		return response.data;
	}
}

export function unwrapNoData(response: { error: any }, code: number) {
	if (response.error) {
		console.error(response.error, 'Error Code ' + code);
		throw new HttpError(response.error.message, 500);
	}
}
