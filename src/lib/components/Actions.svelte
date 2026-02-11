<script lang="ts">
	import { t } from '$lib/lang.svelte'

	type Props = {
		hint_is_shown: boolean
		show_hint: () => void
		reveal_country: () => void
		skip: () => void
	}

	let { hint_is_shown, show_hint, reveal_country, skip }: Props = $props()
</script>

<menu>
	<button class="button">
		{t('submit')}
	</button>

	{#if !hint_is_shown}
		<button class="button" type="button" onclick={show_hint}>
			{t('hint')}
		</button>
	{:else}
		<button class="button" type="button" onclick={reveal_country}>
			{t('reveal')}
		</button>
	{/if}

	<button class="button" type="button" onclick={skip}>
		{t('skip')}
	</button>
</menu>

<style>
	menu {
		margin-top: 0.75rem;
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(3, 1fr);

		@media (max-width: 420px) {
			gap: 0.5rem;

			button {
				font-size: 1rem;
			}
		}
	}
</style>
