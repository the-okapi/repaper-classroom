<script lang="ts">
	import { AlertDialog } from 'bits-ui';

	let { open = $bindable(), children } = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
		<AlertDialog.Content>
			{@render children?.()}
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>
