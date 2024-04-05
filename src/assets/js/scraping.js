import puppeteer from "puppeteer";
import fs from "fs/promises";

async function getDataForPage() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.sportingnews.com/us-es/futbol/news/goleadores-eliminatorias-sudamericanas-mundial-2026/39868685444ecc220285e607",
    { waitUntil: "networkidle2" }
  );
  await page.setDefaultNavigationTimeout(60000);

  const result = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll("tr"));

    return rows.map((row) => {
      const columns = row.querySelectorAll("td");
      const rowData = Array.from(columns, (column) => column.innerText.trim());
      return {
        jugador: rowData[0],
        goles: parseInt(rowData[1]),
      };
    });
  });
  console.log(result);

  await fs.writeFile("data.json", JSON.stringify(result, null, 2));

  await browser.close();
}

getDataForPage();
