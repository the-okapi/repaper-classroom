<script lang="ts">
	import { Button } from 'bits-ui';
	import { lS, lang } from '$lib/lang.svelte';
	import { page } from '$app/state';
	import { Settings, Login, Signup } from '$lib/components';

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
		}
	}
</script>

<Button.Root
	class="z-40 fixed bg-(--bg) top-5 left-5 w-10 h-10 border border-(--o) font-[TimesNewRoman] font-black text-2xl rounded-lg cursor-pointer"
	onclick={show}
>
	R
</Button.Root>
<div
	class="{shown
		? 'visible'
		: 'opacity-0 invisible'} flex transition-opacity z-40 fixed h-10 top-5 left-17 py-1.5 px-3 border border-(--o) rounded-xl bg-(--bg)"
>
	<Button.Root class="mx-2 hover:underline" href="/">{lang(lS, 'Home', 'Accueil')}</Button.Root>
	<div class="cardButton">
		<Button.Root class="mx-2 hover:underline cursor-pointer" onclick={showSettings}
			>{lang(lS, 'Settings', 'Paramètres')}</Button.Root
		>
		<Settings class="{settings ? 'visible' : 'invisible opacity-0'} card transition-opacity" />
	</div>
	<div class="cardButton">
		<Button.Root class="mx-2 hover:underline cursor-pointer" onclick={showLogin}
			>{lang(lS, 'Log In', 'Se Connecter')}</Button.Root
		>
		<Login class="{login ? 'visible' : 'invisible opacity-0'} card transition-opacity" />
	</div>
	<div class="cardButton">
		<Button.Root class="mx-2 hover:underline cursor-pointer" onclick={showSignup}
			>{lang(lS, 'Sign Up', "S'inscrire")}</Button.Root
		>
		<Signup class="{login ? 'visible' : 'invisible opacity-0'} card transition-opacity" />
	</div>
</div>
<h1 class="fixed top-5 text-4xl font-bold text-center w-screen">{getTitle(page.url.pathname)}</h1>

<style>
	.cardButton {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
