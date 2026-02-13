<script lang="ts">
	import { fly } from 'svelte/transition'
	import { FLY_DURATION } from '$lib/constants'

	type Props = {
		country_display: string
		round: number
		highlighted_letters?: Set<number>
		visible: boolean
	}

	let { country_display, round, highlighted_letters, visible }: Props = $props()
</script>

<div class="card-wrapper" aria-live="polite">
	{#key round}
		<div
			class="country-card"
			class:hidden={!visible}
			out:fly={{ duration: FLY_DURATION, x: 200 }}
			in:fly={{ duration: FLY_DURATION, x: -200 }}
		>
			{#each [...country_display] as char, i}
				<span class:highlighted={highlighted_letters?.has(i)}>{char}</span>
			{/each}
		</div>
	{/key}
</div>

<style>
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
		max-width: calc(100vw - 2rem);
		overflow-x: auto;
		scrollbar-width: thin;
		scrollbar-color: #fffa transparent;
		transition: opacity 300ms ease;

		&.hidden {
			opacity: 0;
			pointer-events: none;
		}
	}

	span {
		transition: color 200ms ease;

		&.highlighted {
			color: var(--letter-highlight-color);
		}
	}
</style>
