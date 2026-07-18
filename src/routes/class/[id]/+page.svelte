<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.title} - Repaper Classroom</title>
</svelte:head>

<div class="pt-25 px-10 flex gap-7">
    <div class="w-full p-5 border rounded-xl border-(--o) h-[80vh] z-10 bg-(--bg) relative">
        <h2 class="font-bold text-3xl text-center">Class List</h2>
        {#if data.students.length === 0}
            <p class="text-center text-lg mt-10">There are no students in this class.</p>
        {/if}
    </div>
    <div class="w-full bg-(--bg) rounded-xl border border-(--o) h-[80vh]"></div>
</div>
