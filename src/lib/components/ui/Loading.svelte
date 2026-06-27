<script lang="ts">
	import Loader from '@lucide/svelte/icons/loader-circle';
</script>

<div
	class="fixed inset-0 z-50 flex cursor-not-allowed items-center justify-center bg-(--bg) overflow-hidden"
>
	<Loader class="animate-spin text-(--p)" size={40} />
</div>
