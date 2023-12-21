export const subscribe = (event: string, listener: () => void) => {
	if (event && listener) {
		document.addEventListener(event, listener);
	}
};

export const unsubscribe = (event: string, listener: () => void) => {
	if (event && listener) {
		document.removeEventListener(event, listener);
	}
};

export const publishEvent = (event: string, data: object) => {
	if (event) {
		const e = new CustomEvent(event, data);
		document.dispatchEvent(e);
	}
};
