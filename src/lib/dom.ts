export const { $, $$ } = {

    $: (selector: string): ReturnType<typeof document.querySelector> => document.querySelector(selector),
    $$: (selector: string) => Array.from(document.querySelectorAll(selector))
}
