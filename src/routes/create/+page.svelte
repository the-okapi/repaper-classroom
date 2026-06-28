<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { lS, lang } from '$lib/lang.svelte';
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { form }: PageProps = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>{lang(lS, 'Create', 'Créer')}</title>
</svelte:head>

<div class="p-20 m-auto flex items-center justify-center w-screen h-screen">
	{#if loading}
		<Loader class="animate-spin text-(--p) absolute m-auto" />
	{:else}
		<div class="m-auto">
			<form
				method="POST"
				use:enhance={() => {
					loading = true;

					return () => {
						loading = false;
					};
				}}
				class="w-fit flex flex-col items-center"
			>
				<div class="text-left mb-5">
					<Label.Root for="name">{lang(lS, 'Your Name', 'Ton Nom')}:</Label.Root><br />
					<input id="name" type="text" name="name" class="w-50" required />
				</div>
				<div class="text-left mb-5">
					<Label.Root for="email">{lang(lS, 'Your Email', 'Ton Courriel')}:</Label.Root><br />
					<input id="email" type="email" name="email" class="w-50" required />
				</div>
				<div class="text-left">
					<Label.Root for="password">{lang(lS, 'Password', 'Mot de Passe')}:</Label.Root><br />
					<input id="password" type="password" name="password" class="w-50" required />
				</div>
				<hr class="my-5 w-60" />
				<div class="text-left mb-4">
					<Label.Root for="class-name">{lang(lS, 'Class Name', 'Nom de la Classe')}:</Label.Root><br
					/>
					<input id="class-name" type="text" name="class-name" class="w-50" required />
				</div>
				{#if form?.fail}
					<div class="w-50 flex justify-center bg-red-500">
						<p class="absolute text-(--red)">{form?.message}</p>
					</div>
				{/if}
				<Button.Root type="submit" class="mt-10 w-fit">{lang(lS, 'Go', 'Aller')}</Button.Root>
			</form>
		</div>
	{/if}
</div>
