<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher darkClassNames={["dark"]} lightClassNames={["light"]} />
{@render children()}
