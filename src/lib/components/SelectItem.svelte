<script lang="ts">
	import Check from '@lucide/svelte/icons/check';
	import { Select } from 'bits-ui';
	import { lS, lang } from '$lib/lang.svelte';

	let { value, styling = true, c = '' } = $props();
</script>

<Select.Item
	value={value.value}
	label={lang(lS, value.english, value.french)}
	class="hover:bg-(--fg)/10 rounded-xl {c} {styling ? value.value : ''}"
>
	{#snippet children({ selected })}
		<div class="flex">
			{#if selected}<Check size={20} class="my-auto mr-2" />{:else}<Check
					size={20}
					class="my-auto mr-2 opacity-0"
				/>{/if}
			{@html lang(lS, value.english, value.french)}
		</div>
	{/snippet}
</Select.Item>
