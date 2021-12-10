import { injectable } from 'inversify'
import { IIdentity } from '../providers/principal'

export interface IAuthService {
  /**
   * Returns the user identified by this token if the token is valid.
   * @param jwt The JWT for this request
   */
  getUserByJwt(jwt: string): Promise<IIdentity>
}

@injectable()
export class AuthService implements IAuthService {
  async getUserByJwt(jwt: string): Promise<IIdentity> {
    // Make a request to http://identity-service/user and return it
    await Promise.resolve()
    throw new Error('Method not implemented.')
  }

  async test(): Promise<void> {
    await Promise.resolve()
  }
}
