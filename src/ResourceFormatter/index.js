export default number => {
	let formatted = number
	const formatter = { format: n => Number(n.toFixed(0)).toLocaleString() }
	if (number < 10000) {
		formatted = formatter.format(number) + ''
	} else if (number >= 10000 && number < 10000000) {
		formatted = formatter.format(number / 1000) + 'K'
	} else if (number >= 10000000 && number < 10000000000) {
		formatted = formatter.format(number / 1000000) + 'M'
	} else if (number >= 10000000000 && number < 10000000000000) {
		formatted = formatter.format(number / 1000000000) + 'B'
	} else if (number >= 10000000000000) {
		formatted = formatter.format(number / 1000000000000) + 'T'
	}
	return formatted
}
