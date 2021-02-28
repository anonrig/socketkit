import scraper from 'app-store-scraper'

export default function scrape(apps_to_be_scraped) {
  return Promise.all(
    apps_to_be_scraped.map(async (a) => ({
      application_id: a.application_id,
      default_country_id: a.default_country_id,
      detail: await scraper.app({
        id: a.application_id,
        country: a.default_country_id,
        ratings: true,
      }),
    })),
  )
}
