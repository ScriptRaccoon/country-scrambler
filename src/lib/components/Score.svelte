<script lang="ts">
	import { CircleCheck, CircleX } from 'lucide-svelte'
	import { t } from '$lib/lang.svelte'

	type Props = {
		correct_answers: number
		incorrect_answers: number
	}

	let { correct_answers, incorrect_answers }: Props = $props()
</script>

<section aria-labelledby="score-label" aria-live="polite">
	<strong id="score-label">
		{t('score')}
	</strong>
	<div>
		<CircleCheck size={20} color="var(--positive-color)" />
		<span aria-hidden="true">{correct_answers}</span>
		<span class="sr-only">
			{t('answers_correct', correct_answers)}
		</span>
	</div>
	<div>
		<CircleX size={20} color="var(--negative-color)" />
		<span aria-hidden="true">{incorrect_answers}</span>
		<span class="sr-only">
			{t('answers_incorrect', incorrect_answers)}
		</span>
	</div>
</section>

<style>
	section {
		font-size: 1.125rem;
		color: var(--secondary-font-color);
		display: flex;
		gap: 1rem;
	}
</style>
