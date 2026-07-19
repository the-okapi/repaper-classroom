<script lang="ts">
	import { Label, Button } from 'bits-ui';
	import type { PageProps } from './$types';
	import { Loader, AlertDialog } from '$lib/components';

	let { data, form }: PageProps = $props();

	let confirmOpen = $state(false);
	let confirmText = $state('');
	let confirmAction = $state(() => {});

	function confirm(text: string, action: () => void) {
		confirmText = text;
		confirmAction = action;
		confirmOpen = true;
	}
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<AlertDialog bind:open={confirmOpen}>
	<p class="font-semibold text-center text-xl">{confirmText}</p>
	<div class="flex gap-4 m-auto w-fit">
		<Button.Root onclick={() => (confirmOpen = false)}>Cancel</Button.Root>
		<Button.Root
			onclick={() => {
				confirmOpen = false;
				confirmAction();
			}}>Go</Button.Root
		>
	</div>
</AlertDialog>

<div class="pt-25 px-10 flex gap-4">
	<div
		class="w-full overflow-scroll overscroll-none h-[80vh] bg-(--bg) border border-(--o) rounded-xl flex items-center justify-center p-5"
	>
		{#await data.members}
			<Loader />
		{:then { data: members, error }}
			{#if members}
				<div class="h-full w-full">
					<h2 class="text-center font-bold text-3xl mb-5">List of Members</h2>
					{#each members as member, i (i)}
						<div class="px-5 py-3 flex">
							<p class="text-xl m-auto mr-4">{member.user.name}</p>
							<div class="w-full flex items-center">
								<p class="align-middle font-mono text-base bg-(--p)/20 py-1.5 px-3 rounded-lg">
									{member.user.email}
								</p>
								
							</div>
							<Button.Root>Manage</Button.Root>
							{#if members.length === 1}
								<Button.Root
									class="ml-2"
									title="You cannot remove the only member of an organization."
									disabled>Remove</Button.Root
								>
							{:else}
								<Button.Root
									class="ml-2 bg-(--red)!"
									onclick={() =>
										confirm(
											`Are you sure you would like to remove ${member.user.name} from ${data.title}?`,
											() => {}
										)}>Remove</Button.Root
								>
							{/if}
						</div>
						{#if i !== members.length - 1}
							<hr class="w-[90%] m-auto" />
						{/if}
					{/each}
				</div>
			{:else}
				<p>{error.message}</p>
				<Button.Root onclick={window.location.reload}>Try Again</Button.Root>
			{/if}
		{/await}
	</div>
	<div class="h-[80vh] w-full flex flex-col gap-4">
		<div class="flex h-full gap-4">
			<div class="h-full w-full bg-(--bg) border border-(--o) rounded-xl p-5 flex items-center">
				<form action="?/rename" method="POST" class="m-auto">
					<h2 class="font-bold text-center text-2xl">Rename Organization</h2>
					<div class="mx-auto my-5 w-fit">
						<Label.Root for="name">Rename To:</Label.Root><br />
						<input type="text" name="name" id="name" />
					</div>
					<Button.Root type="submit" class="block m-auto">Go</Button.Root>
					{#if form?.renameError}
						<p class="absolute text-(--red)">{form.message}</p>
					{/if}
				</form>
			</div>
			<div class="h-full w-full bg-(--bg) border border-(--o) rounded-xl p-5"></div>
		</div>
		<div class="h-full w-full bg-(--bg) border border-(--o) rounded-xl"></div>
	</div>
</div>
