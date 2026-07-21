<script lang="ts">
	import { AlertDialog } from '$lib/components';
	import { Button, Label } from 'bits-ui';
	import type { OrganizationMember } from '$lib';
	import { enhance } from '$app/forms';

	let { members, user } = $props();

	let focus = $state(-1);

	let m = $derived(members[focus]);

	let confirmDeleteOpen = $state(false);

	let confirmPage = $state(0);

	let confirmText = $state('');
	let confirmError = $state('');

	function cancel() {
		confirmDeleteOpen = false;
		confirmPage = 0;
	}

	let promoteOpen = $state(false);

	function promote() {
		promoteOpen = true;
	}

	let demoteOpen = $state(false);

	function demote() {
		demoteOpen = true;
	}
</script>

<div
	class="flex h-[80vh] w-full items-center justify-center overflow-scroll overscroll-none rounded-xl border border-(--o) bg-(--bg) p-5"
>
	{#if focus === -1}
		<div class="h-full w-full">
			<h2 class="mb-5 text-center text-3xl font-bold">List of Members</h2>
			{#each members as member, i (i)}
				<div class="flex px-5 py-3">
					<div class="flex w-fit items-center">
						{#if member.owner}
							<p class=" badge bg-violet-500">Admin</p>
						{:else}
							<p class="badge bg-(--p)">Member</p>
						{/if}
					</div>
					<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
						<span class="font-bold">{member.user.name}</span>
						{#if member.user.id === user}
							<span class="text-base opacity-50">(You)</span>
						{/if} -
						<span class="overflow-hidden font-mono text-base">{member.user.email}</span>
					</p>
					<Button.Root onclick={() => (focus = i)}>Manage</Button.Root>
				</div>
				{#if i !== members.length - 1}
					<hr class="m-auto w-[90%] border-(--o)" />
				{/if}
			{/each}
		</div>
	{:else}
		<div class="relative h-full w-full">
			{#if m.owner}
				<p class="badge m-auto mb-1 bg-violet-500">Admin</p>
			{:else}
				<p class="badge m-auto mb-1 bg-(--p)">Member</p>
			{/if}
			<h2 class="text-center text-3xl font-bold">
				{m.user.name}
				{#if m.user.id === user}<span class="text-2xl font-normal opacity-50">(You)</span>{/if}
			</h2>
			<h3 class="text-center font-mono text-lg">{m.user.email}</h3>
			<form action="?/renameMember" method="POST" class="m-auto my-8 w-fit">
				<Label.Root for="name">Rename To:</Label.Root>
				<div class="m-auto flex gap-1">
					<input name="name" id="name" required />
					<Button.Root type="submit">Go</Button.Root>
				</div>
				<input type="hidden" name="user" value={m.user.id} />
			</form>
			{#if !m.owner && m.user.id !== user}
				<Button.Root class="m-auto mb-8 block" onclick={promote}>Promote to Admin</Button.Root>
			{/if}
			{#if members.filter((member: OrganizationMember) => member.owner).length > 1 && m.owner && m.user.id !== user}
				<Button.Root class="m-auto mb-8 block" onclick={demote}>Demote to Member</Button.Root>
			{/if}
			{#if members.length > 0 && m.user.id !== user}
				{#if (m.owner && members.filter((member: OrganizationMember) => member.owner).length > 1) || !m.owner}
					<Button.Root class="m-auto block bg-(--red)!" onclick={() => (confirmDeleteOpen = true)}
						>Delete User</Button.Root
					>
				{/if}
			{/if}
			<div class="absolute bottom-5 w-full">
				<Button.Root onclick={() => (focus = -1)} class="m-auto block">Back</Button.Root>
			</div>
		</div>
	{/if}
</div>

<AlertDialog bind:open={promoteOpen}>
	<p class="mb-8 text-center text-lg">
		Are you sure you would like to promote {m.user.name} to admin?
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (promoteOpen = false)}>Cancel</Button.Root>
		<form action="?/promote" method="POST">
			<input type="hidden" value={m.user.id} name="userId" />
			<Button.Root type="submit">Go</Button.Root>
		</form>
	</div>
</AlertDialog>

<AlertDialog bind:open={demoteOpen}>
	<p class="mb-8 text-center text-lg">
		Are you sure you would like to demote {m.user.name} to member?
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (demoteOpen = false)}>Cancel</Button.Root>
		<form action="?/demote" method="POST">
			<input type="hidden" value={m.user.id} name="userId" />
			<Button.Root type="submit">Go</Button.Root>
		</form>
	</div>
</AlertDialog>

<AlertDialog bind:open={confirmDeleteOpen}>
	<div class="relative h-46 w-120">
		{#if confirmPage === 0}
			<p class="mb-8 text-center text-lg">
				Are you sure you would like to delete <b>{m.user.name}</b> from this organization? All data
				associated with {m.user.name} will be deleted.
			</p>
		{:else if confirmPage === 1}
			<p class="text-center">
				Please type <span class="font-mono">{m.user.email}</span> below to confirm.
			</p>
			<div class="m-auto mt-4 w-fit">
				<Label.Root for="confirm">Email:</Label.Root><br />
				<input type="text" id="confirm" class="w-80 font-mono" bind:value={confirmText} />
			</div>
		{:else}
			<p class="mb-8 text-center text-lg">
				The account of {m.user.name} has been marked for deletion, and will be deleted in 30 days if no
				attempt to recover the account has been made.
			</p>
		{/if}
		<p class="absolute bottom-14 left-20 text-(--red)">{confirmError}</p>
		<div class="absolute bottom-0 m-auto flex w-full items-center justify-center">
			<div class="flex gap-4">
				{#if confirmPage !== 2}
					<Button.Root onclick={cancel}>Cancel</Button.Root>
				{/if}
				{#if confirmPage === 0}
					<Button.Root class="bg-(--red)!" onclick={() => (confirmPage = 1)}>Next</Button.Root>
				{:else if confirmPage === 1}
					<form
						action="?/delete"
						method="POST"
						use:enhance={({ cancel }) => {
							if (confirmText !== m.user.email) {
								cancel();
								confirmError = 'Email is incorrect';
								return;
							}

							confirmPage = 2;
						}}
					>
						<Button.Root class="bg-(--red)!" type="submit">Go</Button.Root>
						<input type="hidden" name="user" value={m.user.id} />
					</form>
				{:else}
					<Button.Root
						onclick={() => {
							confirmDeleteOpen = false;
							confirmPage = 0;
						}}>OK</Button.Root
					>
				{/if}
			</div>
		</div>
	</div>
</AlertDialog>
