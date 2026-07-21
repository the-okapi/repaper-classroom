<script lang="ts">
	import { Button } from 'bits-ui';
	import type { PageProps } from './$types';
	import { AlertDialog } from '$lib/components';

	let { data }: PageProps = $props();

	let addStudent = $state(false);
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="flex gap-7 px-10 pt-25">
	<div class="flex h-[80vh] w-full flex-col gap-4">
		<div class="flex h-70 w-full gap-4">
			<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
			<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
		</div>
		<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
	</div>
	<div class="relative z-10 h-[80vh] w-full rounded-xl border border-(--o) bg-(--bg) p-5">
		<h2 class="text-center text-3xl font-bold">Class List</h2>
		<Button.Root class="m-auto my-5 block" onclick={() => (addStudent = true)}
			>Add Student</Button.Root
		>
		{#each data.members as member, i (i)}
			<div class="flex">
				<div class="flex w-fit items-center">
					{#if member.owner}
						<p class="badge bg-yellow-500">Admin</p>
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

<AlertDialog bind:open={addStudent}>
	<form action="?/add">
		<h2 class="text-center text-2xl font-bold">Add a Student to {data.title}</h2>
		<div class="m-auto flex w-fit gap-4">
			<Button.Root type="button" onclick={() => (addStudent = false)}>Cancel</Button.Root>
			<Button.Root type="submit">Go</Button.Root>
		</div>
	</form>
</AlertDialog>
