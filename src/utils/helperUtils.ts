export const MS_TO_HR_FACTOR: number = 2777777;

export function convertMsToHr(ms: number) {
	return ms / MS_TO_HR_FACTOR;
}

export function getKeyByValue(value: string, e: object) {
	for (const key in e) {
		if (e[key as keyof typeof e] === value) {
			return key;
		}
	}
}
