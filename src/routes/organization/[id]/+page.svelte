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
	<p class="text-center text-xl font-semibold">{confirmText}</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (confirmOpen = false)}>Cancel</Button.Root>
		<Button.Root
			onclick={() => {
				confirmOpen = false;
				confirmAction();
			}}>Go</Button.Root
		>
	</div>
</AlertDialog>

<div class="flex gap-4 px-10 pt-25">
	<div
		class="flex h-[80vh] w-full items-center justify-center overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
	>
		{#await data.members}
			<Loader />
		{:then { data: members, error }}
			{#if members}
				<div class="h-full w-full">
					<h2 class="mb-5 text-center text-3xl font-bold">List of Members</h2>
					{#each members as member, i (i)}
						<div class="flex px-5 py-3">
							<p class="m-auto mr-4 text-xl">{member.user.name}</p>
							<div class="flex w-full items-center">
								{#if member.owner}
									<p class="rounded-full bg-(--red) px-3 py-0.5 text-base text-(--bg)">Admin</p>
								{:else}
									<p class="rounded-full bg-cyan-600 px-3 py-0.5 text-base text-(--bg)">Member</p>
								{/if}
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
							<hr class="m-auto w-[90%]" />
						{/if}
					{/each}
				</div>
			{:else}
				<p>{error.message}</p>
				<Button.Root onclick={window.location.reload}>Try Again</Button.Root>
			{/if}
		{/await}
	</div>
	<div class="flex h-[80vh] w-full flex-col gap-4">
		<div class="flex h-full gap-4">
			<div class="flex h-full w-full items-center rounded-xl border border-(--o) bg-(--bg) p-5">
				<form action="?/rename" method="POST" class="m-auto">
					<h2 class="text-center text-2xl font-bold">Rename Organization</h2>
					<div class="mx-auto my-5 w-fit">
						<Label.Root for="name">Rename To:</Label.Root><br />
						<input type="text" name="name" id="name" />
					</div>
					<Button.Root type="submit" class="m-auto block">Go</Button.Root>
					{#if form?.renameError}
						<p class="absolute text-(--red)">{form.message}</p>
					{/if}
				</form>
			</div>
			<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
		</div>
		<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg)"></div>
	</div>
</div>
