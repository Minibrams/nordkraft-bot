import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, NotModifiedException, UnauthorizedException, ValidationErrorException } from '../exceptions/http.exception'

export const withExceptions = (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
  const original = descriptor.value
  descriptor.value = async function(...args: any[]): Promise<any> {
    try {
      const result = await original.apply(this, args)
      return result
    } catch (err) {
      if (err instanceof NotFoundException) {
        return this.json({ errors: err.errors }, 404)
      } else if (err instanceof UnauthorizedException) {
        return this.json({ errors: err.errors }, 401)
      } else if (err instanceof ForbiddenException) {
        return this.json({ errors: err.errors }, 403)
      } else if (err instanceof ValidationErrorException) {
        return this.json({ errors: err.errors }, 422)
      } else if (err instanceof BadRequestException) {
        return this.json({ errors: err.errors }, 400)
      } else if (err instanceof NotModifiedException) {
        return this.json({ errors: err.errors }, 304)
      } else if (err instanceof ConflictException) {
        return this.json({ errors: err.errors }, 409)
      }

      // Let errors send from other services pass through
      else if (err.response?.data?.errors) {
        return this.json({ errors: err.response.data.errors }, err.response.status)
      }
      // Throw an HTTP 500
      else {
        throw this.internalServerError(err)
      }
    }
  }
}
