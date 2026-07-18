<script lang="ts">
	import { Loader } from '$lib/components';
	import { enhance } from '$app/forms';
	import { Label, Button } from 'bits-ui';

	let { form } = $props();

	let loading = $state(false);
</script>

<div
	class="w-150 p-5 h-70 bg-(--bg) rounded-xl border border-(--o) flex items-center justify-center"
>
	{#if loading}
		<Loader />
	{:else}
		<form
			class="w-full h-full relative"
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
			<h2 class="font-bold text-3xl text-center mt-5">Create Student</h2>
			<div class="w-fit m-auto mt-3">
				<Label.Root for="email">Email:</Label.Root><br />
				<input id="email" name="email" type="email" />
			</div>
			<Button.Root type="submit" class="mt-3 block w-fit m-auto mb-10">Go</Button.Root>
			{#if form?.createError}
				<p class="absolute bottom-0 text-(--red)">{form.message}</p>
			{/if}
		</form>
	{/if}
</div>
