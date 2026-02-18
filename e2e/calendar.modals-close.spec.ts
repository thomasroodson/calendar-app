import { test, expect } from "@playwright/test";

test.describe("Fechar modais por backdrop / X", () => {
  test("Modal de evento: clicar no X fecha", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("btn-create-event-sidebar").click();
    await expect(page.getByTestId("event-modal")).toBeVisible();

    await page.getByTestId("event-modal-close").click();
    await expect(page.getByTestId("event-modal")).not.toBeVisible();
  });

  test("Modal de evento: clicar no backdrop fecha", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("btn-create-event-sidebar").click();
    await expect(page.getByTestId("event-modal")).toBeVisible();

    await page.getByTestId("event-modal-backdrop").click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId("event-modal")).not.toBeVisible();
  });

  test("ConfirmModal: clicar no backdrop fecha (onCancel)", async ({ page }) => {
    await page.goto("/");
    const title = `Evento Confirm ${Date.now()}`;
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 18, 0);
    const day = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(
      base.getDate()
    ).padStart(2, "0")}`;

    await page.getByTestId("btn-create-event-sidebar").click();
    await page.getByTestId("event-title").fill(title);
    await page.getByTestId("event-start").fill(`${day}T18:00`);
    await page.getByTestId("event-end").fill(`${day}T19:00`);
    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByTestId("event-modal")).not.toBeVisible();

    const eventCard = page.getByTestId("event-card").filter({ hasText: title }).last();
    await eventCard.click({ force: true });
    await page.getByTestId("event-delete").click();
    await expect(page.getByTestId("confirm-modal")).toBeVisible();

    await page.getByTestId("confirm-backdrop").click({ position: { x: 10, y: 10 } });
    await expect(page.getByTestId("confirm-modal")).not.toBeVisible();
    await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible();
  });
});
