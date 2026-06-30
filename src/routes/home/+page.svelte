<script lang="ts">
	import type { PageProps } from './$types';
	import Loader from '@lucide/svelte/icons/loader-circle';
	import { Label, Button } from 'bits-ui';

	let { data, form }: PageProps = $props();

	let createAddLoading = $state(false);
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<div class="pt-24 px-10 pb-10">
	<div class="w-100 h-80 border border-(--o) rounded-xl p-3 flex items-center justify-center">
		{#if createAddLoading}
			<Loader class="animate-spin text-(--p) absolute m-auto" size={30} />
		{:else if data.user?.class}
			<form method="POST" action="?/add">
				<h2 class="text-center font-bold text-3xl mb-10">Add Students to your Class</h2>
			</form>
		{:else}
			<form method="POST" action="?/create">
				<h2 class="text-center font-bold text-3xl mb-10">Create a Class</h2>
				<Label.Root for="class-name">Class Name:</Label.Root><br />
				<input type="text" id="class-name" name="class-name" class="h-10" />
				<Button.Root type="submit">Go</Button.Root>
				{#if form?.failure}
					<p class="absolute text-(--red)">{form?.message}</p>
				{/if}
			</form>
		{/if}
	</div>
</div>
