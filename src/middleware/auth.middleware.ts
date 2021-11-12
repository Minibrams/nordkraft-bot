
import express from 'express'
import { injectable } from 'inversify'
import { BaseMiddleware } from 'inversify-express-utils'
import { DI } from '../di/symbols'

/**
 * The Base AuthMiddleware class.
 * The middleware simply intercepts incoming requests
 * and ensures that the AuthProvider has set the httpContext.user
 * correctly. If this is not the case, the user is not authenticated
 * and the request is intercepted and returned as 401.
 */
@injectable()
export class AuthMiddleware extends BaseMiddleware {
  public async handler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> {
    if (!await this.httpContext.user.isAuthenticated()) {
      res.status(401).json({ errors: [ 'User is not authenticated.' ] })
    } else {
      next()
    }
  }
}

/**
 * Protects controller endpoints from unauthenticated access.
 * Request that do not contain valid and authentic JWT headers
 * will be intercepted and returned as HTTP 401 Unauthorized.
 * Requests with valid authentication headers are guaranteed
 * to contain a valid principle.
 */
export const authenticate = (): symbol => DI.Middleware.AuthMiddleware