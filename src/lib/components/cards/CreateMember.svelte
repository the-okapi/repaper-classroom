<script lang="ts">
	import { Loader } from '$lib/components';
	import { enhance } from '$app/forms';
	import { Label, Button } from 'bits-ui';

	let { form } = $props();

	let loading = $state(false);
</script>

<div
	class="relative flex items-center justify-center rounded-xl border border-(--o) bg-(--bg) px-12"
>
	{#if loading && !form?.createSuccess}
		<Loader />
	{:else if loading}
		<div class="absolute w-60 text-center">
			<p>
				An email has been sent to <span class="font-mono text-sm">{form.email}</span> to finish setting
				up the account.
			</p>
			<Button.Root onclick={() => (loading = false)} class="mt-7">Create another Member</Button.Root
			>
		</div>
	{/if}
	<form
		class="h-full w-full {loading ? 'invisible' : ''}"
		action="?/create"
		method="POST"
		use:enhance={() => {
			loading = true;

			return ({ update, result }) => {
				update();
				if (result.status !== 200) {
					loading = false;
				}
			};
		}}
	>
		<h2 class="mt-5 text-center text-3xl font-bold whitespace-nowrap">Create Member</h2>
		<div class="m-auto mt-3 w-fit">
			<Label.Root for="name">Name:</Label.Root><br />
			<input id="name" name="name" type="text" />
		</div>
		<div class="m-auto mt-3 w-fit">
			<Label.Root for="email">Email:</Label.Root><br />
			<input id="email" name="email" type="email" />
		</div>
		<Button.Root type="submit" class="m-auto mt-3 mb-10 block w-fit">Go</Button.Root>
		{#if form?.createError}
			<p class="absolute bottom-2 left-3 text-sm text-(--red)">{form.message}</p>
		{/if}
	</form>
</div>
