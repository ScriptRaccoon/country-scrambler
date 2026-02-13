<script lang="ts">
	import { t } from '$lib/lang.svelte'
	import type { ModeType } from '$lib/types'

	let { mode = $bindable() }: { mode: ModeType } = $props()
</script>

<div>
	<label for="mode-select">
		{t('mode')}
	</label>
	<select id="mode-select" bind:value={mode} class="select">
		<option value="easy">
			{t('easy')}
		</option>
		<option value="hard">
			{t('hard')}
		</option>
	</select>
</div>

<style>
	label {
		color: var(--secondary-font-color);
	}
</style>
