export const MS_TO_HR_FACTOR: number = 2777777;

export const convertMsToHr = (ms: number) => {
	return ms / MS_TO_HR_FACTOR;
};
