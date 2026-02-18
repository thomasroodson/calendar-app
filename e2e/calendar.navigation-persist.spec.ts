import { test, expect } from "@playwright/test";

test("Navegação preserva dados: criar evento hoje, nav-next, nav-prev, evento ainda está lá", async ({
  page
}) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  const today = new Date();
  const dayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
  const title = `Evento Nav ${Date.now()}`;
  const start = `${dayStr}T09:00`;
  const end = `${dayStr}T10:00`;

  await page.getByTestId("view-select").selectOption("day");
  await page.waitForTimeout(300);

  await page.getByTestId("btn-create-event-sidebar").click();
  await expect(page.getByTestId("event-modal")).toBeVisible();
  await page.getByTestId("event-title").fill(title);
  await page.getByTestId("event-start").fill(start);
  await page.getByTestId("event-end").fill(end);
  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();

  await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible();

  await page.getByTestId("nav-next").click();
  await page.waitForTimeout(300);
  await expect(page.getByTestId("event-card").filter({ hasText: title })).not.toBeVisible();

  await page.getByTestId("nav-prev").click();
  await page.waitForTimeout(300);
  await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible();
});
