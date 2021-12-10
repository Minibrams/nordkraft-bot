import { c } from './container'
import { DI } from './symbols'
import { AuthMiddleware } from '../middleware/auth.middleware'
import { BaseMiddleware } from 'inversify-express-utils'
import { AuthService, IAuthService } from '../services/auth.service'
import { ChromeService, IChromeService } from '../services/chrome.service'
import { IReservationRepository, ReservationRepository } from '../repositories/reservation.repository'
import { INordkraftService, NordkraftService } from '../services/nordkraft.service'
import { IReservationService, ReservationService } from '../services/reservation.service'


// Services
c.bind<IAuthService>(DI.Services.AuthService).to(AuthService)
c.bind<IChromeService>(DI.Services.ChromeService).to(ChromeService).inSingletonScope()
c.bind<INordkraftService>(DI.Services.NordkraftService).to(NordkraftService)
c.bind<IReservationService>(DI.Services.ReservationService).to(ReservationService)

// Repositories
c.bind<IReservationRepository>(DI.Repositories.ReservationRepository).to(ReservationRepository)

// Middleware
c.bind<BaseMiddleware>(DI.Middleware.AuthMiddleware).to(AuthMiddleware)

export const container = c
