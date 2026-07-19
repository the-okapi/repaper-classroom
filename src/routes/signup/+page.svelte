<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import type { PageProps } from './$types';
	import { Loader } from '$lib/components';
	import { enhance } from '$app/forms';

	let { form }: PageProps = $props();

	let loading = $state(false);

	let password = $state('');
	let confirmPassword = $state('');

	let error: string | null = $state(null);
</script>

<svelte:head>
	<title>Sign Up - Repaper Classroom</title>
</svelte:head>

<div class="m-auto flex h-screen w-screen items-center justify-center p-20">
	{#if loading}
		<Loader />
	{:else}
		<div class="m-auto">
			<form
				method="POST"
				class="flex w-fit flex-col items-center"
				use:enhance={({ cancel }) => {
					loading = true;
					error = null;
					if (password !== confirmPassword) {
						loading = false;
						cancel();
						error = "Password and Confirm Password don't match.";
					}

					return ({ update, result }) => {
						if (result.status === 400) {
							loading = false;
						}
						update();
					};
				}}
			>
				<div class="mb-5 text-left">
					<Label.Root for="name">Your Name:</Label.Root><br />
					<input id="name" type="text" value={form?.name} name="name" class="w-50" required />
				</div>
				<div class="mb-5 text-left">
					<Label.Root for="email">Your Email:</Label.Root><br />
					<input id="email" type="email" value={form?.email} name="email" class="w-50" required />
				</div>
				<div class="mb-5 text-left">
					<Label.Root for="password">Password:</Label.Root><br />
					<input
						id="password"
						type="password"
						name="password"
						bind:value={password}
						class="w-50"
						required
					/>
				</div>
				<div class="text-left">
					<Label.Root for="password">Confirm Password:</Label.Root><br />
					<input
						id="confirm-password"
						type="password"
						bind:value={confirmPassword}
						class="w-50"
						required
					/>
				</div>
				{#if form?.fail || error}
					<div class="flex w-50 justify-center bg-red-500">
						<p class="absolute text-(--red)">{form?.message || error}</p>
					</div>
				{/if}
				<Button.Root type="submit" class="mt-10 w-fit">Go</Button.Root>
			</form>
		</div>
	{/if}
</div>
