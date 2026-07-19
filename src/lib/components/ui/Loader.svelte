<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';

	let { size = 40 } = $props();
</script>

<Loader class="absolute m-auto animate-spin text-(--p)" {size} />
