/* eslint-disable security/detect-object-injection */
import { promisify } from 'util'

export function promisifyAll(subscriber) {
  const to = {}
  for (var k in subscriber) {
    if (typeof subscriber[k] != 'function') continue
    to[k] = promisify(subscriber[k].bind(subscriber))
  }
  return to
}

export function parseDuration(input) {
  let output = {}
  let value = null
  for (const elem of input.split(' ')) {
    if (value === null) {
      value = parseInt(elem)
    } else {
      output[elem] = value
      value = null
    }
  }

  return output
}
