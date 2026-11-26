#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${CAPTURE_URL:?Set CAPTURE_URL to the exact preview URL}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR to an output directory outside the project}"
export PROJECT_DIR CAPTURE_URL CAPTURE_DIR

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p node <<'NODE'
const fs = require('node:fs')
const path = require('node:path')
const { createRequire } = require('node:module')

const runtime = path.join(process.env.HOME, '.local/share/omgithub-playwright')
const runtimeRequire = createRequire(path.join(runtime, 'package.json'))
const { chromium } = runtimeRequire('playwright')
const config = JSON.parse(fs.readFileSync(path.join(runtime, process.platform === 'darwin' ? 'metal.json' : 'linux.json'), 'utf8'))
const url = process.env.CAPTURE_URL
const output = path.resolve(process.env.CAPTURE_DIR)
let parsed
try {
  parsed = new URL(url)
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('URL must use HTTP or HTTPS')
} catch (error) {
  console.error(`Invalid CAPTURE_URL: ${error.message}`)
  process.exit(1)
}
if (process.platform === 'linux') {
  process.env.DISPLAY ||= ':' + fs.readFileSync(path.join(runtime, 'display'), 'utf8').trim()
}

const temporary = error => Object.assign(error, { exitCode: 75 })
let browser
let exitCode = 0
;(async () => {
  try {
    browser = await chromium.launch({ ...config.browser.launchOptions, timeout: 30000 }).catch(temporary)
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }).catch(temporary)
    page.setDefaultTimeout(20000)
    const pageErrors = []
    const failedResponses = []
    page.on('pageerror', error => pageErrors.push(error.message))
    page.on('response', response => {
      if (response.status() >= 400 && new URL(response.url()).origin === parsed.origin) {
        failedResponses.push(`HTTP ${response.status()}: ${response.url()}`)
      }
    })

    let response
    try {
      response = await page.goto(url, { waitUntil: 'load', timeout: 45000 })
    } catch (error) {
      throw temporary(error)
    }
    if (!response) throw temporary(new Error('Navigation completed without an HTTP response'))
    if (!response.ok()) {
      const status = response.status()
      throw Object.assign(new Error(`Preview returned HTTP ${status}: ${url}`), {
        exitCode: [408, 429, 500, 502, 503, 504].includes(status) ? 75 : 1,
      })
    }

    try {
      await page.locator('#loading.done').waitFor({ state: 'attached', timeout: 30000 })
      await page.locator('.screen.active').waitFor({ state: 'visible', timeout: 10000 })
      await page.locator('#game').waitFor({ state: 'visible', timeout: 10000 })
      await page.evaluate(() => document.fonts.ready)
    } catch (error) {
      throw Object.assign(new Error(`The page loaded but the game did not render: ${error.message}`), { exitCode: 1 })
    }

    for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
      if (name === 'mobile') await page.setViewportSize({ width, height })
      await page.waitForTimeout(1000)
      const file = path.join(output, `final-${name}.png`)
      try {
        await page.screenshot({ path: file, fullPage: false, timeout: 30000 })
      } catch (error) {
        if (!browser.isConnected()) throw temporary(error)
        throw error
      }
      if (!fs.existsSync(file) || fs.statSync(file).size === 0) throw new Error(`Screenshot was not written: ${file}`)
      console.log(`Captured ${name}: ${file}`)
    }

    if (failedResponses.length) throw new Error(`App resources failed: ${failedResponses.join('; ')}`)
    if (pageErrors.length) throw new Error(`JavaScript rendering errors: ${pageErrors.join('; ')}`)
  } catch (error) {
    console.error(error)
    exitCode = error.exitCode || 1
  } finally {
    if (browser) {
      try { await browser.close() }
      catch (error) {
        console.error(`Could not close capture browser cleanly: ${error.message}`)
        exitCode ||= 75
      }
    }
  }
})().then(() => { process.exitCode = exitCode })
NODE
