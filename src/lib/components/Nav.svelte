<script lang="ts">
	import { Github } from 'lucide-svelte'
	import { lang, set_lang } from '$lib/lang.svelte'

	let { update_lang }: { update_lang: () => void } = $props()
</script>

<nav>
	<div class="container">
		<a
			href="https://github.com/ScriptRaccoon/country-scrambler/"
			target="_blank"
			aria-label="GitHub repository"
		>
			<Github size={20} />
		</a>

		<button
			class="country-button"
			aria-current={lang.value === 'de'}
			onclick={() => {
				set_lang('de')
				update_lang()
			}}
			aria-label="Deutsche Version"
		>
			<img src="flags/de.svg" alt="Deutsche Flagge" />
		</button>

		<button
			class="country-button"
			aria-current={lang.value === 'en'}
			onclick={() => {
				set_lang('en')
				update_lang()
			}}
			aria-label="English version"
		>
			<img src="flags/gb.svg" alt="UK flag" />
		</button>

		<button
			class="country-button"
			aria-current={lang.value === 'es'}
			onclick={() => {
				set_lang('es')
				update_lang()
			}}
			aria-label="Versión española"
		>
			<img src="flags/es.svg" alt="bandera española" />
		</button>
	</div>
</nav>

<style>
	nav {
		padding-block: 0.75rem 0.5rem;
		color: var(--secondary-font-color);

		.container {
			display: flex;
			gap: 0.5rem;
		}
	}

	a {
		text-decoration: none;
		margin-right: auto;
	}

	.country-button {
		display: flex;
		align-items: center;

		opacity: 0.25;
		transition: opacity 200ms ease;

		&[aria-current='true'] {
			opacity: 1;
		}

		img {
			width: 20px;
			border-radius: 2px;
		}
	}
</style>
