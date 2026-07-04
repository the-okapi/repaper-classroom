<script lang="ts">
	import { AlertDialog } from 'bits-ui';

	let { open = $bindable() } = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Portal>
		<AlertDialog.Overlay />
	</AlertDialog.Portal>
</AlertDialog.Root>
