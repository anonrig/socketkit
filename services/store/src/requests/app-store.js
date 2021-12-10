import scraper from 'appstore-sensor'
import tunnel from 'tunnel'

import config from '../config.js'
import logger from '../logger.js'

const extraOptions = config.isProxyEnabled
  ? {
      agent: {
        https: tunnel.httpsOverHttp({
          proxy: config.proxy,
        }),
      },
    }
  : {}

export async function search(term, country = 'US') {
  return scraper.search(
    { country, term },
    Object.assign({}, { timeout: { request: 5000 } }, extraOptions),
  )
}

export async function scrapeApp(application_id, country_id, language) {
  let detail = null

  try {
    detail = await scraper.app(
      {
        country: country_id,
        id: application_id,
        language,
      },
      Object.assign({}, { timeout: { request: 5000 } }, extraOptions),
    )
  } catch (error) {
    if (!error.message?.includes('not found') && !error.message?.includes('Bad Request')) {
      logger.debug(
        `Received ${error.message} on application_id=${application_id}, country_id=${country_id} and language=${language}`,
      )
      throw error
    }
  }

  if (detail === null) {
    return null
  }

  return {
    application_id,
    country_id,
    default_country_id: country_id,
    default_language_id: language,
    detail,
  }
}

export async function scrapeReviews(application_id, country_id, page) {
  const reviews = await scraper.reviews(
    {
      country: country_id,
      id: application_id,
      page,
      sort: 'mostRecent',
    },
    Object.assign({}, { timeout: 5000 }, extraOptions),
  )

  return reviews
}
