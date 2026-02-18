import { chromium } from "@playwright/test";

/**
 * Após todos os testes, abre a app e dá um reload na página
 * (verificação rápida de que a aplicação continua carregando).
 */
async function globalTeardown() {
  const baseURL = process.env.BASE_URL ?? "http://localhost:4173";
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto(baseURL, { timeout: 10000 });
    await page.reload({ waitUntil: "domcontentloaded" });
  } catch {
    // Ignora falhas (ex.: servidor já encerrado)
  } finally {
    await browser.close();
  }
}

export default globalTeardown;
