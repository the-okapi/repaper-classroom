<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { lS, lang } from '$lib/lang.svelte';
	import { slide } from 'svelte/transition';
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { class: c, ...props } = $props();

	let email = $state('');
	let password = $state('');

	let error = $state('');

	let loading = $state(true);

	async function onsubmit(event: Event) {
		event.preventDefault();

		loading = true;
		error = '';

		const response = await fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify({
				email,
				password
			})
		});

		if (response.status === 400) {
			error = lang(lS, 'Invalid email or password.', 'Mauvais Mot de Passe ou Courriel.');
			loading = false;
		}
	}
</script>

<div
	in:slide
	out:slide
	class="{c} outline outline-(--o) bg-(--bg) p-6 rounded-xl flex items-center justify-center"
	{...props}
>
	{#if loading}
		<Loader class="animate-spin text-(--p) absolute m-auto" size={30} />
	{/if}
	<form {onsubmit} class={loading ? 'invisible' : 'visible'}>
		<div class="mb-5 w-50">
			<Label.Root for="email" class={loading ? 'opacity-50' : ''}
				>{lang(lS, 'Email', 'Courriel')}:</Label.Root
			>
			<input type="email" id="email" class="w-50" bind:value={email} required />
		</div>
		<div class="mb-0.5 w-50">
			<Label.Root for="password" class={loading ? 'opacity-50' : ''}
				>{lang(lS, 'Password', 'Mot de Passe')}:</Label.Root
			>
			<input type="password" id="password" class="w-50" bind:value={password} required />
		</div>
		<div class="absolute w-50 text-center">
			<p class="text-(--red) text-xs">{error}</p>
		</div>
		<Button.Root type="submit" class="mt-7 block w-fit m-auto"
			>{lang(lS, 'Go', 'Aller')}</Button.Root
		>
	</form>
</div>
