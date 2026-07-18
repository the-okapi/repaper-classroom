<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AlertDialog, Label, Button } from 'bits-ui';
	import { Tabs } from '$lib/components';

	let tabsValue = $state('add');

	let { classData } = $props();
</script>

<div class="box" in:fade>
	<div class="text-center">
		<h2 class="text-center font-bold text-3xl mb-5">{classData.name} Class List</h2>
		<AlertDialog.Root>
			<AlertDialog.Trigger data-button-root>Add Student to Class</AlertDialog.Trigger>
			<AlertDialog.Portal>
				<AlertDialog.Overlay />
				<AlertDialog.Content class="flex justify-center items-center">
					<Tabs
						options={[
							{ label: 'Add an Existing Student', value: 'add' },
							{ label: 'Create a Student', value: 'create' }
						]}
						bind:value={tabsValue}
					>
						<form method="POST" class="w-110">
							<h2 class="font-bold text-xl mt-5 mb-3 text-center">
								{#if tabsValue === 'add'}
									Add an Existing Student to {classData.name}
								{:else}
									Create a Student for {classData.name}
								{/if}
							</h2>
							<div class="h-32 flex items-center justify-center">
								<div>
									{#if tabsValue === 'create'}
										<div class="w-fit m-auto mb-2">
											<Label.Root for="name">Name:</Label.Root><br />
											<input type="text" name="name" id="name" class="w-70" required />
										</div>
									{/if}
									<div class="w-fit m-auto">
										<Label.Root for="email">Email:</Label.Root><br />
										<input type="email" name="email" id="email" class="w-70" required />
									</div>
								</div>
							</div>
							<div class="mt-4 gap-4 flex w-fit m-auto">
								<AlertDialog.Cancel data-button-root type="button">Cancel</AlertDialog.Cancel>
								<Button.Root type="submit" formaction={tabsValue === 'add' ? '?/add' : '?/student'}
									>Go</Button.Root
								>
							</div>
							<input type="hidden" name="class" value={classData.id} />
						</form>
					</Tabs>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
		<Button.Root disabled>Manage Class</Button.Root>
	</div>
</div>
