<script module lang="ts">
	import { fly } from 'svelte/transition'

	type ToastState = {
		text: string
		variant: 'positive' | 'negative'
	} | null

	let toast_state = $state<ToastState>(null)

	export function open_toast(state: ToastState) {
		toast_state = state
	}

	export function clear_toast() {
		toast_state = null
	}
</script>

{#if toast_state}
	<div class="toast {toast_state.variant}" transition:fly={{ duration: 160, y: -40 }}>
		{toast_state.text}
	</div>
{/if}

<style>
	.toast {
		z-index: 10;
		position: absolute;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1.125rem;
		padding: 0.4rem 0.8rem;
		border-radius: 0.2rem;
		box-shadow: 0 0 1rem #0004;
	}

	.toast.negative {
		background-color: var(--negative-color);
	}

	.toast.positive {
		background-color: var(--positive-color);
	}
</style>
