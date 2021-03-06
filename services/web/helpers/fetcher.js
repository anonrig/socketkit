import { apiUrl } from 'helpers/config.js'
import qs from 'qs'

export async function fetcher(resource, options = {}) {
  if (options?.qs) {
    if (Object.keys(options.qs).length > 0) {
      resource = `${resource}?${getQueryString(options.qs)}`
    }
    delete options.qs
  }

  return fetch(options.isRoot ? resource : `${apiUrl}/${resource}`, {
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
    },
    ...options,
  }).then(async (res) => {
    const response = await res.json()

    if (res.ok) {
      return response
    }

    throw response
  })
}

export function getQueryString(params = {}) {
  return qs.stringify(params)
}

export function getUrl(resource = '') {
  return `${apiUrl}/${resource}`
}
