<script lang="ts">
	import type { ModeType } from '$lib/types'

	let { mode = $bindable() }: { mode: ModeType } = $props()
</script>

<div>
	<label for="mode-select">Mode</label>
	<select id="mode-select" bind:value={mode} class="select">
		<option value="easy">Easy</option>
		<option value="hard">Hard</option>
	</select>
</div>

<style>
	label {
		color: var(--secondary-font-color);
	}
</style>
