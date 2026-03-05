import { describe, expect, it, vi } from "vitest";

describe("i18n init", () => {
	it("uses default locale on server", async () => {
		vi.resetModules();

		vi.doMock("$app/environment", () => ({ browser: false }));

		const init = vi.fn();
		const register = vi.fn();
		vi.doMock("svelte-i18n", () => ({ init, register }));

		await import("./index.js");

		expect(register).toHaveBeenCalledTimes(2);
		expect(register).toHaveBeenCalledWith("ko", expect.any(Function));
		expect(register).toHaveBeenCalledWith("en", expect.any(Function));
		expect(init).toHaveBeenCalledWith({
			fallbackLocale: "ko",
			initialLocale: "ko",
		});

		const [, koLoader] = register.mock.calls.find(([key]) => key === "ko");
		const ko = await koLoader();
		expect(ko).toBeTruthy();
	});

	it("uses navigator language on browser", async () => {
		vi.resetModules();

		Object.defineProperty(window.navigator, "language", {
			value: "en-US",
			configurable: true,
		});

		vi.doMock("$app/environment", () => ({ browser: true }));

		const init = vi.fn();
		const register = vi.fn();
		vi.doMock("svelte-i18n", () => ({ init, register }));

		await import("./index.js");

		expect(init).toHaveBeenCalledWith({
			fallbackLocale: "ko",
			initialLocale: "en-US",
		});
	});
});
