<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition'
	import countries_en from './data/countries_en.json'
	import countries_de from './data/countries_de.json'
	import countries_es from './data/countries_es.json'
	import { scramble_text, unscramble_text } from './lib/utils'
	import { CircleX, CircleCheck, Info, Github } from 'lucide-svelte'
	import { backOut } from 'svelte/easing'
	import translations from './lib/translations.json'

	let round = $state(0)
	let show_hint = $state(false)
	let reveal_country = $state(false)
	let country_guess = $state('')
	let has_guessed = $state(false)
	let correct_guesses = $state(0)
	let incorrect_guesses = $state(0)
	let is_correct = $state<true | false | null>(null)

	const params = new URLSearchParams(window.location.search)
	const lang_param = params.get('lang')

	const LANGS = ['de', 'en', 'es'] as const
	type Lang = (typeof LANGS)[number]

	function is_lang(val: unknown): val is Lang {
		return (LANGS as readonly any[]).includes(val)
	}

	let lang = $state<Lang>(is_lang(lang_param) ? lang_param : 'en')

	$effect(() => {
		document.documentElement.setAttribute('lang', lang)
	})

	const country_lists = {
		en: countries_en,
		de: countries_de,
		es: countries_es,
	}

	let countries = $derived(country_lists[lang])
	let current_index = $derived(Math.floor(Math.random() * countries.length))
	let current_country = $derived(countries[current_index].toUpperCase())
	let current_country_scramble = $derived(scramble_text(current_country))
	let current_country_scramble_display = $derived(current_country_scramble.scrambled)

	function generate_next_country() {
		round++
		is_correct = null
		show_hint = false
		reveal_country = false
		has_guessed = false
		country_guess = ''
		current_index = Math.floor(Math.random() * countries.length)
	}

	function handle_submit(e: Event) {
		e.preventDefault()

		is_correct = country_guess.trim().toUpperCase() === current_country

		if (is_correct) {
			if (!has_guessed && !reveal_country) {
				correct_guesses += show_hint ? 0.5 : 1
			}
			has_guessed = true

			play_unscramble_animation(() => {
				setTimeout(() => {
					generate_next_country()
				}, 1000)
			})
		} else {
			if (!has_guessed) incorrect_guesses++
			has_guessed = true
		}
	}

	function play_unscramble_animation(callback: () => void) {
		const steps = unscramble_text(current_country, current_country_scramble.perms)
		function next(i: number) {
			if (i === steps.length) {
				callback()
				return
			}
			current_country_scramble_display = steps[i]
			setTimeout(() => {
				next(i + 1)
			}, 70)
		}
		next(0)
	}
</script>

<nav>
	<div class="container">
		<a
			href="https://github.com/ScriptRaccoon/country-scrambler/"
			target="_blank"
			aria-label="GitHub repository"
		>
			<Github size={20} />
		</a>
		<a
			href="{window.location.origin}?lang=de"
			aria-current={lang === 'de'}
			aria-label="Deutsche Version"
			class="country-link"
		>
			<img src="de.svg" alt="Deutsche Flagge" />
		</a>
		<a
			href="{window.location.origin}?lang=es"
			aria-current={lang === 'es'}
			aria-label="Versión española"
			class="country-link"
		>
			<img src="es.svg" alt="bandera española" />
		</a>
		<a
			href="{window.location.origin}?lang=en"
			aria-current={lang === 'en'}
			aria-label="English version"
			class="country-link"
		>
			<img src="gb.svg" alt="UK flag" />
		</a>
	</div>
</nav>

<header>
	<h1>{translations.heading[lang]}</h1>
</header>

