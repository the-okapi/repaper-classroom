<script lang="ts">
	import { Button } from 'bits-ui';
</script>

<svelte:head>
	<title>Something happened...</title>
</svelte:head>

<div class="flex items-center justify-center w-screen h-screen">
	<div class="text-center h-fit">
		<h1 class="mb-5">Something happened on our end.</h1>
		<Button.Root class="m-auto" href="/home">Home</Button.Root>
	</div>
</div>
