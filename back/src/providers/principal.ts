import { interfaces } from 'inversify-express-utils'

export interface IIdentity {
  id: string
  email: string
}

/**
 * Contains the authenticated information - if any - for
 * the user who made the request.
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