<script lang="ts">
	import { fade } from 'svelte/transition'
	import { t } from '$lib/lang.svelte'
	import { Info } from 'lucide-svelte'

	type Props = {
		hint_is_shown: boolean
		country_is_revealed: boolean
		current_country: string
	}
	let { hint_is_shown, country_is_revealed, current_country }: Props = $props()
</script>

<div aria-live="polite">
	{#if hint_is_shown}
		<div class="hint" in:fade={{ duration: 250 }} out:fade={{ duration: 160 }}>
			{#if country_is_revealed}
				<Info size={20} /> <strong>{t('country')}:</strong>
				<span>{current_country}</span>
			{:else}
				<Info size={20} /> <strong>{t('hint')}:</strong>
				<span>{current_country.slice(0, 2)}...</span>
			{/if}
		</div>
	{/if}
</div>

<style>
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
