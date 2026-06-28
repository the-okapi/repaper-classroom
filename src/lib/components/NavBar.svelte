<script lang="ts">
	import { lS, lang } from '$lib/lang.svelte';
	import { page } from '$app/state';
	import { Settings, Login } from '$lib/components';
	import { slide } from 'svelte/transition';

	let { loggedIn } = $props();

	let shown = $state(false);
	let settings = $state(false);
	let login = $state(false);

	function showSettings() {
		login = false;
		settings = !settings;
	}

	function showLogin() {
		settings = false;
		login = !login;
	}

	function getTitle(route: string) {
		switch (route) {
			case '/':
				return lang(lS, 'Repaper Classroom', 'Salle de Classe de Repaper');
			case '/create':
				return lang(lS, 'Create', 'Créer');
			case '/home':
				return lang(lS, 'Home', 'Accueil');
		}
	}

	function show() {
		shown = !shown;
		if (!shown) {
			settings = false;
			login = false;
		}
	}

	async function logOut() {
		if (
			confirm(
				lang(
					lS,
					'Are you sure you would like to log out?',
					'Êtes-vous sûr que vous voulez vous déconnecter?'
				)
			)
		) {
			await fetch('/api/signout', {
				method: 'POST'
			});
			window.location.reload();
		}
	}

	function link() {
		shown = false;
	}
</script>

<button
	class="z-50 fixed bg-(--bg) top-5 left-5 w-10 h-10 outline outline-(--o) font-[TimesNewRoman] font-black text-2xl rounded-lg cursor-pointer"
	onclick={show}
>
	R
</button>
{#if shown}
	<div
		in:slide={{ axis: 'x' }}
		out:slide={{ axis: 'x' }}
		class="flex z-40 fixed h-10 top-5 left-17 py-1.5 px-3 outline outline-(--o) rounded-xl bg-(--bg)"
	>
		{#if loggedIn}
			<a class="mx-2 h-fit m-auto hover:underline" href="/home" onclick={link}
				>{lang(lS, 'Home', 'Accueil')}</a
			>
			<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={logOut}>
				{lang(lS, 'Log Out', 'Se Déconnecter')}
			</button>
		{:else}
			<a class="mx-2 h-fit m-auto hover:underline" href="/" onclick={link}
				>{lang(lS, 'Home', 'Accueil')}</a
			>
			<a class="mx-2 h-fit m-auto hover:underline" href="/create" onclick={link}
				>{lang(lS, 'Create', 'Créer')}</a
			>
			<div class="cardButton h-fit m-auto {login ? 'z-50' : 'z-40'}">
				<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={showLogin}
					>{lang(lS, 'Log In', 'Se Connecter')}</button
				>
				{#if login}
					<Login class="card" />
				{/if}
			</div>
		{/if}
		<div class="cardButton h-fit m-auto {settings ? 'z-50' : 'z-40'}">
			<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={showSettings}
				>{lang(lS, 'Settings', 'Paramètres')}</button
			>
			{#if settings}
				<Settings class="card" />
			{/if}
		</div>
	</div>
{/if}
<h1 class="fixed top-5 text-4xl font-bold text-center w-screen">{getTitle(page.url.pathname)}</h1>

<style>
	.cardButton {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
