<script lang="ts">
	import { lS, lang } from '$lib/lang.svelte';
	import { page } from '$app/state';
	import { Settings, Login, Signup } from '$lib/components';
	import { slide } from 'svelte/transition';

	let { loggedIn } = $props();

	let shown = $state(false);
	let settings = $state(false);
	let login = $state(false);
	let signup = $state(false);

	function showSettings() {
		login = false;
		signup = false;
		settings = !settings;
	}

	function showLogin() {
		signup = false;
		settings = false;
		login = !login;
	}

	function showSignup() {
		login = false;
		settings = false;
		signup = !signup;
	}

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
			login = false;
			signup = false;
		}
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
		<a class="mx-2 h-fit m-auto hover:underline" href="/">{lang(lS, 'Home', 'Accueil')}</a>
		<div class="cardButton h-fit m-auto {settings ? 'z-50' : 'z-40'}">
			<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={showSettings}
				>{lang(lS, 'Settings', 'Paramètres')}</button
			>
			{#if settings}
				<Settings class="card" />
			{/if}
		</div>
		{#if !loggedIn}
			<div class="cardButton h-fit m-auto {login ? 'z-50' : 'z-40'}">
				<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={showLogin}
					>{lang(lS, 'Log In', 'Se Connecter')}</button
				>
				{#if login}
					<Login class="card" />
				{/if}
			</div>
			<div class="cardButton h-fit m-auto {signup ? 'z-50' : 'z-40'}">
				<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={showSignup}
					>{lang(lS, 'Sign Up', "S'inscrire")}</button
				>
				{#if signup}
					<Signup class="card" />
				{/if}
			</div>
		{/if}
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
