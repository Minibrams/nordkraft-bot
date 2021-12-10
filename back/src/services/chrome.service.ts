import { injectable } from 'inversify'
import puppeteer, { Page } from 'puppeteer'
import fs from 'fs'
import { logger } from '../logging/winston'
import { isDevelopment } from '../environment'

export interface IChromeService {
  open(url: string): Promise<puppeteer.Page>
  screenshot(page: puppeteer.Page, path: string): Promise<void>
}

@injectable()
export class ChromeService implements IChromeService {

  private browser: puppeteer.Browser | undefined = undefined

  async startBrowser() {
    logger.info('Launching Chrome...')
    const browser = await puppeteer.launch({
      headless: !isDevelopment(),
      args: [
        '--no-sandbox',
        '--disable-gpu',
      ],
      executablePath: isDevelopment() ? undefined : '/usr/bin/google-chrome'
    })

    return browser
  }

  async open(url: string): Promise<puppeteer.Page> {

    if (!this.browser) {
      logger.info('Starting browser...')
      this.browser = await this.startBrowser()
    }

    const page = await this.browser.newPage()

    logger.info(`Navigating to page: ${url}`)
    await page.goto(url, {
      timeout: 0,
      waitUntil: 'networkidle0'
    })

    return page
  }

  async screenshot(page: puppeteer.Page, path: string): Promise<void> {
    logger.info(`Screenshotting page: ${page.url()} to ${path}`)
    const screenData = await page.screenshot({ encoding: 'binary', type: 'jpeg', quality: 30 })
    if (!screenData) return

    fs.writeFileSync(path, screenData)
  }
}