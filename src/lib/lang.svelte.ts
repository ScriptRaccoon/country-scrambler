import translations from './translations.json'

const LANGS = ['de', 'en', 'es'] as const
const DEFAULT_LANG = 'en'

type Lang = (typeof LANGS)[number]

function is_lang(val: unknown): val is Lang {
	return !!val && (LANGS as readonly any[]).includes(val)
}

function get_initial_lang(): Lang {
	const browser_lang = window.navigator.language.split('-')[0]
	const saved_lang = window.localStorage.getItem('lang')

	if (is_lang(saved_lang)) {
		return saved_lang
	}

	if (is_lang(browser_lang)) {
		return browser_lang
	}

	return DEFAULT_LANG
}

export const lang = $state<{ value: Lang }>({ value: get_initial_lang() })

export function set_lang(to: Lang) {
	lang.value = to
	document.documentElement.setAttribute('lang', lang.value)
	window.localStorage.setItem('lang', lang.value)
}

set_lang(lang.value)

export function t(key: keyof typeof translations, count?: number): string {
	const txt = translations[key][lang.value]
	return count === undefined ? txt : txt.replace('{{ count }}', count.toString())
}
