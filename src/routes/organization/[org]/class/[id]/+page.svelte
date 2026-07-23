<script lang="ts">
	import type { PageProps } from './$types';
	import { Combobox, Loader, AlertDialog } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { load } from './load.remote';
	import { enhance } from '$app/forms';
	import type { OrganizationMember } from '$lib/types';
	import { fade } from 'svelte/transition';

	let { data, params, form }: PageProps = $props();

	let showConfirm = $state(false);
	let remove = $state(0);

	function confirmRemove(i: number) {
		remove = i;
		showConfirm = true;
	}
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="flex gap-7 px-10 pt-25">
	<div class="flex h-[80vh] w-full flex-col gap-4">
		<div class="flex h-70 w-full gap-4">
			<div
				class="flex h-57 w-full items-center justify-center rounded-xl border border-(--o) bg-(--bg)"
			>
				{#await load(params.org)}
					<Loader />
				{:then { data: members }}
					<form class="relative h-full w-full p-5" method="POST" action="?/add">
						<h2
							class="text-center text-2xl
							font-bold"
						>
							Add Member
						</h2>
						{#if form?.add}
							<div class="absolute left-0 w-full">
								<p class="text-center text-sm text-(--red)">{form.add}</p>
							</div>
						{/if}
						{let memberToAdd = $state(
							form?.user
								? members.find((o: OrganizationMember) => (o.user.id = form.user))
										.user.name
								: ''
						)}
						<div class="m-auto mt-5 mb-1 w-fit">
							<Label.Root for="member" class="text-sm"
								>Choose Someone to Add:</Label.Root
							>
							<Combobox id="member" options={members} bind:value={memberToAdd} />
						</div>
						{#if memberToAdd !== ''}
							{const member = $derived(
								members.find((o: OrganizationMember) => o.user.name === memberToAdd)
							)}
							<input type="hidden" name="email" value={member.user.email} />
							<div class="absolute left-0 w-full">
								<p
									class="block overflow-hidden text-center text-sm text-ellipsis whitespace-nowrap"
								>
									{member.user.name} -
									<span class="font-mono">{member.user.email} </span>
								</p>
							</div>
							<input type="hidden" name="userId" value={member.user.id} />
						{/if}
						<Button.Root type="submit" class="m-auto mt-8 block">Go</Button.Root>
					</form>
				{/await}
			</div>
			<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
		</div>
		<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
	</div>
	<div class="relative z-10 h-[80vh] w-full rounded-xl border border-(--o) bg-(--bg) p-5">
		<h2 class="text-center text-3xl font-bold">Class List</h2>
		{#each data.members as member, i (i)}
			<div class="flex px-5 py-3" in:fade out:fade>
				<div class="flex w-fit items-center">
					{#if member.owner}
						<p class="badge bg-yellow-600">Admin</p>
					{:else}
						<p class="badge bg-(--p)">Member</p>
					{/if}
				</div>
				<p class="m-auto mx-4 w-full overflow-x-scroll text-xl whitespace-nowrap">
					<span class="font-bold">{member.user.name}</span>
					{#if member.user.id === data.user}
						<span class="text-base opacity-50">(You)</span>
					{/if} -
					<span class="overflow-hidden font-mono text-base">{member.user.email}</span>
				</p>
				<Button.Root onclick={() => confirmRemove(i)} class="bg-(--red)!"
					>Remove</Button.Root
				>
			</div>
			{#if i !== data.members.length - 1}
				<hr in:fade out:fade class="m-auto w-[80%] border-(--o)" />
			{/if}
		{/each}
	</div>
</div>

<AlertDialog bind:open={showConfirm}>
	<p class="mb-8 text-center text-lg">
		Are you sure you would like to remove {data.members[remove].user.name} from this class?
	</p>
	<div class="m-auto flex w-fit gap-4">
		<Button.Root onclick={() => (showConfirm = false)}>Cancel</Button.Root>
		<form
			action="?/remove"
			method="POST"
			use:enhance={() => {
				showConfirm = false;
			}}
		>
			<input type="hidden" value={data.members[remove].user.id} name="userId" />
			<Button.Root type="submit" class="bg-(--red)!">Go</Button.Root>
		</form>
	</div>
</AlertDialog>
