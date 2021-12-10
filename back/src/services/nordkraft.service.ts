import { inject, injectable } from "inversify";
import { ElementHandle, Page } from "puppeteer";
import { DI } from "../di/symbols";
import { environment } from "../environment";
import { BadRequestException, ForbiddenException } from "../exceptions/http.exception";
import { logger } from "../logging/winston";
import { LoginInfoDto } from "../v1/dtos/loginInfo.dto";
import { ReservationDto } from "../v1/dtos/reservation.dto";
import { TimeslotDto } from "../v1/dtos/timeslot.dto";
import { IChromeService } from "./chrome.service";

export type Discipline = 'badminton' | 'styrketræning'

export interface INordkraftService {
  isLoggedIn(): Promise<boolean>
  getLoginInfo(): Promise<LoginInfoDto>
  login(username: string, password: string): Promise<boolean>
  getCurrentlyPostedTimeslots(sport: Discipline): Promise<TimeslotDto[]>
  makeReservation(url: string): Promise<ReservationDto | undefined>
}

@injectable()
export class NordkraftService implements INordkraftService {
  private readonly homePageUrl = 'https://clipnfitnordkraft.halbooking.dk/newlook/default.asp'
  private readonly loggedInPageUrl = 'https://clipnfitnordkraft.halbooking.dk/newlook/proc_mineopl.asp'
  private readonly notLoggedInPageUrl = 'https://clipnfitnordkraft.halbooking.dk/newlook/proc_side.asp?s=login'
  private readonly profilePageUrl = 'https://clipnfitnordkraft.halbooking.dk/newlook/proc_konto.asp'
  private readonly orderReceiptUrl = 'https://clipnfitnordkraft.halbooking.dk/newlook/proc_kvittering.asp'

  @inject(DI.Services.ChromeService) private chrome: IChromeService

  async makeReservation(url: string): Promise<ReservationDto | undefined> {
    if (!await this.isLoggedIn()) {
      throw new ForbiddenException(['You must be logged in to make a reservation.'])
    }

    const page = await this.chrome.open(url)
    await page.waitForXPath("//*[text() = ' Læg i kurv - brug 2 klip']")
    const placeInBasketButtons = await page.$x("//*[text() = ' Læg i kurv - brug 2 klip']")
    
    logger.info('Placing timeslot in basket...')
    await placeInBasketButtons[0].evaluate((button: HTMLButtonElement) => button.click())
    await page.waitForNavigation()

    logger.info('Confirming order...')
    await page.waitForXPath("//*[text() = 'Bekræft tilmelding']")
    const confirmOrderButtons = await page.$x("//*[text() = 'Bekræft tilmelding']")
    await confirmOrderButtons[0].evaluate((button: HTMLButtonElement) => button.click())
    await page.waitForNavigation()

    await page.waitForSelector('td')
    const receiptInfoDivision = await page.$('td')
    if (!receiptInfoDivision) return undefined

    const rawInfoString = await receiptInfoDivision.evaluate(divison => divison.innerHTML)
    const [
      kind,      // Tilmelding
      summary,   // Badminton - DGI Hallen
      date,      // Man 22-11-2021
      time,      // 06:00 - 07:00
      time2,     // 06:00 - 07:00
      location   // Idrætslokaler niv. 3: DGI Hallen
    ] = rawInfoString.split(/<[^>]+>/).filter(string => !!string)

    if (page.url() !== this.orderReceiptUrl) return undefined

    return {
      uuid: 'TBD',
      date: date,
      time: time,
      discipline: summary.split(' - ')[0].trim() as Discipline,
      location: location
    }
  }

  async isLoggedIn(): Promise<boolean> {
    const page = await this.chrome.open(this.profilePageUrl)
    
    try {
      return page.url() === this.profilePageUrl
    } finally {
      await page.close()
    }
  }

  async getLoginInfo(): Promise<LoginInfoDto> {
    if (!await this.isLoggedIn()) {
      return { isLoggedIn: false }
    }

    const page = await this.chrome.open(this.profilePageUrl)

    await page.waitForSelector('[id$="konto_navn"]')

    const profileName = await (await page.$('[id$="konto_navn"]'))?.evaluate((field: HTMLInputElement) => field.value)
    const username = await (await page.$('[id$="konto_loginid"]'))?.evaluate((field: HTMLInputElement) => field.value)
    
    try {
      return {
        isLoggedIn: true,
        info: {
          profileName: profileName ?? 'N/A',
          username: username ?? 'N/A'
        }
      }
    } finally {
      await page.close()
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    
    // Load the homepage
    const page = await this.chrome.open(this.homePageUrl)

    // Clicking the login button opens a modal with input fields, wait for it
    logger.info('Opening login modal...')

    const loginButton = await this.getLoginButton(page)
    await loginButton?.evaluate((b: HTMLButtonElement) => b.click())
    await page.waitForSelector('[id$="loginname"]')

    logger.info(`Entering user info (username: ${username}, password: ***********)`)
    const usernameField = await page.$('[id$=loginname]')
    const passwordField = await page.$('[id$=password]')
    const submitButton = await page.$('[id$="sub"]')

    // Enter the login information and click the submit button
    await usernameField?.evaluate((field: HTMLInputElement, username: string) => {
      field.value = username
    }, username)

    await passwordField?.evaluate((field: HTMLInputElement, password: string) => {
      field.value = password
    }, password)

    logger.info('Submitting login info...')
    await submitButton?.evaluate((b: HTMLButtonElement) => b.click())
    await page.waitForNavigation({ timeout: 10000 })

    try {
      if (page.url() === this.loggedInPageUrl) {
        logger.info('Successfully logged in!')
        return true
      } else {
        logger.info('Failed to log in.')
        return false
      }
    } finally {
      await page.close()
    }
  }

  async getCurrentlyPostedTimeslots(discipline: Discipline): Promise<TimeslotDto[]> {
    if (!await this.isLoggedIn()) {
      throw new ForbiddenException(['You must be logged in to view timeslots.'])
    }

    const timeslotsUrl = this.getTimeslotsUrlForDiscipline(discipline)

    if (!timeslotsUrl) {
      throw new BadRequestException([`Unknown discipline ${discipline}`])
    }

    const page = await this.chrome.open(timeslotsUrl)
    return []
  }

  private getTimeslotsUrlForDiscipline(discipline: Discipline): string | undefined {
    switch (discipline) {
      case 'badminton':
        return 'https://dgihusetnordkraft.dk/holdbeskrivelse/badminton/'
      default:
        return undefined
    }
  }

  private async getLoginButton(page: Page): Promise<ElementHandle<Element> | null> {
    await page.waitForSelector('[data-target="#loginModal"]', { timeout: 1000 })
    return page.$('[data-target="#loginModal"]')
  }
}