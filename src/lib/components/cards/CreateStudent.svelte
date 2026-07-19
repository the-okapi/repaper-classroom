<script lang="ts">
	import { Loader } from '$lib/components';
	import { enhance } from '$app/forms';
	import { Label, Button } from 'bits-ui';

	let { form } = $props();

	let loading = $state(false);
</script>

<div
	class="flex h-70 w-150 items-center justify-center rounded-xl border border-(--o) bg-(--bg) p-5"
>
	{#if loading}
		<Loader />
	{:else}
		<form
			class="relative h-full w-full"
			action="?/create"
			method="POST"
			use:enhance={() => {
				loading = true;

				return ({ update }) => {
					update();
					loading = false;
				};
			}}
		>
			<h2 class="mt-5 text-center text-3xl font-bold">Create Student</h2>
			<div class="m-auto mt-3 w-fit">
				<Label.Root for="email">Email:</Label.Root><br />
				<input id="email" name="email" type="email" />
			</div>
			<Button.Root type="submit" class="m-auto mt-3 mb-10 block w-fit">Go</Button.Root>
			{#if form?.createError}
				<p class="absolute bottom-0 text-(--red)">{form.message}</p>
			{/if}
		</form>
	{/if}
</div>
