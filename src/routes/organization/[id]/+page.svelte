<script lang="ts">
	import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<svelte:head>
    <title>{data.title} - Repaper Classroom</title>
</svelte:head>