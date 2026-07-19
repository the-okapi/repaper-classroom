<script lang="ts">
	import { Select } from '$lib/components';
	import { mode, setMode, setTheme, theme } from 'mode-watcher';
	import { Label } from 'bits-ui';
	import { slide } from 'svelte/transition';

	// Light/Dark
	let modes = [
		{
			label: 'Light',
			value: 'light'
		},
		{
			label: 'Dark',
			value: 'dark'
		}
	];

	let currentMode: any = $state(mode.current);

	function onModeChange() {
		setMode(currentMode);
	}

	// Font
	let fonts = [
		{
			label: 'Georgia',
			value: 'georgia'
		},
		{
			label: 'Tahoma',
			value: 'tahoma'
		},
		{
			label: 'Arial',
			value: 'arial'
		},
		{
			label: 'Times New Roman',
			value: 'times'
		},
		{
			label: 'Trebuchet MS',
			value: 'trebuchet'
		},
		{
			label: 'System UI',
			value: 'system'
		}
	];

	let currentFont: any = $state(theme.current);

	function onFontChange() {
		setTheme(currentFont);
	}

	let { class: c, ...props } = $props();
</script>

<div in:slide out:slide class="rounded-xl bg-(--bg) p-6 outline outline-(--o) {c}" {...props}>
	<div class="m-auto mb-8 w-fit">
		<Label.Root for="mode">Mode:</Label.Root>
		<Select
			id="mode"
			options={modes}
			styling={false}
			bind:value={currentMode}
			onChange={onModeChange}
		/>
	</div>

	<div class="m-auto w-fit">
		<Label.Root for="font">Font:</Label.Root>
		<Select id="font" options={fonts} bind:value={currentFont} onChange={onFontChange} />
	</div>
</div>
