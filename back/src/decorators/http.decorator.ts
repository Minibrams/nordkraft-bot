import { ValidationChain } from 'express-validator'
import { Middleware } from 'express-validator/src/base'
import { all, httpDelete, httpGet, httpHead, httpMethod, httpPatch, httpPost, httpPut } from 'inversify-express-utils'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validation.middleware'
import { withExceptions } from './with-exceptions.decorator'

type HttpDecorator = (path: string, ...middlewares: (Middleware | symbol)[]) => MethodDecorator
type EndpointOptions = {
  authenticate?: boolean
  authorizeRoles?: string[]
  validators?: ValidationChain[]
  middlewares?: (Middleware | symbol)[]
}

/**
 * Combines a set of decorators into a combined decorator.
 *
 * @example
 * ```javascript
 * // Instead of this:
   `@`Authenticate()
   `@`AuthorizeRole('ADMIN')
   `@`HttpGet('/admins')
   public async getAdmins() { ... }

   // You can do this:
   export const AdminGet = combineDecorators(Authenticate, AuthorizeRole('ADMIN'), HttpGet('/admins'))

   `@`AdminGet()
   public async getAdmins() { ... }
 * ```
 */
const combineDecorators = (...decorators: MethodDecorator[]) => {
  return function(target: any, key: string, descriptor: PropertyDescriptor): void {
    for (const decorator of decorators) {
      decorator(target, key, descriptor)
    }
  }
}

/**
 * Wraps an inversify-express HTTP handler decorator with a fully configured
 * endpoint decorator with registered middleware. Example:
 * @example
 * ```typescript
 *    const Test = (path: string, options: EndpointOptions) => buildEndpointDecorator()
 *
 *    // Can later be used like this:
 *    `@`Test('/users', { authorizeRoles: [ 'user' ] })
 *    public async getAllUsers() {
 *      ...
 *    }
 * ```
 * @param httpDecorator The inversify-express HTTP decorator to wrap
 * @param path The path of the endpoint, e.g. '/users'
 * @param options The endpoint options to use, if any
 */
const buildEndpointDecorator = (httpDecorator: HttpDecorator, path: string, options?: EndpointOptions): MethodDecorator => {
  if (options === undefined) {
    return combineDecorators(withExceptions, httpDecorator(path))
  }

  const middlewares: (Middleware | symbol)[] = []

  if (options.authenticate || options.authorizeRoles) {
    middlewares.push(authenticate())
  }

  if (options.authorizeRoles) {
    // Add some role-checking middleware
  }

  if (options.validators) {
    middlewares.push(validate(...options.validators))
  }

  if (options.middlewares) {
    middlewares.push(...options.middlewares)
  }

  return combineDecorators(withExceptions, httpDecorator(path, ...middlewares))
}

/**
 * Registers an endpoint handling HTTP GET requests.
 * @param path The relative path of the endpoint, e.g. /users
 * @param options Options for this endpoint.
 *
 * The options include the following:
 * @param options.authenticate If true, all requests without a valid Principal will be rejected with HTTP 401.
 * @param options.authorizeRoles All requests without a valid Principal will be reject with HTTP 401.
 *                    Otherwise, if the Principal user.roles does not contain a role provided in
 *                    options.authorizeRoles, the request is rejected with HTTP 403.
 * @param options.validators A list of ValidationChain objects (from express-validator) to validate the request with.
 * @param options.middlewares A list of any additional middleware functions to run before handling the request.
 *                  The list can contain both standard Middleware functions as well as symbols for injected middleware. */
export const Get = (path: string, options?: EndpointOptions): MethodDecorator => {
  return buildEndpointDecorator(httpGet, path, options)
}

/**
 * Registers an endpoint handling HTTP POST requests.
 * @param path The relative path of the endpoint, e.g. /users
 * @param options Options for this endpoint.
 *
 * The options include the following:
 * @param options.authenticate If true, all requests without a valid Principal will be rejected with HTTP 401.
 * @param options.authorizeRoles All requests without a valid Principal will be reject with HTTP 401.
 *                    Otherwise, if the Principal user.roles does not contain a role provided in
 *                    options.authorizeRoles, the request is rejected with HTTP 403.
 * @param options.validators A list of ValidationChain objects (from express-validator) to validate the request with.
 * @param options.middlewares A list of any additional middleware functions to run before handling the request.
 *                  The list can contain both standard Middleware functions as well as symbols for injected middleware. */
export const Post = (path: string, options?: EndpointOptions): MethodDecorator => {
  return buildEndpointDecorator(httpPost, path, options)
}

