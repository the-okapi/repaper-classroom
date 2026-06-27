<script lang="ts">
	import { Label, Button } from 'bits-ui';
	import { lS, lang } from '$lib/lang.svelte';
	import { slide } from 'svelte/transition';
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { class: c, ...props } = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');

	let error = $state('');

	let loading = $state(false);

	async function onsubmit(event: Event) {
		event.preventDefault();

		loading = true;

		const response = await fetch('/api/signup', {
			method: 'POST',
			body: JSON.stringify({
				name,
				email,
				password
			})
		});

		if (response.status === 400) {
			// This needs to be done too.
			loading = false;
		}
	}
</script>

<div in:slide out:slide class="{c} outline outline-(--o) bg-(--bg) p-6 rounded-xl" {...props}>
	{#if loading}
		<Loader class="animate-spin text-(--p) absolute m-auto" size={30} />
	{/if}
	<form {onsubmit} class={loading ? 'invisible' : 'visible'}>
		<div class="mb-5 w-50">
			<Label.Root for="name">{lang(lS, 'Name', 'Nom')}:</Label.Root>
			<input type="name" id="name" class="w-50" bind:value={name} required />
		</div>
		<div class="mb-5">
			<Label.Root for="email">{lang(lS, 'Email', 'Courriel')}:</Label.Root>
			<input type="email" id="email" class="w-50" bind:value={email} required />
		</div>
		<div class="mb-5">
			<Label.Root for="password">{lang(lS, 'Password', 'Mot de Passe')}:</Label.Root>
			<input
				type="password"
				id="password"
				class="w-50"
				minlength="6"
				bind:value={password}
				required
			/>
		</div>
		<div class="absolute w-50 text-center">
			<p class="text-(--red) text-xs">{error}</p>
		</div>
		<Button.Root type="submit" class="block w-fit m-auto">{lang(lS, 'Go', 'Aller')}</Button.Root>
	</form>
</div>
