<script lang="ts">
	import { Select } from 'bits-ui';
	import expand from '$lib/assets/icons/expand.svg';

	let { value = $bindable(), trigger, children, styling, font = '', ...props } = $props();
</script>

<Select.Root bind:value {...props} type="single">
	<Select.Trigger
		><div class="flex items-center text-left {font} {styling ? value : ''}">
			<p>{trigger}</p>
		</div>
		<div class="text-right">
			<div class="inline-flex h-full items-center">
				<img src={expand} alt="Open the select menu" class="inline size-5" />
			</div>
		</div></Select.Trigger
	>
	<Select.Portal>
		<Select.Content sideOffset={5} class="z-50">
			<Select.Viewport>
				{@render children()}
			</Select.Viewport>
		</Select.Content>
	</Select.Portal>
</Select.Root>
