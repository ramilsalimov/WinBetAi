// Screenshot landing, dashboard, admin to review layout.
import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREVIEW_DIR = path.resolve(__dirname, 'public', 'preview');

const BASE = 'http://localhost:8765';
const pages = [
  { name: 'landing', file: 'index.html' },
  { name: 'dashboard', file: 'Dashboard.html' },
  { name: 'admin', file: 'Admin.html' },
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  page.on('pageerror', e => console.log('  [ERR]', String(e).slice(0, 200)));
  page.on('console', m => { if (m.type()==='error' || m.type()==='warning') console.log(`  [${m.type()}]`, m.text().slice(0, 200)); });

  for (const p of pages) {
    const url = 'file://' + path.resolve(PREVIEW_DIR, p.file).replace(/\\/g, '/');
    console.log('goto', url);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 }).catch(e => console.log('nav:', e.message.slice(0, 80)));
    await page.waitForTimeout(8000);
    // Wait until root has child
    try {
      await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 10000 });
      console.log('  root rendered');
    } catch {
      const html = await page.evaluate(() => document.documentElement.outerHTML.slice(0, 500));
      console.log('  root empty; head:', html.replace(/\s+/g, ' ').slice(0, 300));
    }
    const outPath = path.resolve(__dirname, `screenshot-${p.name}.png`);
    await page.screenshot({ path: outPath, fullPage: true });
    console.log('  saved', outPath);
  }

  await browser.close();
})();
