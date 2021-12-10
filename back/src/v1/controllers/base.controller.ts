import {BaseHttpController, interfaces} from 'inversify-express-utils'

export type HttpResult = interfaces.IHttpActionResult | Error
export type HttpResponse<T = unknown> = {
  errors?: string[]
  data?: T
}


export class BaseController extends BaseHttpController {

  accepted<T extends HttpResponse>(body: T): HttpResult {
    return this.json(body, 201)
  }

  noContent<T extends HttpResponse>(body: T): HttpResult {
    return this.json(body, 204)
  }

  unauthorized<T extends HttpResponse>(body: T): HttpResult {
    return this.json(body, 401)
  }

  forbidden<T extends HttpResponse>(body: T): HttpResult {
    return this.json(body, 403)
  }

  /**
   * Returns the body with a 422 status code (unprocessable entity).
   * This seems to be more or less standard for validation errors.
   */
  validationError<T extends HttpResponse>(body: T): HttpResult {
    return this.json(body, 422)
  }
}