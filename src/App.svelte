<script lang="ts">
	import { COUNTRY_COUNT, country_lists } from '$lib/countries'
	import { scramble_text, unscramble_text } from '$lib/scrambling'
	import { FLY_DURATION } from '$lib/constants'
	import MetaTags from '$lib/components/MetaTags.svelte'
	import Nav from '$lib/components/Nav.svelte'
	import Score from '$lib/components/Score.svelte'
	import Header from '$lib/components/Header.svelte'
	import CountryCard from '$lib/components/CountryCard.svelte'
	import Actions from '$lib/components/Actions.svelte'
	import Hint from '$lib/components/Hint.svelte'
	import CountryInput from '$lib/components/CountryInput.svelte'
	import { lang } from '$lib/lang.svelte'

	let round = $state(0)
	let answer = $state('')
	let answer_is_correct = $state<boolean | null>(null)
	let correct_answers = $state(0)
	let incorrect_answers = $state(0)

	let hint_is_shown = $state(false)
	let country_is_revealed = $state(false)
	let user_has_answered = $state(false)

	let countries = $derived(country_lists[lang.value])
	let current_index = $state(Math.floor(Math.random() * COUNTRY_COUNT))
	let current_country = $derived(countries[current_index].toUpperCase())
	let country_scramble = $derived(scramble_text(current_country))
	let country_display = $derived(country_scramble.scrambled)

	function reset() {
		round = 0
		answer = ''
		answer_is_correct = null
		correct_answers = 0
		incorrect_answers = 0
		hint_is_shown = false
		country_is_revealed = false
		user_has_answered = false
		current_index = Math.floor(Math.random() * COUNTRY_COUNT)
	}

	function generate_next_country() {
		round++
		answer = ''
		answer_is_correct = null
		hint_is_shown = false
		country_is_revealed = false
		user_has_answered = false
		document.body.classList.add('overflow-hidden')
		current_index = Math.floor(Math.random() * COUNTRY_COUNT)
		setTimeout(() => {
			document.body.classList.remove('overflow-hidden')
		}, FLY_DURATION + 100)
	}

	function handle_submit(e: Event) {
		e.preventDefault()

		answer_is_correct = answer.trim().toUpperCase() === current_country

		if (answer_is_correct) {
			if (!user_has_answered && !country_is_revealed) {
				correct_answers += hint_is_shown ? 0.5 : 1
			}
			user_has_answered = true

			play_unscramble_animation(() => {
				setTimeout(() => {
					generate_next_country()
				}, 1000)
			})
		} else {
			if (!user_has_answered) incorrect_answers++
			user_has_answered = true
		}
	}

	function play_unscramble_animation(callback: () => void) {
		const steps = unscramble_text(
			current_country,
			country_scramble.perms,
			country_scramble.separator,
		)

		function show_step(i: number) {
			if (i === steps.length) {
				callback()
				return
			}
			country_display = steps[i]
			setTimeout(() => {
				show_step(i + 1)
			}, 70)
		}

		show_step(0)
	}
</script>

<MetaTags />

<Nav update_lang={reset} />

<Header />

<main class="container">
	<CountryCard {country_display} {round} />

	<form onsubmit={handle_submit}>
		<CountryInput {answer_is_correct} bind:answer />

		<Actions
			{hint_is_shown}
			show_hint={() => (hint_is_shown = true)}
			reveal_country={() => (country_is_revealed = true)}
			skip={generate_next_country}
		/>
	</form>

	<Hint {hint_is_shown} {country_is_revealed} {current_country} />

	<Score {correct_answers} {incorrect_answers} />
</main>

<style>
	form {
		margin-block: 1.5rem;
		position: relative;
	}
</style>
