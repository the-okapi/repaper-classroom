<script lang="ts">
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
				return 'Repaper Classroom';
			case '/signup':
				return 'Sign Up';
			case '/home':
				return 'Home';
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
		if (confirm('Are you sure you would like to log out?')) {
			await fetch('/auth/signout', {
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
			<a class="mx-2 h-fit m-auto hover:underline" href="/home" onclick={link}>Home</a>
			<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={logOut}>
				Log Out
			</button>
		{:else}
			<a class="mx-2 h-fit m-auto hover:underline" href="/" onclick={link}>Home</a>
			<a class="mx-2 h-fit m-auto hover:underline" href="/signup" onclick={link}>Sign Up</a>
			<div class="cardButton h-fit m-auto {login ? 'z-50' : 'z-40'}">
				<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={showLogin}
					>Log In</button
				>
				{#if login}
					<Login class="card" />
				{/if}
			</div>
		{/if}
		<div class="cardButton h-fit m-auto {settings ? 'z-50' : 'z-40'}">
			<button class="mx-2 hover:underline cursor-pointer whitespace-nowrap" onclick={showSettings}
				>Settings</button
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
