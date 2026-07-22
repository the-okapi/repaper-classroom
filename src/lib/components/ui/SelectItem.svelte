<script lang="ts">
	import check from '$lib/assets/icons/check.svg';
	import { Select } from 'bits-ui';

	let { value, styling = true, class: c = '', rounded = '' } = $props();
</script>

<Select.Item
	value={value.value}
	label={value.label}
	class="z-50 rounded-{rounded}-xl bg-(--bg) hover:bg-(--fg)/5! {c} {styling ? value.value : ''}"
>
	{#snippet children({ selected })}
		<div class="flex">
			{#if selected}<img src={check} class="my-auto mr-2 size-5" alt="A checkmark" />{:else}<img
					src={check}
					class="my-auto mr-2 size-5 opacity-0"
					alt="Nothing"
				/>{/if}
			{@html value.label}
		</div>
	{/snippet}
</Select.Item>
