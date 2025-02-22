export function getMinNumber(arr) {
	if (arr.length === 0) return 0;

	let min = arr[0];
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] < min) min = arr[i];
	}
	return min;
}

export function getMaxNumber(arr) {
	if (arr.length === 0) return 0;

	let max = arr[0];
	for (let i = 1; i < arr.length; i++) {
		if (arr[i] > max) max = arr[i];
	}
	return max;
}
export function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
