<script lang="ts">
	import { Select } from '$lib/components';
	import { mode, setMode, setTheme, theme } from 'mode-watcher';
	import { lS, lang } from '$lib/lang.svelte';
	import { Label } from 'bits-ui';
	import { slide } from 'svelte/transition';

	// Light/Dark
	let modes = [
		{
			english: 'Light',
			french: 'Lumière',
			value: 'light'
		},
		{
			english: 'Dark',
			french: 'Sombre',
			value: 'dark'
		}
	];

	let currentMode: any = $state(mode.current);

	function onModeChange() {
		setMode(currentMode);
	}

	// Language
	let languages = [
		{
			english: 'English',
			french: 'English',
			value: 'en'
		},
		{
			english: 'Français',
			french: 'Français',
			value: 'fr'
		}
	];

	function onLangChange() {
		localStorage.setItem('classroom-lang', lS.lang);
	}

	// Font
	let fonts = [
		{
			english: 'Georgia',
			french: 'Georgia',
			value: 'georgia'
		},
		{
			english: 'Tahoma',
			french: 'Tahoma',
			value: 'tahoma'
		},
		{
			english: 'Arial',
			french: 'Arial',
			value: 'arial'
		},
		{
			english: 'Times New Roman',
			french: 'Times New Roman',
			value: 'times'
		},
		{
			english: 'Trebuchet MS',
			french: 'Trebuchet MS',
			value: 'trebuchet'
		},
		{
			english: 'System UI',
			french: 'System UI',
			value: 'system'
		}
	];

	let currentFont: any = $state(theme.current);

	function onFontChange() {
		setTheme(currentFont);
	}

	let { class: c, ...props } = $props();
</script>

<div in:slide out:slide class="outline outline-(--o) p-6 bg-(--bg) rounded-xl {c}" {...props}>
	<div class="w-fit m-auto mb-8">
		<Label.Root for="mode">Mode:</Label.Root>
		<Select
			id="mode"
			options={modes}
			styling={false}
			bind:value={currentMode}
			onChange={onModeChange}
		/>
	</div>

	<div class="w-fit m-auto mb-8">
		<Label.Root for="language">{lang(lS, 'Language', 'Langue')}:</Label.Root>
		<Select
			id="language"
			options={languages}
			styling={false}
			bind:value={lS.lang}
			onChange={onLangChange}
		/>
	</div>

	<div class="w-fit m-auto">
		<Label.Root for="font">{lang(lS, 'Font', 'Polis')}:</Label.Root>
		<Select id="font" options={fonts} bind:value={currentFont} onChange={onFontChange} />
	</div>
</div>
