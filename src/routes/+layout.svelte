<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.png';
	import { NavBar, Background } from '$lib/components';
	import { onMount } from 'svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let loggedIn = $state(false);

	onMount(() => {
		if (data.claims) {
			loggedIn = true;
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Background class="fixed top-0 left-0 z-0" />

<ModeWatcher
	darkClassNames={['dark']}
	lightClassNames={['light']}
	defaultTheme="georgia"
	defaultMode="light"
/>

<div class="nav-bar">
	<NavBar {loggedIn} />
</div>
<main class="bg-(--bg) transition-colors">
	{@render children()}
</main>
