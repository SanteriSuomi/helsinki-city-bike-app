import { AbortableFetch } from "../types/data";

function abortableFetch(url: string, options?: RequestInit): AbortableFetch {
	const controller = new AbortController();
	const signal = controller.signal;

	return {
		abort: () => controller.abort(),
		request: fetch(url, { ...options, signal }),
	};
}

export { abortableFetch };
