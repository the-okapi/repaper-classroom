<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/favicon.png';
	import { NavBar } from '$lib/components';
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

<ModeWatcher darkClassNames={['dark']} lightClassNames={['light']} />

<NavBar {loggedIn} />

<main class="transition-colors bg-(--bg)">
	{@render children()}
</main>
