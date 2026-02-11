// @ts-check

import { readFile } from 'node:fs/promises'

async function check_countries() {
	console.info('Check if country lists have identical lengths...')

	const file_url_en = new URL('../src/lib/data/countries_en.json', import.meta.url)
	const countries_en = JSON.parse(await readFile(file_url_en, 'utf-8'))

	const file_url_de = new URL('../src/lib/data/countries_de.json', import.meta.url)
	const countries_de = JSON.parse(await readFile(file_url_de, 'utf-8'))

	const file_url_es = new URL('../src/lib/data/countries_es.json', import.meta.url)
	const countries_es = JSON.parse(await readFile(file_url_es, 'utf-8'))

	const lengths = {
		en: countries_en.length,
		de: countries_de.length,
		es: countries_es.length,
	}

	if (lengths.en === lengths.de && lengths.en === lengths.es) {
		console.info('Done ✅')
	} else {
		throw new Error(
			`Country lists have different lengths: EN=${lengths.en}, DE=${lengths.de}, ES=${lengths.es}`,
		)
	}
}

check_countries()
