export function scramble_text(input: string): {
	scrambled: string
	perms: number[][]
	separator: string
} {
	const separator = input.includes('-') ? '-' : ' '
	const words = input.split(separator)
	const scrambled_words = words.map(scramble_word)
	const scrambled = scrambled_words.map((w) => w.scramble).join(separator)
	const perms = scrambled_words.map((w) => w.perm)
	return { scrambled, perms, separator }
}

function scramble_word(word: string): { scramble: string; perm: number[] } {
	const perm = generate_random_non_identity_permutation(word.length)
	const scramble = transform_word(word, perm)
	return { scramble, perm }
}

function generate_random_permutation(n: number): number[] {
	const allowed = new Set<number>(Array.from({ length: n }, (_, i) => i))
	const perm: number[] = []

	while (allowed.size > 0) {
		const i = Math.floor(Math.random() * allowed.size)
		const el = Array.from(allowed)[i]
		perm.push(el)
		allowed.delete(el)
	}

	return perm
}

function generate_random_non_identity_permutation(n: number) {
	let perm = generate_random_permutation(n)
	if (n <= 1) return perm

	while (perm.every((val, ind) => val === ind)) {
		perm = generate_random_permutation(n)
	}

	return perm
}

function transform_word(word: string, perm: number[]): string {
	return Array.from({ length: word.length }, (_, i) => word[perm[i]]).join('')
}

function compose_with_swap(perm: number[], swap: [number, number]): number[] {
	const [i, j] = swap
	const comp = [...perm]
	comp[perm.indexOf(i)] = j
	comp[perm.indexOf(j)] = i
	return comp
}

function decompose_into_swaps(perm: number[]): [number, number][] {
	const i = perm.findIndex((val, i) => val != i)
	if (i < 0) return []
	const j = perm[i]
	const comp = compose_with_swap(perm, [i, j])
	const swaps = decompose_into_swaps(comp)
	return [...swaps, [i, j]]
}

function unscramble_word(word: string, perm: number[]): string[] {
	const swaps = decompose_into_swaps(perm)
	let comp = Array.from({ length: word.length }, (_, i) => i)
	const result: string[] = [word]
	for (const swap of swaps) {
		comp = compose_with_swap(comp, swap)
		result.push(transform_word(word, comp))
	}
	result.reverse()
	return result
}

export function unscramble_text(
	input: string,
	perms: number[][],
	separator: string,
): string[] {
	const words = input.split(separator)
	const unscramblings = words.map((w, i) => unscramble_word(w, perms[i]))

	const result: string[] = []

	let word_index = 0
	let swap_index = 0

	while (word_index < words.length) {
		const word = [
			...words.slice(0, word_index),
			unscramblings[word_index][swap_index],
			...unscramblings.slice(word_index + 1).map((l) => l[0]),
		].join(separator)

		result.push(word)

		swap_index++
		if (swap_index >= unscramblings[word_index].length) {
			swap_index = 0
			word_index++
		}
	}

	return result
}
