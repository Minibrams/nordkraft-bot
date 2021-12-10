export class LoginInfoDto {
  isLoggedIn: boolean
  info?: {
    profileName: string
    username: string
  }
}