import { init, register } from "svelte-i18n";
import { browser } from "$app/environment";

const defaultLocale = "ko";

register("ko", () => import("./locales/ko.json"));
register("en", () => import("./locales/en.json"));

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? window.navigator.language : defaultLocale,
});
