import 'reflect-metadata'

import { controller, queryParam } from 'inversify-express-utils'
import { BaseController, HttpResponse } from './base.controller'
import { Get, Post } from '../../decorators/http.decorator'
import { inject } from 'inversify'
import { DI } from '../../di/symbols'
import { IReservationService } from '../../services/reservation.service'
import { ReservationDto } from '../dtos/reservation.dto'
import { INordkraftService } from '../../services/nordkraft.service'
import { environment } from '../../environment'
import { LoginInfoDto } from '../dtos/loginInfo.dto'

@controller('/v1/reservations')
export class ReservationController extends BaseController {

  @inject(DI.Services.ReservationService) private reservationService: IReservationService
  @inject(DI.Services.NordkraftService) private nordkraftService: INordkraftService

  @Get('/')
  async healthCheck(): Promise<HttpResponse<ReservationDto[]>> {
    return { data: await this.reservationService.getAllReservations() }
  }

  @Get('/login')
  async isLoggedIn(): Promise<HttpResponse<LoginInfoDto>> {
    return { data: await this.nordkraftService.getLoginInfo() }
  }

  @Post('/login')
  async login(): Promise<HttpResponse<boolean>> {
    return { data: await this.nordkraftService.login(environment.NORDKRAFT_USERNAME, environment.NORDKRAFT_PASSWORD) }
  }

  @Post('/reserve')
  async reserve(@queryParam('url') url: string): Promise<HttpResponse<ReservationDto | undefined>> {
    return { data: await this.nordkraftService.makeReservation(url) }
  }

}