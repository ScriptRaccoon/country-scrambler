<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition'
	import countries_en from './data/countries_en.json'
	import countries_de from './data/countries_de.json'
	import { scramble_words } from './lib/utils'
	import { CircleX, CircleCheck, Info } from 'lucide-svelte'
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

	let lang = $state<'de' | 'en'>(
		lang_param === 'de' || lang_param === 'en' ? lang_param : 'en',
	)

	$effect(() => {
		document.documentElement.setAttribute('lang', lang)
	})

	const country_lists = {
		en: countries_en,
		de: countries_de,
	}

	let countries = $derived(country_lists[lang])
	let current_index = $derived(Math.floor(Math.random() * countries.length))
	let current_country = $derived(countries[current_index].toUpperCase())
	let current_country_scrambled = $derived(scramble_words(current_country))

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
			setTimeout(() => {
				generate_next_country()
			}, 1200)
		} else {
			if (!has_guessed) incorrect_guesses++
			has_guessed = true
		}
	}
</script>

<nav>
	<a
		href="{window.location.origin}?lang=de"
		aria-current={lang === 'de'}
		aria-label="Deutsche Version"
	>
		<img src="de.svg" alt="Deutsche Flagge" />
	</a>
	<a
		href="{window.location.origin}?lang=en"
		aria-current={lang === 'en'}
		aria-label="English version"
	>
		<img src="gb.svg" alt="UK flag" />
	</a>
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
				{current_country_scrambled}
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
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		display: flex;
		gap: 0.5rem;

		a {
			opacity: 0.25;
			text-decoration: none;
		}

		a[aria-current='true'] {
			opacity: 1;
		}

		img {
			width: 20px;
			border-radius: 2px;
		}
	}

	header {
		padding-block: 2rem;
		padding-inline: 1rem;
	}

	.container {
		max-width: 600px;
		margin-inline: auto;
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
		width: fit-content;
		margin-inline: auto;
		background-color: var(--card-color);
		box-shadow: 0 0 1rem #0004;
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-size: 2rem;
	}

	form {
		margin-top: 1rem;
		margin-bottom: 2rem;
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
		margin-top: 1rem;
		display: flex;
		justify-content: center;
		gap: 1rem;

		@media (max-width: 500px) {
			margin-top: 1.5rem;
			flex-direction: column;
			gap: 0.5rem;
		}
	}

	.score {
		margin-top: 2rem;
		font-size: 1.125rem;
		display: flex;
		gap: 1rem;
	}

	.hint {
		background-color: var(--hint-bg-color);
		padding: 0.4rem 0.6rem;
		border-radius: 0.25rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
