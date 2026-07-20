<script lang="ts">
	import { fade, slide } from 'svelte/transition';

	let { open = $bindable(), children } = $props();
</script>

<div class="absolute z-50!">
	{#if open}
		<div data-alert-dialog-overlay in:fade out:fade></div>
		<div data-alert-dialog-content in:slide out:slide>
			{@render children?.()}
		</div>
	{/if}
</div>
