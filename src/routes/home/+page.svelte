<script lang="ts">
	import type { PageProps } from './$types';
	import { Button, Label } from 'bits-ui';
	import { fade } from 'svelte/transition';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Home - Repaper Classroom</title>
</svelte:head>

<div class="pt-24 px-20 pb-10 grid grid-cols-3">
	{#if data.organization}
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
			<a
				class="box cursor-pointer hover:bg-(--fg)/5 transition-colors"
				href="/class/{classData.id}"
			>
				<h2 class="font-bold text-4xl">{classData.name}</h2>
			</a>
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
