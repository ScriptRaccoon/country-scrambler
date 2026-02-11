const LANGS = ['de', 'en', 'es'] as const
const DEFAULT_LANG = 'en'

export type Lang = (typeof LANGS)[number]

function is_lang(val: unknown): val is Lang {
	return !!val && (LANGS as readonly any[]).includes(val)
}

export function get_lang(): Lang {
	const browser_lang = window.navigator.language.split('-')[0]
	const saved_lang = window.localStorage.getItem('lang')

	if (is_lang(saved_lang)) {
		return saved_lang
	}

	if (is_lang(browser_lang)) {
		save_lang_in_storage(browser_lang)
		return browser_lang
	}

	save_lang_in_storage(DEFAULT_LANG)
	return DEFAULT_LANG
}

export function save_lang_in_storage(lang: Lang) {
	window.localStorage.setItem('lang', lang)
}
