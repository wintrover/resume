import { render, screen } from "@testing-library/svelte";
import { describe, expect, it, vi } from "vitest";

vi.mock("$app/environment", () => ({ browser: false }));
vi.mock("$app/paths", () => ({ base: "" }));
vi.mock("svelte-i18n", async () => {
	const { readable, writable } = await import("svelte/store");
	const locale = writable("ko");
	const isLoading = writable(false);
	const _ = readable((key) => key);
	return { _, locale, isLoading, init: () => {}, register: () => {} };
});

import Layout from "./+layout.svelte";
import Page from "./+page.svelte";

describe("routes", () => {
	it("renders page and sets document title", () => {
		render(Page);
		expect(document.title).toBe("wintrover's resume");
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"site_title",
		);
	});

	it("layout shows spinner while loading", async () => {
		const { isLoading } = await import("svelte-i18n");
		isLoading.set(true);
		render(Layout);
		expect(screen.getByText("포트폴리오를 불러오는 중...")).toBeInTheDocument();
	});

	it("layout hides spinner when not loading", async () => {
		const { isLoading } = await import("svelte-i18n");
		isLoading.set(false);
		render(Layout);
		expect(
			screen.queryByText("포트폴리오를 불러오는 중..."),
		).not.toBeInTheDocument();
	});
});
