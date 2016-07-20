import { ServiceError } from './Errors'

export function check(b: boolean, errorMessage?: string) {
  if (!b) throw new ServiceError(errorMessage)
}

export function checkNotNull(obj: any, errorMessage?: string) {
  if (typeof obj === 'undefined' || obj == null)
    throw new ServiceError(errorMessage)
}
