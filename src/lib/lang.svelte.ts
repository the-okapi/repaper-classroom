export const lS = $state({
    lang: 'en'
});

export function lang(languageState: { lang: string }, english: string, french: string) {
    if (languageState.lang === 'en') {
        return english;
    } else {
        return french;
    }
}