<main class="container">
	<div class="card-wrapper" aria-live="polite">
		{#key round}
			<div
				class="country-card"
				out:fly={{ duration: 300, x: 200 }}
				in:fly={{ duration: 300, x: -200 }}
			>
				{current_country_scramble_display}
			</div>
		{/key}
	</div>

	<form onsubmit={handle_submit}>
		<div class="input-container">
			<input
				type="text"
				id="country"
				aria-label={translations.your_answer[lang]}
				bind:value={country_guess}
				required
				aria-describedby="indicator"
				aria-invalid={is_correct === false}
				title=""
			/>

			{#if is_correct !== null}
				<div
					class="indicator"
					id="indicator"
					in:scale={{ duration: 200, easing: backOut }}
					out:fade={{ duration: 200 }}
				>
					{#if is_correct}
						<CircleCheck size={24} color="var(--positive-color)" />
						<span class="sr-only">
							{translations.answer_is_correct[lang]}
						</span>
					{:else}
						<CircleX size={24} color="var(--negative-color)" />
						<span class="sr-only">
							{translations.answer_is_incorrect[lang]}
						</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="actions">
			<button>
				{translations.submit[lang]}
			</button>

			<button type="button" onclick={generate_next_country}>
				{translations.skip[lang]}
			</button>

			{#if !show_hint}
				<button type="button" onclick={() => (show_hint = true)}>
					{translations.hint[lang]}
				</button>
			{:else}
				<button type="button" onclick={() => (reveal_country = true)}>
					{translations.reveal[lang]}
				</button>
			{/if}
		</div>
	</form>

	{#if show_hint}
		<div class="hint" in:fade={{ duration: 250 }} out:fade={{ duration: 160 }}>
			{#if reveal_country}
				<Info size={20} /> <strong>{translations.country[lang]}:</strong>
				<span>{current_country}</span>
			{:else}
				<Info size={20} /> <strong>{translations.hint[lang]}:</strong>
				<span>{current_country.slice(0, 2)}...</span>
			{/if}
		</div>
	{/if}

	<section class="score" aria-labelledby="score-label" aria-live="polite">
		<strong id="score-label">
			{translations.score[lang]}
		</strong>
		<div
			aria-label={translations.answers_correct[lang].replace(
				'{{ count }}',
				String(correct_guesses),
			)}
		>
			<CircleCheck size={20} color="var(--positive-color)" />
			<span aria-hidden="true">{correct_guesses}</span>
		</div>
		<div
			aria-label={translations.answers_incorrect[lang].replace(
				'{{ count }}',
				String(incorrect_guesses),
			)}
		>
			<CircleX size={20} color="var(--negative-color)" />
			<span aria-hidden="true">
				{incorrect_guesses}
			</span>
		</div>
	</section>
</main>

<style>
	nav {
		padding-block: 0.5rem;
		color: var(--secondary-font-color);

		.container {
			display: flex;
			gap: 0.5rem;
		}

		a {
			text-decoration: none;

			&:first-child {
				margin-right: auto;
			}
		}
	}

	.country-link {
		img {
			width: 20px;
			border-radius: 2px;
		}

		opacity: 0.25;

		&[aria-current='true'] {
			opacity: 1;
		}
	}

	header {
		padding-bottom: 1.5rem;
		padding-inline: 1rem;
	}

	.card-wrapper {
		display: grid;

		> * {
			grid-row: 1;
			grid-column: 1;
		}
	}

	.country-card {
		margin-inline: auto;
		background-color: var(--card-color);
		box-shadow: 0 0 1rem #0004;
		padding: 0.4rem 1.5rem;
		border-radius: 0.25rem;
		font-size: 2rem;
	}

	form {
		margin-block: 1.5rem;
		position: relative;
	}

	.input-container {
		position: relative;
	}

	.indicator {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
	}

	.actions {
		margin-top: 0.5rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 420px) {
			gap: 0.5rem;
		}
	}

	.score {
		font-size: 1.125rem;
		color: var(--secondary-font-color);
		display: flex;
		gap: 1rem;
	}

	.hint {
		margin-block: 1rem;
		background-color: var(--hint-bg-color);
		padding: 0.4rem 0.6rem;
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
