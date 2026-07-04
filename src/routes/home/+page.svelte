<script lang="ts">
	import type { PageProps } from './$types';
	import { Label, Button, AlertDialog, Tabs } from 'bits-ui';

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
			{#if form?.createFailure}
				<p class="absolute text-(--red)">{form?.message}</p>
			{/if}
		</form>
	</div>
	{#each data.classes as classData, i (i)}
		<div class="box">
			<div class="text-center">
				<h2 class="text-center font-bold text-3xl mb-5">{classData.class.name} Class List</h2>
				<AlertDialog.Root open={true}>
					<AlertDialog.Trigger data-button-root>Add Student to Class</AlertDialog.Trigger>
					<AlertDialog.Portal>
						<AlertDialog.Overlay />
						<AlertDialog.Content class="w-130 flex items-center justify-center">
							<Tabs.Root value="add">
								<Tabs.List class="w-110 absolute top-3">
									<Tabs.Trigger value="add">Add a Student</Tabs.Trigger>
									<Tabs.Trigger value="create">Create a Student</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="add">
									<form method="POST" action="?/add" class="w-110">
										<h2 class="font-bold text-2xl my-5 text-center">
											Add a Student to {classData.class.name}
										</h2>
										<div class="w-fit m-auto">
											<Label.Root for="email">Email:</Label.Root><br />
											<input type="email" name="email" id="email" class="w-70" required />
										</div>
										<div class="mt-4 gap-4 flex w-fit m-auto">
											<AlertDialog.Cancel data-button-root type="button">Cancel</AlertDialog.Cancel>
											<Button.Root type="submit">Go</Button.Root>
										</div>
									</form>
								</Tabs.Content>
								<Tabs.Content value="create">
									<form method="POST" action="?/create" class="w-110">
										<h2 class="font-bold text-2xl mt-5 mb-3 text-center">
											Create a Student for {classData.class.name}
										</h2>
										<div class="w-fit m-auto mb-2">
											<Label.Root for="name">Name:</Label.Root><br />
											<input type="text" name="name" id="name" class="w-70" required />
										</div>
										<div class="w-fit m-auto">
											<Label.Root for="email">Email:</Label.Root><br />
											<input type="email" name="email" id="email" class="w-70" required />
										</div>
										<div class="mt-4 gap-4 flex w-fit m-auto">
											<AlertDialog.Cancel data-button-root type="button">Cancel</AlertDialog.Cancel>
											<Button.Root type="submit">Go</Button.Root>
										</div>
									</form>
								</Tabs.Content>
							</Tabs.Root>
						</AlertDialog.Content>
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
