<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { Select } from 'bits-ui';

	let { value, styling = true, c = '' } = $props();
</script>

<Select.Item
	value={value.value}
	label={value.label}
	class="hover:bg-(--fg)/5! z-50 rounded-xl {c} {styling ? value.value : ''}"
>
	{#snippet children({ selected })}
		<div class="flex">
			{#if selected}<Check size={20} class="my-auto mr-2" />{:else}<Check
					size={20}
					class="my-auto mr-2 opacity-0"
				/>{/if}
			{@html value.label}
		</div>
	{/snippet}
</Select.Item>
