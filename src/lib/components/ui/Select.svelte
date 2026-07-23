<script lang="ts">
	import { SelectC, SelectItem } from '$lib/components';
	import type { SelectItemType } from '$lib/types';

	let {
		options,
		value = $bindable(),
		onChange = () => {},
		styling = true,
		itemClass = '',
		...props
	} = $props();

	const selectedOptionLabel = $derived(
		options.find((option: SelectItemType) => option.value === value)
	);

	function onC(v: string) {
		value = v;
		onChange();
	}
</script>

<SelectC bind:value onValueChange={onC} trigger={selectedOptionLabel?.label} {...props} {styling}>
	{#each options as option, i (i + option.value)}
		<SelectItem
			value={option}
			{styling}
			class={itemClass}
			rounded={i === 0 ? 't' : i === options.length - 1 ? 'b' : ''}
		/>
	{/each}
</SelectC>
