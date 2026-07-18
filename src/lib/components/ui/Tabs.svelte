<script lang="ts">
	import { fly } from 'svelte/transition';

	let { value = $bindable(), children, options } = $props();
</script>

<div>
	<div data-tabs-list class="w-110 h-10 flex p-1">
		{#each options as option, i (i)}
			<div class="relative w-54 flex items-center">
				<button
					data-tabs-trigger
					class="z-50 h-8 top-0 left-0 w-53!"
					onclick={() => (value = option.value)}>{option.label}</button
				>
				{#if option.value === value}
					<div
						data-tabs-trigger
						data-state="active"
						class="absolute"
						in:fly={{ x: option === options[0] ? 215 : -215, opacity: 1, duration: 300 }}
					></div>
				{/if}
			</div>
		{/each}
	</div>

	{@render children()}
</div>
