export function scramble_words(input: string): string {
	return input.split(' ').map(scramble_word_for_real).join(' ')
}

function scramble_word(input: string): string {
	let result = ''
	for (const char of input) {
		const i = Math.floor(Math.random() * (result.length + 1))
		result = result.substring(0, i) + char + result.substring(i)
	}
	return result
}

function scramble_word_for_real(input: string): string {
	if (input.length <= 1) return input
	let attempts = 0
	let output = input
	while (output === input && attempts < 10) {
		attempts++
		output = scramble_word(input)
	}
	return output
}
