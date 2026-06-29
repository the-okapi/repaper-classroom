<script lang="ts">
	import { SelectC, SelectItem } from '$lib/components';
	import type { SelectItemType } from '$lib';

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

<SelectC bind:value onValueChange={onC} trigger={selectedOptionLabel?.label} {...props}>
	{#each options as option, i (i + option.value)}
		<SelectItem value={option} {styling} c={itemClass} />
	{/each}
</SelectC>
