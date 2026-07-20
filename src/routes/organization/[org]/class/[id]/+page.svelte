<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="flex gap-7 px-10 pt-25">
	<div class="relative z-10 h-[80vh] w-full rounded-xl border border-(--o) bg-(--bg) p-5">
		<h2 class="text-center text-3xl font-bold">Class List</h2>
		{#if data.students.length === 0}
			<p class="mt-10 text-center text-lg">There are no students in this class.</p>
		{/if}
	</div>
	<div class="flex h-[80vh] w-full flex-col gap-4">
		<div class="flex h-70 w-full gap-4">
			<!--
            <CreateStudent {form} />-->
			<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
			<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
		</div>
		<div class="h-full w-full rounded-xl border border-(--o) bg-(--bg) p-5"></div>
	</div>
</div>
