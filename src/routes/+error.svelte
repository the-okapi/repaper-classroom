<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex h-screen w-screen items-center justify-center">
	<h1 class="text-9xl font-bold">{page.status}: {page.error?.message}</h1>
</div>
