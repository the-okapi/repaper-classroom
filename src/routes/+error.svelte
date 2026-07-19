<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex items-center justify-center w-screen h-screen">
	<h1 class="font-bold text-9xl">{page.status}: {page.error?.message}</h1>
</div>
