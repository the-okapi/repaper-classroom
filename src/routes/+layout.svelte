<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.png';
	import { NavBar } from '$lib/components';
	import { onMount } from 'svelte';
	import { lS } from '$lib/lang.svelte';

	let { children } = $props();

	onMount(() => {
		const lang = localStorage.getItem('classroom-lang');
		console.log(lang);
		if (lang === 'en') {
			lS.lang = 'en';
		} else if (lang === 'fr') {
			lS.lang = 'fr';
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher darkClassNames={['dark']} lightClassNames={['light']} />

<NavBar />

<main>
	{@render children()}
</main>