/**
 * Registers an endpoint handling HTTP PUT requests.
 * @param path The relative path of the endpoint, e.g. /users
 * @param options Options for this endpoint.
 *
 * The options include the following:
 *   - authenticate: If true, all requests without a valid Principal will be rejected with HTTP 401.
 *   - authorizeRoles: All requests without a valid Principal will be reject with HTTP 401.
 *                    Otherwise, if the Principal user.roles does not contain a role provided in
 *                    options.authorizeRoles, the request is rejected with HTTP 403.
 *   - validators: A list of ValidationChain objects (from express-validator) to validate the request with.
 *   - middlewares: A list of any additional middleware functions to run before handling the request.
 *                  The list can contain both standard Middleware functions as well as symbols for injected middleware. */
export const Put = (path: string, options?: EndpointOptions): MethodDecorator => {
  return buildEndpointDecorator(httpPut, path, options)
}

/**
 * Registers an endpoint handling HTTP PATCH requests.
 * @param path The relative path of the endpoint, e.g. /users
 * @param options Options for this endpoint.
 *
 * The options include the following:
 * @param options.authenticate If true, all requests without a valid Principal will be rejected with HTTP 401.
 * @param options.authorizeRoles All requests without a valid Principal will be reject with HTTP 401.
 *                    Otherwise, if the Principal user.roles does not contain a role provided in
 *                    options.authorizeRoles, the request is rejected with HTTP 403.
 * @param options.validators A list of ValidationChain objects (from express-validator) to validate the request with.
 * @param options.middlewares A list of any additional middleware functions to run before handling the request.
 *                  The list can contain both standard Middleware functions as well as symbols for injected middleware. */
export const Patch = (path: string, options?: EndpointOptions): MethodDecorator => {
  return buildEndpointDecorator(httpPatch, path, options)
}

/**
 * Registers an endpoint handling HTTP HEAD requests.
 * @param path The relative path of the endpoint, e.g. /users
 * @param options Options for this endpoint.
 *
 * The options include the following:
 *   - authenticate: If true, all requests without a valid Principal will be rejected with HTTP 401.
 *   - authorizeRoles: All requests without a valid Principal will be reject with HTTP 401.
 *                    Otherwise, if the Principal user.roles does not contain a role provided in
 *                    options.authorizeRoles, the request is rejected with HTTP 403.
 *   - validators: A list of ValidationChain objects (from express-validator) to validate the request with.
 *   - middlewares: A list of any additional middleware functions to run before handling the request.
 *                  The list can contain both standard Middleware functions as well as symbols for injected middleware. */
export const Head = (path: string, options?: EndpointOptions): MethodDecorator => {
  return buildEndpointDecorator(httpHead, path, options)
}

/**
 * Registers an endpoint handling HTTP DELETE requests.
 * @param path The relative path of the endpoint, e.g. /users
 * @param options Options for this endpoint.
 *
 * The options include the following:
 * @param options.authenticate If true, all requests without a valid Principal will be rejected with HTTP 401.
 * @param options.authorizeRoles All requests without a valid Principal will be reject with HTTP 401.
 *                    Otherwise, if the Principal user.roles does not contain a role provided in
 *                    options.authorizeRoles, the request is rejected with HTTP 403.
 * @param options.validators A list of ValidationChain objects (from express-validator) to validate the request with.
 * @param options.middlewares A list of any additional middleware functions to run before handling the request.
 *                  The list can contain both standard Middleware functions as well as symbols for injected middleware. */
export const Delete = (path: string, options?: EndpointOptions): MethodDecorator => {
  return buildEndpointDecorator(httpDelete, path, options)
}

/**
 * Registers an endpoint handling all HTTP requests.
 * @param path The relative path of the endpoint, e.g. /users
 * @param options Options for this endpoint.
 *
 * The options include the following:
 * @param options.authenticate If true, all requests without a valid Principal will be rejected with HTTP 401.
 * @param options.authorizeRoles All requests without a valid Principal will be reject with HTTP 401.
 *                    Otherwise, if the Principal user.roles does not contain a role provided in
 *                    options.authorizeRoles, the request is rejected with HTTP 403.
 * @param options.validators A list of ValidationChain objects (from express-validator) to validate the request with.
 * @param options.middlewares A list of any additional middleware functions to run before handling the request.
 *                  The list can contain both standard Middleware functions as well as symbols for injected middleware. */
export const All = (path: string, options?: EndpointOptions): MethodDecorator => {
  return buildEndpointDecorator(all, path, options)
}

/**
 * Registers an endpoint handling HTTP requests.
 * @param method The HTTP Method handled by this endpoint.
 * @param path The relative path of the endpoint, e.g. /users
 * @param middlewares All middleware functions to run before entering the endpoint.
 */
export const Method = (method: string, path: string, ...middlewares: (Middleware | symbol)[]): MethodDecorator => {
  return combineDecorators(withExceptions, httpMethod(method as any, path, ...middlewares))
}
