import { test, expect } from "@playwright/test";

test.describe("Calendar Drag and Drop", () => {
  test("drag & drop com dispatchEvent", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("agenda-page")).toBeVisible();

    const today = new Date();
    const dayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate()
    ).padStart(2, "0")}`;
    const dragTitle = `Evento Drag ${Date.now()}`;
    await page.getByTestId("btn-create-event-sidebar").click();
    await expect(page.getByTestId("event-modal")).toBeVisible();
    await page.getByTestId("event-title").fill(dragTitle);
    await page.getByTestId("event-start").fill(`${dayStr}T14:00`);
    await page.getByTestId("event-end").fill(`${dayStr}T15:00`);
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

    if (fromDay === secondDay) {
      targetColumn = allColumns.nth(0);
    }

    const targetDay = await targetColumn.getAttribute("data-day");
    const eventId = await firstEvent.getAttribute("data-event-id");

    const result = await page.evaluate(
      ({ eventId, targetDay }) => {
        const allCards = Array.from(
          document.querySelectorAll(`[data-testid="event-card"][data-event-id="${eventId}"]`)
        );
        const eventCard = allCards.find((el) => {
          const style = window.getComputedStyle(el);
          return style.display !== "none" && style.visibility !== "hidden";
        });

        const targetColumn = document.querySelector(`[data-day="${targetDay}"]`);

        if (!eventCard || !targetColumn) {
          return { success: false, error: "Elementos não encontrados" };
        }

        const dataTransfer = new DataTransfer();

        const dragStartEvent = new DragEvent("dragstart", {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer
        });

        eventCard.dispatchEvent(dragStartEvent);

        const targetRect = targetColumn.getBoundingClientRect();
        const dragOverEvent = new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer,
          clientX: targetRect.x + 30,
          clientY: targetRect.y + 600
        });
        targetColumn.dispatchEvent(dragOverEvent);

        const dropEvent = new DragEvent("drop", {
          bubbles: true,
          cancelable: true,
          dataTransfer: dataTransfer,
          clientX: targetRect.x + 30,
          clientY: targetRect.y + 600
        });
        targetColumn.dispatchEvent(dropEvent);

        const dragEndEvent = new DragEvent("dragend", {
          bubbles: true,
          cancelable: true
        });
        window.dispatchEvent(dragEndEvent);

        return { success: true };
      },
      { eventId, targetDay }
    );

    await page.waitForTimeout(1500);
    await expect(page.getByText(/evento atualizado/i)).toBeVisible({ timeout: 5000 });

    await page.getByTestId("drag-update-alert-close").click();
  });
});
