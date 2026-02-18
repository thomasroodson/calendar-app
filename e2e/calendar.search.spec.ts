import { test, expect } from "@playwright/test";

test.describe("Search", () => {
  test("filtrar por texto: Alpha aparece, Beta não; limpar busca traz os dois", async ({
    page
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("agenda-page")).toBeVisible();

    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0);
    const day = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(
      base.getDate()
    ).padStart(2, "0")}`;

    const createEvent = async (title: string, hour: number) => {
      await page.getByTestId("btn-create-event-sidebar").click();
      await expect(page.getByTestId("event-modal")).toBeVisible();
      await page.getByTestId("event-title").fill(title);
      await page.getByTestId("event-start").fill(`${day}T${String(hour).padStart(2, "0")}:00`);
      await page.getByTestId("event-end").fill(`${day}T${String(hour + 1).padStart(2, "0")}:00`);
      await page.getByRole("button", { name: /salvar/i }).click();
      await expect(page.getByTestId("event-modal")).not.toBeVisible();
    };

    await createEvent("Reunião Alpha", 10);
    await createEvent("Consulta Beta", 11);

    await expect(page.getByTestId("event-card").filter({ hasText: "Reunião Alpha" })).toBeVisible();
    await expect(page.getByTestId("event-card").filter({ hasText: "Consulta Beta" })).toBeVisible();

    await page.getByTestId("global-search").click();
    await page.getByTestId("global-search").fill("Alpha");

    const searchResults = page.getByTestId("search-results");
    await expect(searchResults).toBeVisible();
    await expect(searchResults.getByText("Reunião Alpha")).toBeVisible();
    await expect(searchResults.getByText("Consulta Beta")).not.toBeVisible();

    await page.getByTestId("global-search").fill("");
    await page.keyboard.press("Escape");

    await expect(page.getByTestId("event-card").filter({ hasText: "Reunião Alpha" })).toBeVisible();
    await expect(page.getByTestId("event-card").filter({ hasText: "Consulta Beta" })).toBeVisible();
  });
});
