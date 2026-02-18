import { test, expect } from "@playwright/test";

test("cria evento ao clicar em um slot vazio na semana", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  await page.getByTestId("view-select").selectOption("week");
  await expect(page.getByTestId("view-select")).toHaveValue("week");

  const firstColumn = page.getByTestId("week-day-column").first();
  await expect(firstColumn).toBeVisible();

  await firstColumn.click({ position: { x: 50, y: 10 * 80 + 10 } });

  await expect(page.getByTestId("event-modal")).toBeVisible();

  const startValue = await page.getByTestId("event-start").inputValue();
  await expect(startValue).not.toBe("");

  const title = `Grid Event ${Date.now()}`;
  await page.getByTestId("event-title").fill(title);

  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();

  await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible();
});
