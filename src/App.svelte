<script lang="ts">
	import { fly } from 'svelte/transition'
	import countries from './data/countries.json'
	import { scramble_words } from './lib/utils'

	let current_index = $state(Math.floor(Math.random() * countries.length))
	let current_country = $derived(countries[current_index].toUpperCase())
	let current_country_scrambled = $derived(scramble_words(current_country))

	let country_guess = $state('')

	let message = $state('')
	let error = $state('')

	function generate_next_country() {
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
			message = 'Correct! 🎉'
			setTimeout(() => {
				generate_next_country()
			}, 1200)
		} else {
			error = 'Incorrect'
		}
	}

	function show_hint() {
		error = ''
		message = current_country.substring(0, 2).toUpperCase() + '...'
	}
</script>

<header>
	<h1>Guess the Country</h1>
</header>

<main>
	<div class="country-card" aria-live="polite">
		{current_country_scrambled}
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

			<button type="button" onclick={show_hint}>Hint</button>
		</div>
	</form>

	{#if error}
		<p class="error" in:fly={{ duration: 200, y: -40 }}>{error}</p>
	{/if}

	{#if message}
		<p class="message" in:fly={{ duration: 200, y: -40 }}>{message}</p>
	{/if}
</main>

<style>
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
</style>
