import { chromium } from "playwright";

const apps = [
  "https://dslq-app.streamlit.app/",
  "https://pps-app.streamlit.app/",
  "https://dslq-ru.streamlit.app/",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1365, height: 900 },
  userAgent:
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
});

for (const url of apps) {
  const page = await context.newPage();
  console.log(`Visiting ${url}`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90_000 });
    await sleep(8_000);

    const wakeButton = page
      .getByRole("button", { name: /get this app back up|wake|yes/i })
      .first();

    if (await wakeButton.isVisible({ timeout: 5_000 }).catch(() => false)) {
      console.log(`Waking ${url}`);
      await wakeButton.click();
      await page.waitForLoadState("domcontentloaded", { timeout: 90_000 }).catch(() => {});
      await sleep(20_000);
    }

    const title = await page.title().catch(() => "");
    console.log(`Finished ${url} (${title || "no title"})`);
  } catch (error) {
    console.error(`Failed ${url}:`, error);
    throw error;
  } finally {
    await page.close();
  }
}

await context.close();
await browser.close();
