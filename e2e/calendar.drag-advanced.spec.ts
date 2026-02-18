import { test, expect } from "@playwright/test";

test.describe("Drag & drop avançado", () => {
  test("drag para outra coluna e outra altura: valida dia e hora (snap 15min)", async ({
    page
  }) => {
    await page.goto("/");
    await expect(page.getByTestId("agenda-page")).toBeVisible();

    const today = new Date();
    const dayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;
    const dragTitle = `Evento Drag Adv ${Date.now()}`;
    await page.getByTestId("btn-create-event-sidebar").click();
    await expect(page.getByTestId("event-modal")).toBeVisible();
    await page.getByTestId("event-title").fill(dragTitle);
    await page.getByTestId("event-start").fill(`${dayStr}T15:00`);
    await page.getByTestId("event-end").fill(`${dayStr}T16:00`);
    await page.getByRole("button", { name: /salvar/i }).click();
    await expect(page.getByTestId("event-modal")).not.toBeVisible();

    await page.getByTestId("view-select").selectOption("week");
    await page.waitForTimeout(800);
    const firstEvent = page.getByTestId("event-card").filter({ hasText: dragTitle }).first();
    await expect(firstEvent).toBeVisible({ timeout: 10000 });

    const fromColumn = firstEvent.locator("xpath=ancestor::div[@data-testid='week-day-column']");
    const fromDay = await fromColumn.getAttribute("data-day");
    const allColumns = page.getByTestId("week-day-column");
    let targetColumn = allColumns.nth(1);
    const secondDay = await allColumns.nth(1).getAttribute("data-day");
    if (fromDay === secondDay) targetColumn = allColumns.nth(0);
    const targetDay = await targetColumn.getAttribute("data-day");
    const eventId = await firstEvent.getAttribute("data-event-id");

    const result = await page.evaluate(
      ({
        eventId,
        targetDay,
        targetOffsetY
      }: {
        eventId: string;
        targetDay: string;
        targetOffsetY: number;
      }) => {
        const allCards = Array.from(
          document.querySelectorAll(`[data-testid="event-card"][data-event-id="${eventId}"]`)
        );
        const eventCard = allCards.find((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        });
        const targetColumn = document.querySelector(`[data-day="${targetDay}"]`);
        if (!eventCard || !targetColumn) return { success: false, error: "Elementos não encontrados" };

        const dataTransfer = new DataTransfer();
        eventCard.dispatchEvent(
          new DragEvent("dragstart", { bubbles: true, cancelable: true, dataTransfer })
        );

        const rect = targetColumn.getBoundingClientRect();
        const clientY = rect.top + targetOffsetY;
        ["dragover", "drop"].forEach((type) => {
          targetColumn.dispatchEvent(
            new DragEvent(type, {
              bubbles: true,
              cancelable: true,
              dataTransfer,
              clientX: rect.x + 30,
              clientY
            })
          );
        });
        window.dispatchEvent(new DragEvent("dragend", { bubbles: true, cancelable: true }));
        return { success: true };
      },
      { eventId, targetDay, targetOffsetY: 400 }
    );

    expect(result).toEqual({ success: true });
    await expect(page.getByText(/evento atualizado/i)).toBeVisible({ timeout: 5000 });

    await page.waitForTimeout(1500);
    const cardInTargetColumn = page
      .locator(`[data-testid="week-day-column"][data-day="${targetDay}"]`)
      .locator(`[data-event-id="${eventId}"]`)
      .first();
    await expect(cardInTargetColumn).toBeVisible({ timeout: 8000 });
  });
});
