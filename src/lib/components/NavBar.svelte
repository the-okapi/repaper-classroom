<script lang="ts">
	import { Button } from 'bits-ui';
	import { lS, lang } from '$lib/lang.svelte';
	import { page } from '$app/state';
	import { Book, Settings } from '$lib/components';

	let shown = $state(false);
	let settings = $state(false);

	function getTitle(route: string) {
		switch (route) {
			case '/':
				return lang(lS, 'Repaper Classroom', 'Salle de Classe de Repaper');
			case '/settings':
				return lang(lS, 'Settings', 'Paramètres');
		}
	}

	function show() {
		shown = !shown;
		if (!shown) {
			settings = false;
		}
	}
</script>

<nav>
	<Button.Root
		class="z-40 fixed bg-(--bg) top-5 left-5 p-1.5 border border-(--o) rounded-xl cursor-pointer"
		onclick={show}
	>
		<Book class="size-6 fill-(--fg)" />
	</Button.Root>
	{#if shown}
		<div class="z-40 fixed top-5 left-17 py-1.5 px-3 border border-(--o) rounded-xl bg-(--bg)">
			<Button.Root class="a" href="/">{lang(lS, 'Home', 'Accueil')}</Button.Root>
			<Button.Root class="a cursor-pointer" onclick={() => (settings = !settings)}
				>{lang(lS, 'Settings', 'Paramètres')}</Button.Root
			>
		</div>
	{/if}
	<h1 class="fixed top-5 text-4xl font-bold text-center w-screen">{getTitle(page.url.pathname)}</h1>
</nav>

{#if settings}
	<Settings class="fixed z-50 top-18 left-17" />
{/if}
