import { test, expect } from "@playwright/test";

test("edita um evento existente", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("agenda-page")).toBeVisible();

  const originalTitle = `Evento Edit ${Date.now()}`;
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0); // amanhã 14:00

  const start = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}T14:00`;
  const end = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}T15:00`;

  await page.getByTestId("btn-create-event-sidebar").click();
  await expect(page.getByTestId("event-modal")).toBeVisible();

  await page.getByTestId("event-title").fill(originalTitle);
  await page.getByTestId("event-start").fill(start);
  await page.getByTestId("event-end").fill(end);

  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();

  const eventCard = page.getByTestId("event-card").filter({ hasText: originalTitle }).last();
  await expect(eventCard).toBeVisible();
  await eventCard.click({ force: true });

  await expect(page.getByTestId("event-popover")).toBeVisible();

  await page.getByTestId("event-edit").click();

  await expect(page.getByTestId("event-modal")).toBeVisible();
  await expect(page.getByTestId("event-title")).toHaveValue(originalTitle);

  const updatedTitle = `${originalTitle} Atualizado`;
  await page.getByTestId("event-title").fill(updatedTitle);

  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();

  await expect(page.getByTestId("event-card").filter({ hasText: updatedTitle })).toBeVisible();
});
