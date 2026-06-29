<script lang="ts">
	import { Button, Label } from 'bits-ui';
	import type { PageProps } from './$types';
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { form }: PageProps = $props();

	let loading = $state(false);
</script>

<svelte:head>
	<title>Create a Class</title>
</svelte:head>

<div class="p-20 m-auto flex items-center justify-center w-screen h-screen">
	{#if loading}
		<Loader class="animate-spin text-(--p) absolute m-auto" size={40} />
	{:else}
		<div class="m-auto">
			<form
				method="POST"
				class="w-fit flex flex-col items-center"
			>
				<div class="text-left mb-5">
					<Label.Root for="name">Your Name:</Label.Root><br />
					<input id="name" type="text" name="name" class="w-50" required />
				</div>
				<div class="text-left mb-5">
					<Label.Root for="email">Your Email:</Label.Root><br />
					<input id="email" type="email" name="email" class="w-50" required />
				</div>
				<div class="text-left mb-5">
					<Label.Root for="password">Password:</Label.Root><br />
					<input id="password" type="password" name="password" class="w-50" required />
				</div>
				<div class="text-left">
					<Label.Root for="password">Confirm Password:</Label.Root><br />
					<input id="password" type="password" name="password" class="w-50" required />
				</div>
				<hr class="my-5 w-60" />
				<div class="text-left mb-4">
					<Label.Root for="class-name">Class Name:</Label.Root><br
					/>
					<input id="class-name" type="text" name="class-name" class="w-50" required />
				</div>
				{#if form?.fail}
					<div class="w-50 flex justify-center bg-red-500">
						<p class="absolute text-(--red)">{form?.message}</p>
					</div>
				{/if}
				<Button.Root type="submit" class="mt-10 w-fit">Go</Button.Root>
			</form>
		</div>
	{/if}
</div>
