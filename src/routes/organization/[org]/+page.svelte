<script lang="ts">
	import { Label, Button } from 'bits-ui';
	import type { PageProps } from './$types';
	import CreateMember from './CreateMember.svelte';
	import OrganizationMembers from './OrganizationMembers.svelte';
	import { AlertDialog } from '$lib/components';
	import { enhance } from '$app/forms';

	let { data, form }: PageProps = $props();

	let invitation = $state(0);
	let confirmRevoke = $state(false);

	function revokeInvitation(i: number) {
		invitation = i;
		confirmRevoke = true;
	}

	let restore = $state(0);
	let restoreOpen = $state();

	function restoreMember(i: number) {
		restore = i;
		restoreOpen = true;
	}
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="flex gap-4 px-10 pt-25">
	<OrganizationMembers {...data} />
	<div class="flex h-[80vh] w-full gap-4">
		<div class="flex h-full w-full flex-col gap-4">
			<div
				class="h-full w-full overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
			>
				<h2 class="mb-5 text-center text-3xl font-bold">Invitations</h2>
				{#if data.invitations.length === 0}
					<p class="w-80">There are currently no invitations to this organization.</p>
				{/if}
				{#each data.invitations as invitation, i (i)}
					<div class="mb-2.5 flex w-80">
						<p class="my-auto w-70 overflow-hidden font-mono text-ellipsis">{invitation.email}</p>
						<Button.Root
							onclick={() => revokeInvitation(i)}
							class="ml-1 rounded-[0.625rem]! bg-(--red)! px-3! py-1.5!">Revoke</Button.Root
						>
					</div>
				{/each}
			</div>
			<div
				class="h-full w-full overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
			>
				<h2 class="mb-5 text-center text-3xl font-bold">Deletions</h2>
				{#if data.deletions.length === 0}
					<p class="w-80">There are currently no users marked for deletion in this organization.</p>
				{/if}
				{#each data.deletions as deletion, i (i)}
					<div class="mb-2.5 flex w-80">
						<p class="my-auto w-70 overflow-x-scroll whitespace-nowrap">
							<span class="font-mono text-sm"
								>{new Date(deletion.can_delete).toLocaleDateString('en-CA')}</span
							>
							- {deletion.name}
						</p>
						<Button.Root
							onclick={() => restoreMember(i)}
							class="ml-1 rounded-[0.625rem]! px-3! py-1.5! text-sm">Restore</Button.Root
						>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex h-full flex-col gap-4">
			<div class="flex h-full w-full items-center rounded-xl border border-(--o) bg-(--bg) p-5">
				<form action="?/rename" method="POST" class="m-auto">
					<h2 class="text-center text-2xl font-bold">Rename Organization</h2>
					<div class="mx-auto my-5 w-fit">
						<Label.Root for="name">Rename To:</Label.Root><br />
						<input type="text" name="name" id="name" required />
					</div>
					<Button.Root type="submit" class="m-auto block">Go</Button.Root>
					{#if form?.renameError}
						<p class="absolute text-(--red)">{form.message}</p>
					{/if}
				</form>
			</div>
			<CreateMember {form} />
		</div>
	</div>
</div>

<AlertDialog bind:open={confirmRevoke}>
	<p class="mb-8 text-center text-lg">
		Are you sure you would like to revoke the invitation to <span class="font-bold"
			>{data.invitations[invitation].name}</span
		>
		at
		<span class="font-mono text-base">{data.invitations[invitation].email}?</span>
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (confirmRevoke = false)}>Cancel</Button.Root>
		<form
			action="?/revoke"
			method="POST"
			use:enhance={() => {
				confirmRevoke = false;
			}}
		>
			<input type="hidden" value={data.invitations[invitation].id} name="invitation" />
			<Button.Root type="submit" class="bg-(--red)!">Go</Button.Root>
		</form>
	</div>
</AlertDialog>

<AlertDialog bind:open={restoreOpen}>
	<p class="mb-8 text-center text-lg">
		Are you sure you would like to restore the account of <span class="font-bold"
			>{data.deletions[restore].name}</span
		>?
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (restoreOpen = false)}>Cancel</Button.Root>
		<form
			action="?/restore"
			method="POST"
			use:enhance={() => {
				restoreOpen = false;
			}}
		>
			<input type="hidden" value={data.deletions[restore].id} name="userId" />
			<Button.Root type="submit">Go</Button.Root>
		</form>
	</div>
</AlertDialog>
