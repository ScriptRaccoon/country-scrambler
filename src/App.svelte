<script lang="ts">
	import { fly } from 'svelte/transition'
	import countries from './data/countries.json'
	import { scramble_words } from './lib/utils'
	import Toast, { clear_toast, open_toast } from './lib/components/Toast.svelte'

	let current_index = $state(Math.floor(Math.random() * countries.length))
	let current_country = $derived(countries[current_index].toUpperCase())
	let current_country_scrambled = $derived(scramble_words(current_country))

	let round = $state(0)
	let has_shown_hint = $state(false)
	let country_guess = $state('')
	let correct_guesses = $state(0)
	let incorrect_guesses = $state(0)

	function generate_next_country() {
		has_shown_hint = false
		round++
		clear_toast()
		country_guess = ''
		current_country = ''
		current_index = Math.floor(Math.random() * countries.length)
	}

	function handle_submit(e: Event) {
		e.preventDefault()
		clear_toast()
		const is_correct = country_guess.toUpperCase() === current_country
		if (is_correct) {
			correct_guesses++
			open_toast({
				text: 'Correct! 🎉',
				variant: 'positive',
			})
			setTimeout(() => {
				generate_next_country()
			}, 1200)
		} else {
			incorrect_guesses++
			open_toast({
				text: 'Incorrect',
				variant: 'negative',
			})
		}
	}

	function show_hint() {
		if (has_shown_hint) return
		has_shown_hint = true
		open_toast({
			text: current_country.substring(0, 2).toUpperCase() + '...',
			variant: 'positive',
		})
	}

	function reveal() {
		open_toast({
			text: current_country,
			variant: 'positive',
		})
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
</main>

<Toast />

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

	.stats {
		color: var(--secondary-font-color);
		margin-bottom: 2rem;
	}
</style>
