<script lang="ts">
	import type { PageProps } from './$types';
	import { Combobox, Loader } from '$lib/components';
	import { Label, Button } from 'bits-ui';
	import { load } from './load.remote';

	let { data, params }: PageProps = $props();

	let memberToAdd = $state('');
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="flex gap-7 px-10 pt-25">
	<div class="flex h-[80vh] w-full flex-col gap-4">
		<div class="flex h-70 w-full gap-4">
			<div
				class="flex h-full w-full items-center justify-center rounded-xl border border-(--o) bg-(--bg)"
			>
				{#await load(params.org)}
					<Loader />
				{:then { data: members }}
					<form class="relative h-full w-full p-5" method="POST" action="?/add">
						<h2 class="mb-4 text-center text-2xl font-bold">Add Member</h2>
						<div class="m-auto mb-1 w-fit">
							<Label.Root for="member" class="text-sm">Choose Someone to Add:</Label.Root>
							<Combobox id="member" options={members} bind:value={memberToAdd} />
						</div>
						{#if memberToAdd !== ''}
							{const member = $derived(members.find((o) => o.user.name === memberToAdd))}
							<div class="absolute left-0 w-full">
								<p
									class="block overflow-hidden text-center text-sm text-ellipsis whitespace-nowrap"
								>
									{member.user.name} -
									<span class="font-mono">{member.user.email} </span>
								</p>
							</div>
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
			<div class="flex">
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
			</div>
		{/each}
	</div>
</div>
