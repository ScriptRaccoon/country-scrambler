<script lang="ts">
	import { fade, scale } from 'svelte/transition'
	import { t } from '$lib/lang.svelte'
	import { backOut } from 'svelte/easing'
	import { CircleCheck, CircleX } from 'lucide-svelte'

	type Props = {
		answer_is_correct: boolean | null
		answer: string
	}

	let { answer_is_correct, answer = $bindable() }: Props = $props()
</script>

<div class="input-container">
	<input
		class="input"
		type="text"
		name="answer"
		aria-label={t('your_answer')}
		required
		aria-describedby="indicator"
		aria-invalid={answer_is_correct === false}
		title=""
		bind:value={answer}
	/>

	{#if answer_is_correct !== null}
		<div
			class="indicator"
			id="indicator"
			in:scale={{ duration: 200, easing: backOut }}
			out:fade={{ duration: 200 }}
		>
			{#if answer_is_correct}
				<CircleCheck size={26} color="var(--positive-color)" />
				<span class="sr-only">
					{t('answer_is_correct')}
				</span>
			{:else}
				<CircleX size={26} color="var(--negative-color)" />
				<span class="sr-only">
					{t('answer_is_incorrect')}
				</span>
			{/if}
		</div>
	{/if}
</div>

<style>
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
</style>
