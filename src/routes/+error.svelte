<script lang="ts">
	import { Button } from 'bits-ui';
	import { page } from '$app/state';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<div>
		<h1 class="text-9xl font-bold">{page.status}: {page.error?.message}</h1>
		<br />
		<Button.Root href="/" class="m-auto mt-10 block w-fit rounded-2xl! px-8! py-5! text-4xl"
			>Home</Button.Root
		>
	</div>
</div>
