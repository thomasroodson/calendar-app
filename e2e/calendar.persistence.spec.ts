import { test, expect } from "@playwright/test";

test("Persistência após reload: criar evento, reload, evento continua aparecendo", async ({
  page
}) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  const title = `Evento Persist ${Date.now()}`;
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 14, 0);
  const day = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(
    base.getDate()
  ).padStart(2, "0")}`;
  const start = `${day}T14:00`;
  const end = `${day}T15:00`;

  await page.getByTestId("btn-create-event-sidebar").click();
  await expect(page.getByTestId("event-modal")).toBeVisible();
  await page.getByTestId("event-title").fill(title);
  await page.getByTestId("event-start").fill(start);
  await page.getByTestId("event-end").fill(end);
  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();

  await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible();

  await page.reload();
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible({
    timeout: 10000
  });
});
