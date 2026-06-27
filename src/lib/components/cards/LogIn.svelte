<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import { lS, lang } from '$lib/lang.svelte';

	let { class: c, ...props } = $props();
</script>

<div class="{c} border border-(--o) bg-(--bg) p-6 rounded-xl" {...props}>
	<form method="POST" action="/account/login">
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
