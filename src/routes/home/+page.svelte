<script lang="ts">
	import type { PageProps } from './$types';
	import { Button, Label } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Home - Repaper Classroom</title>
</svelte:head>

<div class="pt-24 px-20 pb-10 grid grid-cols-3 gap-7">
	{#if data.organization}
		{#if data.organization.owner}
			<div class="box">
				<button
					class="box transition-colors cursor-pointer hover:bg-(--fg)/5! absolute"
					onclick={() => window.location.assign('/organization/' + data.organization.id)}
				>
					<div>
						<h2 class="font-bold text-4xl text-center">{data.organization.name}</h2>
						<h3 class="text-center mt-3">Manage Organization</h3>
					</div>
				</button>
			</div>
		{/if}
		<div class="box" in:fade>
			<form method="POST" action="?/create">
				<h2 class="text-center font-bold text-3xl mb-10">Create a Class</h2>
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
					class="transition-colors box cursor-pointer hover:bg-(--fg)/5! absolute"
					onclick={() => window.location.assign('/class/' + classData.id)}
				>
					<div>
						<h2 class="font-bold text-4xl text-center">{classData.name}</h2>
						<h3 class="text-center mt-3">Manage Class</h3>
					</div>
				</button>
			</div>
		{/each}
	{:else}
		<div class="box" out:fade>
			<form method="POST" action="?/organization">
				<h2 class="text-center font-bold text-2xl mb-10">Create an Organization</h2>
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
