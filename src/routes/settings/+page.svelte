<script lang="ts">
    import { Select } from '$lib/components';
    import { mode, setMode } from 'mode-watcher';
    import { lS, lang } from '$lib/lang.svelte';
	import { Label } from 'bits-ui';

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
</script>

<svelte:head>
    <title>{lang(lS, 'Settings', 'Paramètres')}</title>
</svelte:head>

<div class="h-20"></div>

<div class="w-fit m-auto mb-8">
    <Label.Root for="mode">Mode:</Label.Root>
    <Select id="mode" options={modes} styling={false} bind:value={currentMode} onChange={onModeChange} />
</div>

<div class="w-fit m-auto">
    <Label.Root for="language">{lang(lS, 'Language', 'Langue')}:</Label.Root>
    <Select id="language" options={languages} styling={false}  bind:value={lS.lang} onChange={onLangChange} />
</div>
