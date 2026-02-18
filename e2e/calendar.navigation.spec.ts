import { test, expect } from "@playwright/test";

test("troca entre views e navega no calendário", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  const header = page.getByTestId("calendar-header");

  await page.getByTestId("view-select").selectOption("day");
  await expect(page.getByTestId("view-select")).toHaveValue("day");

  const labelDay = await header.textContent();

  await page.getByTestId("nav-next").click();
  await expect(header).not.toHaveText(labelDay ?? "");

  await page.getByTestId("nav-today").click();

  await page.getByTestId("view-select").selectOption("week");
  await expect(page.getByTestId("view-select")).toHaveValue("week");

  await page.getByTestId("view-select").selectOption("month");
  await expect(page.getByTestId("view-select")).toHaveValue("month");
});
