process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

export async function fetcher(resource, options = {}) {
  if (options?.qs) {
    resource = `${resource}?${getQueryString(options.qs)}`
    delete options.qs
  }

  return fetch(options.isRoot ? resource : `${process.env.NEXT_PUBLIC_API_URL}/${resource}`, {
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

export function getQueryString(params) {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}
