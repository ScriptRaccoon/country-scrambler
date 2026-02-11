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

	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Country Scrambler" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>
