<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { size = 40 } = $props();
</script>

<Loader class="animate-spin text-(--p) absolute m-auto" {size} />
