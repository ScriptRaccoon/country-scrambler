<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import countries from './data/countries.json'
	import { scramble_words } from './lib/utils'

	let current_index = $state(Math.floor(Math.random() * countries.length))
	let current_country = $derived(countries[current_index].toUpperCase())
	let current_country_scrambled = $derived(scramble_words(current_country))

	let round = $state(0)
	let has_shown_hint = $state(false)
	let country_guess = $state('')
	let message = $state('')
	let error = $state('')
	let correct_guesses = $state(0)
	let incorrect_guesses = $state(0)

	function generate_next_country() {
		has_shown_hint = false
		round++
		message = ''
		error = ''
		country_guess = ''
		current_country = ''
		current_index = Math.floor(Math.random() * countries.length)
	}

	function handle_submit(e: Event) {
		e.preventDefault()
		message = ''
		error = ''
		const is_correct = country_guess.toUpperCase() === current_country
		if (is_correct) {
			correct_guesses++
			message = 'Correct! 🎉'
			setTimeout(() => {
				generate_next_country()
			}, 1200)
		} else {
			incorrect_guesses++
			error = 'Incorrect'
		}
	}

	function show_hint() {
		if (has_shown_hint) return
		has_shown_hint = true
		error = ''
		message = current_country.substring(0, 2).toUpperCase() + '...'
	}

	function reveal() {
		error = ''
		message = current_country
	}
</script>

<header>
	<h1>Guess the Country</h1>
</header>

<main class="container">
	<div class="stats">
		<div>Correct guesses: {correct_guesses}</div>
		<div>Incorrect guesses: {incorrect_guesses}</div>
	</div>

	<div class="card-wrapper">
		{#key round}
			<div
				class="country-card"
				aria-live="polite"
				out:fly={{ duration: 300, x: 200 }}
				in:fly={{ duration: 300, x: -200 }}
			>
				{current_country_scrambled}
			</div>
		{/key}
	</div>

	<form onsubmit={handle_submit}>
		<input
			type="text"
			id="country"
			aria-label="your guess"
			bind:value={country_guess}
		/>

		<div class="actions">
			<button>Submit</button>

			<button type="button" onclick={generate_next_country}> Skip </button>

			{#if has_shown_hint}
				<button type="button" onclick={reveal}>Reveal</button>
			{:else}
				<button type="button" onclick={show_hint}>Hint</button>
			{/if}
		</div>
	</form>

	<div class="message-wrapper">
		{#if error}
			<p
				class="error"
				in:fly={{ duration: 160, y: -40 }}
				out:fade={{ duration: 160 }}
			>
				{error}
			</p>
		{/if}

		{#if message}
			<p
				class="message"
				in:fly={{ duration: 160, y: -40 }}
				out:fade={{ duration: 160 }}
			>
				{message}
			</p>
		{/if}
	</div>
</main>

<style>
	header {
		padding-block: 2rem;
		padding-inline: 1rem;
	}

	.container {
		max-width: 600px;
		margin-inline: auto;
		padding-inline: 1rem;
	}

	.card-wrapper,
	.message-wrapper {
		display: grid;

		> * {
			grid-row: 1;
			grid-column: 1;
		}
	}

	.country-card {
		width: fit-content;
		margin-inline: auto;
		background-color: var(--positive-color);
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
		font-size: 2rem;
	}

	form {
		margin-top: 1rem;
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

	.error,
	.message {
		font-size: 1.125rem;
		width: fit-content;
		margin-inline: auto;
		padding: 0.4rem 0.8rem;
		border-radius: 0.2rem;
	}

	.error {
		background-color: var(--negative-color);
	}

	.message {
		background-color: var(--positive-color);
	}

	.stats {
		color: var(--secondary-font-color);
		margin-bottom: 2rem;
	}
</style>
