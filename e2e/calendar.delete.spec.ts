import { test, expect } from "@playwright/test";

test("exclui um evento existente", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  const title = `Evento Delete ${Date.now()}`;

  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0); // amanhã 16:00
  const day = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(
    base.getDate()
  ).padStart(2, "0")}`;

  const start = `${day}T16:00`;
  const end = `${day}T17:00`;

  await page.getByTestId("btn-create-event-sidebar").click();
  await expect(page.getByTestId("event-modal")).toBeVisible();

  await page.getByTestId("event-title").fill(title);
  await page.getByTestId("event-start").fill(start);
  await page.getByTestId("event-end").fill(end);

  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();

  const eventCard = page.getByTestId("event-card").filter({ hasText: title }).last();
  await expect(eventCard).toBeVisible();
  await eventCard.click({ force: true });

  await expect(page.getByTestId("event-popover")).toBeVisible();

  await page.getByTestId("event-delete").click();

  await expect(page.getByTestId("confirm-modal")).toBeVisible();
  await page.getByTestId("confirm-confirm").click();

  await expect(page.getByTestId("event-card").filter({ hasText: title })).toHaveCount(0, {
    timeout: 15000
  });
});

test("cancelar exclusão no confirm modal mantém o evento", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  const title = `Evento Não Excluir ${Date.now()}`;
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 16, 0);
  const day = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(
    base.getDate()
  ).padStart(2, "0")}`;
  const start = `${day}T16:00`;
  const end = `${day}T17:00`;

  await page.getByTestId("btn-create-event-sidebar").click();
  await expect(page.getByTestId("event-modal")).toBeVisible();
  await page.getByTestId("event-title").fill(title);
  await page.getByTestId("event-start").fill(start);
  await page.getByTestId("event-end").fill(end);
  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();

  const eventCard = page.getByTestId("event-card").filter({ hasText: title }).last();
  await expect(eventCard).toBeVisible();
  await eventCard.click({ force: true });

  await expect(page.getByTestId("event-popover")).toBeVisible();
  await page.getByTestId("event-delete").click();

  await expect(page.getByTestId("confirm-modal")).toBeVisible();
  await page.getByTestId("confirm-cancel").click();

  await expect(page.getByTestId("confirm-modal")).not.toBeVisible();
  await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible();
});
