<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { slide } from 'svelte/transition';
	import { Loader } from '$lib/components';

	let { class: c, ...props } = $props();

	let email = $state('');
	let password = $state('');

	let error = $state('');

	let loading = $state(false);

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
			error = 'Invalid Email or Password';
			loading = false;
		} else {
			loading = false;
			window.location.reload();
		}
	}
</script>

<div
	in:slide
	out:slide
	class="{c} flex items-center justify-center rounded-xl bg-(--bg) p-6 outline outline-(--o)"
	{...props}
>
	{#if loading}
		<Loader size={30} />
	{/if}
	<form {onsubmit} class={loading ? 'invisible' : 'visible'}>
		<div class="mb-5 w-50">
			<Label.Root for="email" class={loading ? 'opacity-50' : ''}>Email:</Label.Root>
			<input type="email" id="email" class="w-50" bind:value={email} required />
		</div>
		<div class="mb-0.5 w-50">
			<Label.Root for="password" class={loading ? 'opacity-50' : ''}>Password:</Label.Root>
			<input type="password" id="password" class="w-50" bind:value={password} required />
		</div>
		<div class="absolute w-50 text-center">
			<p class="text-xs text-(--red)">{error}</p>
		</div>
		<Button.Root type="submit" class="m-auto mt-7 block w-fit">Go</Button.Root>
	</form>
</div>
