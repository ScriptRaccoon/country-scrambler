<script lang="ts">
	import { fly } from 'svelte/transition'
	import { FLY_DURATION } from '$lib/constants'

	type Props = {
		country_display: string
		round: number
	}

	let { country_display, round }: Props = $props()
</script>

<div class="card-wrapper" aria-live="polite">
	{#key round}
		<div
			class="country-card"
			out:fly={{ duration: FLY_DURATION, x: 200 }}
			in:fly={{ duration: FLY_DURATION, x: -200 }}
		>
			{country_display}
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
	}
</style>
