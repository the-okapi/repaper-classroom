<script lang="ts">
	import { Select } from 'bits-ui';
	import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	let { value = $bindable(), trigger, children, font = '', ...props } = $props();
</script>

<Select.Root bind:value {...props} type="single">
	<Select.Trigger
		><div class="text-left {font}">{trigger}</div>
		<div class="text-right"><ChevronsUpDown size="20" class="m-auto ml-2" /></div></Select.Trigger
	>
	<Select.Portal>
		<Select.Content sideOffset={5} class="z-50">
			<Select.ScrollUpButton><ChevronUp /></Select.ScrollUpButton>
			<Select.Viewport>
				{@render children()}
			</Select.Viewport>
			<Select.ScrollDownButton><ChevronDown /></Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>
