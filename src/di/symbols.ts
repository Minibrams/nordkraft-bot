

export const DI = {
  Services: {
    AuthService: Symbol.for('AuthService'),
    ChromeService: Symbol.for('ChromeService'),
    ReservationService: Symbol.for('ReservationService'),
    NordkraftService: Symbol.for('NordkraftService')
  },

  Repositories: {
    ReservationRepository: Symbol.for('ReservationRepository'),
  },

  Middleware: {
    AuthMiddleware: Symbol.for('AuthMiddleware')
  }
}