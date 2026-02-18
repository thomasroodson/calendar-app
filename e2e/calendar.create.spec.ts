import { test, expect } from "@playwright/test";

test("cria um evento e ele aparece no calendário", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("agenda-page")).toBeVisible();

  await page.getByTestId("btn-create-event-sidebar").click();

  await expect(page.getByTestId("event-modal")).toBeVisible();

  const title = `Evento Teste ${Date.now()}`;
  const start = "2026-02-20T10:00";
  const end = "2026-02-20T11:00";

  await page.getByTestId("event-title").fill(title);
  await page.getByTestId("event-start").fill(start);
  await page.getByTestId("event-end").fill(end);

  await page.getByRole("button", { name: /salvar/i }).click();
  await expect(page.getByTestId("event-modal")).not.toBeVisible();
  await expect(page.getByTestId("event-card").filter({ hasText: title })).toBeVisible();
});

test("cancelar criação não deve criar evento", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("agenda-page")).toBeVisible();

  await page.getByTestId("btn-create-event-sidebar").click();
  await expect(page.getByTestId("event-modal")).toBeVisible();

  const titleNaoSalvo = `Evento cancelado ${Date.now()}`;
  await page.getByTestId("event-title").fill(titleNaoSalvo);

  await page.getByTestId("event-cancel").click();

  await expect(page.getByTestId("event-modal")).not.toBeVisible();
  await expect(page.getByText(titleNaoSalvo)).not.toBeVisible();
  await expect(page.getByTestId("event-card").filter({ hasText: titleNaoSalvo })).not.toBeVisible();
});
