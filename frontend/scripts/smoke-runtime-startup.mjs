// Isolated startup test against a local deployment. No login, OMERO data,
// existing browser profile or user notebook is accessed.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { chromium } from 'playwright-core';

const origin = new URL(process.env.OMERO_TEST_ORIGIN || 'http://localhost:4080').origin;
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) throw new Error('Use a local deployment');
const chrome = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
if (!chrome) throw new Error('Chrome was not found');
const compiled = await build({stdin: {contents: `
import {PythonRuntime} from './src/runtime.ts';
window.probe = {state: 'starting', stages: []};
const runtime = new PythonRuntime('${origin}/omero_analysis/runtime/');
window.beginProbe = () => runtime.start([], p => window.probe.stages.push(p.message)).then(async () => {
  const profiles = await runtime.profileInputs();
  window.probe = {...window.probe, state: 'ready', ready: runtime.ready, emptyProfiles: profiles.length === 0};
}).catch(e => { window.probe = {...window.probe, state: 'failed', error: String(e)}; });
`, resolveDir: resolve(import.meta.dirname, '..'), loader: 'ts'}, bundle: true, format: 'esm', write: false});
const browser = await chromium.launch({executablePath: chrome, headless: true});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('console', msg => {if (msg.type() === 'error') errors.push(msg.text());});
page.on('pageerror', e => errors.push(String(e)));
try {
  await page.route(origin + '/__analysis_runtime_probe__', route => route.fulfill({
    contentType: 'text/html', headers: {'Content-Security-Policy': "default-src 'self'; script-src 'self'; frame-src 'self'; worker-src blob:; object-src 'none'"},
    body: '<!doctype html><title>Isolated Analysis startup test</title><script type="module" src="/__analysis_runtime_probe__.js"></script>'
  }));
  await page.route(origin + '/__analysis_runtime_probe__.js', route => route.fulfill({contentType: 'text/javascript', body: compiled.outputFiles[0].text}));
  await page.goto(origin + '/__analysis_runtime_probe__');
  await page.waitForFunction(() => typeof window.beginProbe === 'function');
  await page.evaluate(() => { void window.beginProbe(); });
  await page.waitForFunction(() => window.probe && window.probe.state !== 'starting', {timeout: 150_000});
  const result = await page.evaluate(() => window.probe);
  console.log(JSON.stringify({...result, errors, noUserData: true}));
  if (result.state !== 'ready') process.exitCode = 1;
} finally {await browser.close();}
