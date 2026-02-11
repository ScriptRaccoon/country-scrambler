<script lang="ts">
	import { t } from '$lib/lang.svelte'
</script>

<svelte:head>
	<title>{t('title')}</title>
	<meta property="og:title" content={t('title')} />
	<meta property="og:description" content="Can you unscramble the country?" />
	<meta name="description" content="Can you unscramble the country?" />
	<meta property="og:type" content="Website" />
	<meta property="og:url" content="https://country-scrambler.netlify.app" />
	<meta property="og:site_name" content={t('title')} />
	<meta
		property="og:image"
		content="https://country-scrambler.netlify.app/preview.webp"
	/>
</svelte:head>
