// One-shot: spin up HTTP server, take screenshots, exit.
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PREVIEW_DIR = path.resolve(__dirname, 'public', 'preview');

const MIME = {
  '.html':'text/html', '.css':'text/css', '.jsx':'text/javascript',
  '.js':'text/javascript', '.mjs':'text/javascript', '.svg':'image/svg+xml',
  '.png':'image/png', '.jpg':'image/jpeg', '.json':'application/json',
  '.ico':'image/x-icon', '.woff':'font/woff', '.woff2':'font/woff2',
};

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/' || p === '') p = '/index.html';
  const fp = path.join(PREVIEW_DIR, p);
  if (!fp.startsWith(PREVIEW_DIR)) { res.writeHead(403); res.end(); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end(String(err)); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'text/plain' });
    res.end(data);
  });
});

await new Promise(r => server.listen(8766, r));
console.log('serving', PREVIEW_DIR, 'on http://localhost:8766');

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
page.on('pageerror', e => console.log('  [ERR]', String(e).slice(0, 160)));

const pages = [
  { name: 'landing',   file: 'index.html' },
  { name: 'dashboard', file: 'Dashboard.html' },
  { name: 'admin',     file: 'Admin.html' },
];

for (const p of pages) {
  const url = `http://localhost:8766/${p.file}`;
  console.log('goto', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  try {
    await page.waitForFunction(() => document.getElementById('root')?.children.length > 0, { timeout: 15000 });
    await page.waitForTimeout(1500);
    console.log('  rendered');
  } catch {
    console.log('  root empty');
  }
  const out = path.resolve(__dirname, `screenshot-${p.name}.png`);
  await page.screenshot({ path: out, fullPage: true });
  console.log('  saved', out);
}
await browser.close();
server.close();
console.log('done');
