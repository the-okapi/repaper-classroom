<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.png';
	import NavBar from '$lib/components/NavBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher darkClassNames={['dark']} lightClassNames={['light']} />

<NavBar />

{@render children()}
