import { test, expect } from "@playwright/test";

test.describe("Validação de intervalo inválido", () => {
  test("Fim < Início desabilita Salvar e exibe mensagem de erro", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("agenda-page")).toBeVisible();

    await page.getByTestId("btn-create-event-sidebar").click();
    await expect(page.getByTestId("event-modal")).toBeVisible();

    const day = "2026-02-20";
    await page.getByTestId("event-title").fill("Evento teste");
    await page.getByTestId("event-start").fill(`${day}T11:00`);
    await page.getByTestId("event-end").fill(`${day}T10:00`);

    await expect(page.getByTestId("event-range-error")).toBeVisible();
    await expect(page.getByTestId("event-range-error")).toContainText(
      /horário final deve ser maior/i
    );

    const saveButton = page.getByRole("button", { name: /salvar evento/i });
    await expect(saveButton).toBeDisabled();
  });
});
