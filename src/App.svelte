<script lang="ts">
	import { fade, fly } from 'svelte/transition'
	import countries from './data/countries.json'
	import { scramble_words } from './lib/utils'
	import { CircleX, CircleCheck, Info } from 'lucide-svelte'

	let current_index = $state(Math.floor(Math.random() * countries.length))
	let current_country = $derived(countries[current_index].toUpperCase())
	let current_country_scrambled = $derived(scramble_words(current_country))

	let round = $state(0)
	let show_hint = $state(false)
	let reveal_country = $state(false)
	let country_guess = $state('')
	let has_guessed = $state(false)
	let correct_guesses = $state(0)
	let incorrect_guesses = $state(0)
	let is_correct = $state<true | false | null>(null)

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
		is_correct = country_guess.toUpperCase() === current_country
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

<svelte:head>
	<title>Country Scrambler</title>
	<meta property="og:title" content="Country Scrambler" />
	<meta property="og:description" content="Can you unscramble the country?" />
	<meta name="description" content="Can you unscramble the country?" />
	<meta property="og:type" content="Website" />
	<meta property="og:url" content="https://country-scrambler.netlify.app" />
	<meta property="og:site_name" content="Country Scrambler" />
</svelte:head>

<header>
	<h1>Guess the Country</h1>
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
				aria-label="your guess"
				bind:value={country_guess}
				required
				aria-describedby="indicator"
				aria-invalid={is_correct === false}
			/>

			{#if is_correct !== null}
				<div class="indicator" id="indicator" transition:fade={{ duration: 160 }}>
					{#if is_correct}
						<CircleCheck size={24} color="var(--positive-color)" />
						<span class="sr-only">Answer is correct</span>
					{:else}
						<CircleX size={24} color="var(--negative-color)" />
						<span class="sr-only">Answer is incorrect</span>
					{/if}
				</div>
			{/if}
		</div>

		<div class="actions">
			<button>Submit</button>

			<button type="button" onclick={generate_next_country}>Skip</button>

			{#if !show_hint}
				<button type="button" onclick={() => (show_hint = true)}>Hint</button>
			{:else}
				<button type="button" onclick={() => (reveal_country = true)}>
					Reveal
				</button>
			{/if}
		</div>
	</form>

	{#if show_hint}
		<div class="hint" in:fade={{ duration: 250 }} out:fade={{ duration: 160 }}>
			{#if reveal_country}
				<Info size={20} /> <strong>Country:</strong>
				<span>{current_country}</span>
			{:else}
				<Info size={20} /> <strong>Hint:</strong>
				<span>{current_country.slice(0, 2)}...</span>
			{/if}
		</div>
	{/if}

	<section class="stats" aria-label="Statistics" aria-live="polite">
		<strong>Guesses</strong>
		<div class="stat" aria-label="{correct_guesses} guesses were correct">
			<CircleCheck size={20} color="var(--positive-color)" />
			<span aria-hidden="true">{correct_guesses}</span>
		</div>
		<div class="stat" aria-label="{incorrect_guesses} guesses were incorrect">
			<CircleX size={20} color="var(--negative-color)" />
			<span aria-hidden="true">
				{incorrect_guesses}
			</span>
		</div>
	</section>
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

	.stats {
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
