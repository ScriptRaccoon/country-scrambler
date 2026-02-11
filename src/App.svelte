<script lang="ts">
	import { fade, fly, scale } from 'svelte/transition'
	import countries_en from './data/countries_en.json'
	import countries_de from './data/countries_de.json'
	import countries_es from './data/countries_es.json'
	import { scramble_text, unscramble_text } from './lib/utils'
	import { CircleX, CircleCheck, Info, Github } from 'lucide-svelte'
	import { backOut } from 'svelte/easing'
	import translations from './lib/translations.json'
	import { get_lang, save_lang_in_storage, type Lang } from './lib/lang'

	let round = $state(0)
	let show_hint = $state(false)
	let reveal_country = $state(false)
	let country_guess = $state('')
	let has_guessed = $state(false)
	let correct_guesses = $state(0)
	let incorrect_guesses = $state(0)
	let is_correct = $state<true | false | null>(null)

	const FLY_DURATION = 300

	function reset() {
		round = 0
		show_hint = false
		reveal_country = false
		country_guess = ''
		has_guessed = false
		correct_guesses = 0
		incorrect_guesses = 0
		is_correct = null
	}

	let lang = $state<Lang>(get_lang())

	$effect(() => {
		document.documentElement.setAttribute('lang', lang)
	})

	const country_lists = {
		en: countries_en,
		de: countries_de,
		es: countries_es,
	}

	function change_lang(to: Lang): void {
		lang = to
		save_lang_in_storage(lang)
		reset()
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
		document.body.classList.add('overflow-hidden')
		current_index = Math.floor(Math.random() * countries.length)
		setTimeout(() => {
			document.body.classList.remove('overflow-hidden')
		}, FLY_DURATION + 100)
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
		const steps = unscramble_text(
			current_country,
			current_country_scramble.perms,
			current_country_scramble.separator,
		)
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

<svelte:head>
	<title>{translations.title[lang]}</title>
	<meta property="og:title" content={translations.title[lang]} />
	<meta property="og:description" content="Can you unscramble the country?" />
	<meta name="description" content="Can you unscramble the country?" />
	<meta property="og:type" content="Website" />
	<meta property="og:url" content="https://country-scrambler.netlify.app" />
	<meta property="og:site_name" content={translations.title[lang]} />
	<meta
		property="og:image"
		content="https://country-scrambler.netlify.app/preview.webp"
	/>
</svelte:head>

<nav>
	<div class="container">
		<a
			href="https://github.com/ScriptRaccoon/country-scrambler/"
			target="_blank"
			aria-label="GitHub repository"
		>
			<Github size={20} />
		</a>

		<button
			class="country-button"
			aria-current={lang === 'de'}
			onclick={() => change_lang('de')}
			aria-label="Deutsche Version"
		>
			<img src="de.svg" alt="Deutsche Flagge" />
		</button>

		<button
			class="country-button"
			aria-current={lang === 'en'}
			onclick={() => change_lang('en')}
			aria-label="English version"
		>
			<img src="gb.svg" alt="UK flag" />
		</button>

		<button
			class="country-button"
			aria-current={lang === 'es'}
			onclick={() => change_lang('es')}
			aria-label="Versión española"
		>
			<img src="es.svg" alt="bandera española" />
		</button>
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
				out:fly={{ duration: FLY_DURATION, x: 200 }}
				in:fly={{ duration: FLY_DURATION, x: -200 }}
			>
				{current_country_scramble_display}
			</div>
		{/key}
	</div>

	<form onsubmit={handle_submit}>
		<div class="input-container">
			<input
				class="input"
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
						<CircleCheck size={26} color="var(--positive-color)" />
						<span class="sr-only">
							{translations.answer_is_correct[lang]}
						</span>
					{:else}
						<CircleX size={26} color="var(--negative-color)" />
						<span class="sr-only">
							{translations.answer_is_incorrect[lang]}
						</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="actions">
			<button class="button">
				{translations.submit[lang]}
			</button>

			{#if !show_hint}
				<button class="button" type="button" onclick={() => (show_hint = true)}>
					{translations.hint[lang]}
				</button>
			{:else}
				<button
					class="button"
					type="button"
					onclick={() => (reveal_country = true)}
				>
					{translations.reveal[lang]}
				</button>
			{/if}

			<button class="button" type="button" onclick={generate_next_country}>
				{translations.skip[lang]}
			</button>
		</div>
	</form>

	<div aria-live="polite">
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
	</div>

	<section class="score" aria-labelledby="score-label" aria-live="polite">
		<strong id="score-label">
			{translations.score[lang]}
		</strong>
		<div>
			<CircleCheck size={20} color="var(--positive-color)" />
			<span aria-hidden="true">{correct_guesses}</span>
			<span class="sr-only">
				{translations.answers_correct[lang].replace(
					'{{ count }}',
					String(correct_guesses),
				)}
			</span>
		</div>
		<div>
			<CircleX size={20} color="var(--negative-color)" />
			<span aria-hidden="true">{incorrect_guesses}</span>
			<span class="sr-only">
				{translations.answers_incorrect[lang].replace(
					'{{ count }}',
					String(incorrect_guesses),
				)}
			</span>
		</div>
	</section>
</main>

<style>
	nav {
		padding-block: 0.75rem 0.5rem;
		color: var(--secondary-font-color);

		.container {
			display: flex;
			gap: 0.5rem;
		}
	}

	nav a {
		text-decoration: none;
		margin-right: auto;
	}

	.country-button {
		display: flex;
		align-items: center;

		opacity: 0.25;
		&[aria-current='true'] {
			opacity: 1;
		}

		img {
			width: 20px;
			border-radius: 2px;
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
		display: flex;
		align-items: center;
	}

	.actions {
		margin-top: 0.75rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 420px) {
			gap: 0.5rem;

			button {
				font-size: 1rem;
			}
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
