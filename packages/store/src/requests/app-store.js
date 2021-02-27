import scraper from 'app-store-scraper'

export default function scrape(apps_to_be_scraped) {
  return Promise.all(
    apps_to_be_scraped
      .map(async (a) => {
        let detail = null

        try {
          detail = await scraper.app({
            id: a.application_id,
            country: a.default_country_id,
            language: a.default_language_id,
            ratings: true,
          })
        } catch (error) {
          if (!error.message?.includes('404')) {
            throw error
          }
        }

        if (detail === null) return null

        return {
          application_id: a.application_id,
          default_country_id: a.default_country_id,
          default_language_id: a.default_language_id,
          detail,
        }
      })
      .filter(Boolean),
  )
}
