<script lang="ts">
	import type { PageProps } from './$types';
	import { Button, Label } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Home - Repaper Classroom</title>
</svelte:head>

<div class="grid grid-cols-3 gap-7 px-20 pt-24 pb-10">
	{#if data.organization}
		{#if data.organization.owner}
			<div class="box">
				<button
					class="box absolute cursor-pointer transition-colors hover:bg-(--fg)/5!"
					onclick={() => window.location.assign('/organization/' + data.organization.id)}
				>
					<div>
						<h2 class="text-center text-4xl font-bold">{data.organization.name}</h2>
						<h3 class="mt-3 text-center">Manage Organization</h3>
					</div>
				</button>
			</div>
		{/if}
		<div class="box" in:fade>
			<form method="POST" action="?/create">
				<h2 class="mb-10 text-center text-3xl font-bold">Create a Class</h2>
				<Label.Root for="class-name">Class Name:</Label.Root><br />
				<input type="text" id="class-name" name="class-name" class="h-10" />
				<Button.Root type="submit">Go</Button.Root>
				{#if form?.createFailure}
					<p class="absolute text-(--red)">{form?.message}</p>
				{/if}
				<input type="hidden" name="organization" value={data.organization.id} />
			</form>
		</div>
		{#each data.classes as classData, i (i)}
			<div class="box">
				<button
					class="box absolute cursor-pointer transition-colors hover:bg-(--fg)/5!"
					onclick={() => window.location.assign('/class/' + classData.id)}
				>
					<div>
						<h2 class="text-center text-4xl font-bold">{classData.name}</h2>
						<h3 class="mt-3 text-center">Manage Class</h3>
					</div>
				</button>
			</div>
		{/each}
	{:else}
		<div class="box" out:fade>
			<form method="POST" action="?/organization">
				<h2 class="mb-10 text-center text-2xl font-bold">Create an Organization</h2>
				<Label.Root for="org-name">Organization Name:</Label.Root><br />
				<input type="text" id="org-name" name="org-name" class="h-10" />
				<Button.Root type="submit">Go</Button.Root>
				{#if form?.orgFailure}
					<p class="absolute text-(--red)"></p>
				{/if}
			</form>
		</div>
	{/if}
</div>
