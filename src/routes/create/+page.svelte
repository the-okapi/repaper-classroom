<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import type { PageProps } from './$types';
	import { enhance } from '$app/forms';
	import { lS, lang } from '$lib/lang.svelte';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>{lang(lS, 'Create', 'Créer')}</title>
</svelte:head>

<div class="p-20 w-fit m-auto">
	<form method="POST" use:enhance class="w-fit flex flex-col items-center">
		<div class="text-left mb-5">
			<Label.Root for="name">{lang(lS, 'Your Name', 'Ton Nom')}:</Label.Root><br />
			<input id="name" type="text" name="name" required />
		</div>
		<div class="text-left mb-5">
			<Label.Root for="email">{lang(lS, 'Your Email', 'Ton Courriel')}:</Label.Root><br />
			<input id="email" type="email" name="email" required />
		</div>
		<div class="text-left">
			<Label.Root for="password">{lang(lS, 'Password', 'Mot de Passe')}:</Label.Root><br />
			<input id="password" type="password" name="password" required />
		</div>
		<hr class="my-5 w-60" />
		<div class="text-left mb-4">
			<Label.Root for="class-name">{lang(lS, 'Class Name', 'Nom de la Classe')}:</Label.Root><br />
			<input id="class-name" type="text" name="class-name" required />
		</div>
		{#if form?.fail}
			<div>
				<p class="absolute text-(--red)">{form.message}</p>
			</div>
		{/if}
		<Button.Root type="submit" class="mt-10 w-fit">{lang(lS, 'Go', 'Aller')}</Button.Root>
	</form>
</div>
