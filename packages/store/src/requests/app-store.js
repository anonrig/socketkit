import scraper from 'appstore-sensor'
import { country_ids } from '../fixtures.js'

export async function scrape(applications, country_id = null) {
  const scraped_applications = await Promise.all(
    applications.map(async (a) => {
      let detail = null

      try {
        detail = await scraper.app({
          id: a.application_id,
          country: country_id || a.default_country_id,
          language: a.default_language_id,
          include_ratings: true,
        })
      } catch (error) {
        if (!error.message?.includes('not found')) {
          throw error
        }
      }

      if (detail === null) return null

      return {
        application_id: a.application_id,
        country_id,
        default_country_id: a.default_country_id,
        default_language_id: a.default_language_id,
        detail,
      }
    }),
  )

  return scraped_applications.filter((a) => !!a)
}

export async function scrapeAll(applications) {
  const nested = await Promise.all(
    country_ids.map((country) => scrape(applications, country)),
  )

  return nested.flat()
}
