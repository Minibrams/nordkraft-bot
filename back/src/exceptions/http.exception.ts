import { ValidationError } from 'express-validator'

export abstract class BaseHttpException extends Error {
  constructor(public errors: (string | ValidationError)[]) {
    super(JSON.stringify(errors))
  }
}

export class NotFoundException extends BaseHttpException { constructor(errors?: (string | ValidationError)[]) { super(errors ?? ['The resource is does not exist.']) } }
export class UnauthorizedException extends BaseHttpException { constructor(errors?: (string | ValidationError)[]) { super(errors ?? ['The user is not authorized.']) } }
export class ForbiddenException extends BaseHttpException { constructor(errors?: (string | ValidationError)[]) { super(errors ?? ['You do not have permission to access this resource.']) } }
export class ValidationErrorException extends BaseHttpException { constructor(errors?: (string | ValidationError)[]) { super(errors ?? ['Invalid request.']) } }
export class BadRequestException extends BaseHttpException { constructor(errors?: (string | ValidationError)[]) { super(errors ?? ['Bad request.']) } }
export class NotModifiedException extends BaseHttpException { constructor(errors?: (string | ValidationError)[]) { super(errors ?? ['Not modified.']) } }
export class ConflictException extends BaseHttpException { constructor(errors?: (string | ValidationError)[]) { super(errors ?? ['Conflict.']) } }
