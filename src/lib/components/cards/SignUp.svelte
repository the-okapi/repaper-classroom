<script lang="ts">
	import { Label, Button } from 'bits-ui';
	import { lS, lang } from '$lib/lang.svelte';
    import { slide } from 'svelte/transition';

	let { class: c, ...props } = $props();
</script>

<div in:slide out:slide class="{c} outline outline-(--o) bg-(--bg) p-6 rounded-xl" {...props}>
	<form method="POST" action="/account/signup">
		<div class="mb-5">
			<Label.Root for="name">{lang(lS, 'Name', 'Nom')}:</Label.Root>
			<input name="name" type="name" id="name" required />
		</div>
		<div class="mb-5">
			<Label.Root for="email">{lang(lS, 'Email', 'Courriel')}:</Label.Root>
			<input name="email" type="email" id="email" required />
		</div>
		<div class="mb-5">
			<Label.Root for="password">{lang(lS, 'Password', 'Mot de Passe')}:</Label.Root>
			<input name="password" type="password" id="password" required />
		</div>
		<Button.Root type="submit" class="block w-fit m-auto">{lang(lS, 'Go', 'Aller')}</Button.Root>
	</form>
</div>
