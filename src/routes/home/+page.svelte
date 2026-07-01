<script lang="ts">
	import type { PageProps } from './$types';
	import { Label, Button, AlertDialog } from 'bits-ui';

	let { data, form }: PageProps = $props();
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="pt-24 px-20 pb-10 grid grid-cols-3">
	<div class="box">
		<form method="POST" action="?/create">
			<h2 class="text-center font-bold text-3xl mb-10">Create a Class</h2>
			<Label.Root for="class-name">Class Name:</Label.Root><br />
			<input type="text" id="class-name" name="class-name" class="h-10" />
			<Button.Root type="submit">Go</Button.Root>
			{#if form?.failure}
				<p class="absolute text-(--red)">{form?.message}</p>
			{/if}
		</form>
	</div>
	{#each data.classes as classData, i (i)}
		<div class="box">
			<div class="text-center">
				<h2 class="text-center font-bold text-3xl mb-5">{classData.class.name} Class List</h2>
				<AlertDialog.Root>
					<AlertDialog.Trigger data-button-root>Add Student to Class</AlertDialog.Trigger>
					<AlertDialog.Portal>
						<AlertDialog.Overlay />
						<AlertDialog.Content></AlertDialog.Content>
					</AlertDialog.Portal>
				</AlertDialog.Root>
			</div>
		</div>
	{/each}
</div>

<style>
	.box {
		margin: auto;
		width: 25rem;
		height: 20rem;
		border: 1px solid var(--o);
		border-radius: 0.75rem;
		padding: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
