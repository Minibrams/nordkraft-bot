import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult,  } from 'express-validator'

/**
 * Ensures that validations pass before the request is handled
 * by a controller endpoint. Any failing validation will intercept
 * and return the response as HTTP 422 Validation Error.
 * @param chain The validations that must pass
 */
export const validate = (...chain: ValidationChain[]): any => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    // Run all the validation checks.
    // If any validation check fails, return the errors
    // with a 422 status code (validation error)
    for (const validation of chain) {
      const result = await validation.run(req)
    }

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() })
      return
    }

    // If we got to here, all validation checks passed
    next()
  }
}