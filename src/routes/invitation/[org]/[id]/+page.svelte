<script lang="ts">
	import type { PageProps } from './$types';
	import { Label, Button } from 'bits-ui';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Create Account - Repaper Classroom</title>
</svelte:head>

<div class="flex h-screen w-screen items-center justify-center">
	<form class="relative rounded-xl border border-(--o) bg-(--bg) p-10" method="POST">
		<h2 class="mb-5 text-center text-3xl font-bold">Create Account</h2>
		<div class="m-auto w-fit">
			<Label.Root for="email">Email:</Label.Root><br />
			<input type="email" name="email" id="email" value={form?.email} required />
		</div>
		<p class="mb-5 text-xs">Use the email the invitation email was sent to.</p>
		<div class="m-auto mb-2 w-fit">
			<Label.Root for="password">Password:</Label.Root><br />
			<input type="password" name="password" id="password" required />
		</div>
		<div class="m-auto mb-5 w-fit">
			<Label.Root for="confirmPassword">Confirm Password:</Label.Root><br />
			<input type="password" name="confirmPassword" id="confirmPassword" required />
		</div>
		<Button.Root type="submit" class="m-auto block">Go</Button.Root>
		{#if form?.fail}
			<p class="absolute bottom-1 left-2 leading-none text-(--red)">{form.message}</p>
		{/if}
	</form>
</div>
