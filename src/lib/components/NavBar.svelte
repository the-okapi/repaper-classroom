<script lang="ts">
	import { page } from '$app/state';
	import { Settings, Login, AlertDialog } from '$lib/components';
	import { slide } from 'svelte/transition';
	import { Button } from 'bits-ui';

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

	function show() {
		shown = !shown;
		if (!shown) {
			settings = false;
			login = false;
		}
	}

	let logOutOpen = $state(false);

	async function logOutAction() {
		await fetch('/api/signout', {
			method: 'POST'
		});
		window.location.reload();
	}

	function link() {
		shown = false;
	}
</script>

<AlertDialog bind:open={logOutOpen}>
	<p class="mb-8 text-center text-2xl font-semibold">Are you sure you would like to log out?</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root class="px-5! py-2.5! text-lg" onclick={() => (logOutOpen = false)}
			>Cancel</Button.Root
		>
		<Button.Root class="px-5! py-2.5! text-lg" onclick={logOutAction}>Go</Button.Root>
	</div>
</AlertDialog>

<button
	class="fixed top-5 left-5 z-50! h-10 w-10 cursor-pointer rounded-lg font-[TimesNewRoman] text-2xl font-black outline outline-(--o) backdrop-blur-lg"
	onclick={show}
>
	R
</button>
{#if shown}
	<div
		in:slide={{ axis: 'x' }}
		out:slide={{ axis: 'x' }}
		class="fixed top-5 left-17 z-40! flex h-10 rounded-xl px-3 py-1.5 outline outline-(--o) backdrop-blur-xs"
	>
		{#if loggedIn}
			<a class="m-auto mx-2 h-fit hover:underline" href="/home" onclick={link}>Home</a>
			<button
				class="mx-2 cursor-pointer whitespace-nowrap hover:underline"
				onclick={() => (logOutOpen = true)}
			>
				Log Out
			</button>
		{:else}
			<a class="m-auto mx-2 h-fit hover:underline" href="/" onclick={link}>Home</a>
			<a class="m-auto mx-2 h-fit whitespace-nowrap hover:underline" href="/signup" onclick={link}
				>Sign Up</a
			>
			<div class="cardButton m-auto h-fit {login ? 'z-50!' : 'z-40!'}">
				<button class="mx-2 cursor-pointer whitespace-nowrap hover:underline" onclick={showLogin}
					>Log In</button
				>
				{#if login}
					<Login class="card" />
				{/if}
			</div>
		{/if}
		<div class="cardButton m-auto h-fit {settings ? 'z-50!' : 'z-40!'}">
			<button class="mx-2 cursor-pointer whitespace-nowrap hover:underline" onclick={showSettings}
				>Settings</button
			>
			{#if settings}
				<Settings class="card" />
			{/if}
		</div>
	</div>
{/if}
<h1
	class="fixed top-0 w-screen border-b border-(--o) py-5 text-center text-4xl font-bold backdrop-blur-md"
>
	{page.data.title ?? 'Repaper Classroom'}
</h1>

<style>
	.cardButton {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
