import { test, expect } from "@playwright/test";

test("Clicar no dia na sidebar abre view do dia certo", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  await page.getByTestId("view-select").selectOption("week");
  await page.waitForTimeout(300);

  const dayToClick = 15;
  await page.getByTestId(`sidebar-day-${dayToClick}`).click();

  await expect(page.getByTestId("view-select")).toHaveValue("day");
  const headerLabel = page.getByTestId("calendar-header-label");
  await expect(headerLabel).toBeVisible();
  await expect(page.getByTestId("calendar-day-badge")).toContainText(String(dayToClick));
});
