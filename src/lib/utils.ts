export function scramble_words(input: string): string {
	return input.split(' ').map(scramble_word).join(' ')
}

function scramble_word(input: string): string {
	let result = ''
	for (const char of input) {
		const i = Math.floor(Math.random() * (result.length + 1))
		result = result.substring(0, i) + char + result.substring(i)
	}
	return result
}
