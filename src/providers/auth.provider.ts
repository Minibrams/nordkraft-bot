import express from 'express'
import { interfaces } from 'inversify-express-utils'
import {inject, injectable} from 'inversify'
import { DI } from '../di/symbols'
import {IAuthService} from '../services/auth.service'

export interface IIdentity {
  id: string
  email: string
}

/**
 * Contains the user principal, i.e. all *authenticated*
 * information about a user.
 */
export class Principal implements interfaces.Principal {

  constructor(public details: IIdentity | undefined) { }

  async isAuthenticated(): Promise<boolean> {
    return Promise.resolve(this.details !== undefined)
  }

  getUser(): IIdentity {
    if (this.details === undefined) {
      throw new Error('User is not authenticated.')
    }
    return this.details
  }

  async isResourceOwner(resourceId: any): Promise<boolean> {
    if (this.details === undefined) {
      return Promise.resolve(false)
    }
    throw new Error('Method not implemented.')
  }

  async isInRole(role: string): Promise<boolean> {
    if (this.details === undefined) {
      return Promise.resolve(false)
    }

    throw new Error('Method not implemented.')
  }
}

/**
 * The AuthProvider automatically intercepts all incoming requests
 * and authenticates them if an authentication header is present.
 * If successfully authenticated, a user's information will be
 * available in the principal.
 */
@injectable()
export class AuthProvider implements interfaces.AuthProvider {

  @inject(DI.Services.AuthService) private authService: IAuthService

  async getUser(req: express.Request, res: express.Response, next: express.NextFunction): Promise<interfaces.Principal> {

    const bearerToken = req.headers.authorization

    if (typeof bearerToken !== 'string') {
      return new Principal(undefined)
    }

    const [, jwt] = bearerToken.split(' ')
    const user = await this.authService.getUserByJwt(jwt)

    return Promise.resolve(new Principal(user))
  }
}

