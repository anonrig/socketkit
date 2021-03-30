import dayjs from 'dayjs'
import pg from '../pg.js'
import * as AppStore from '../requests/app-store.js'
import * as Applications from '../models/applications.js'
import * as Reviews from '../models/reviews.js'
import logger from '../logger.js'
import { country_ids } from '../fixtures.js'

export default function fetchApplications(limit) {
  return pg.transaction(async (trx) => {
    const applications = await pg
      .queryBuilder()
      .select([
        'a.application_id',
        'a.default_country_id',
        'ar.default_language_id',
      ])
      .from('applications AS a')
      .limit(limit)
      .join('application_releases AS ar', function () {
        this.on('a.application_id', 'ar.application_id').andOn(
          'a.default_country_id',
          'ar.country_id',
        )
      })
      .where('a.last_fetch', '<', dayjs().subtract(24, 'hour'))
      .forUpdate()
      .skipLocked()
      .transacting(trx)

    logger.info(`Found ${applications.length} applications available`)

    if (applications.length === 0) {
      logger.warn(`Couldn't find any application to scrape`)
      return 0
    }

    const scraped_apps = await Promise.all(
      country_ids
        .map((country) =>
          applications.map((app) =>
            AppStore.scrapeApp(
              app.application_id,
              country,
              app.default_language_id,
            ),
          ),
        )
        .flat(),
    )

    if (scraped_apps.length !== 0) {
      await Applications.upsert(scraped_apps, trx)
    }

    await Promise.all(
      applications.map((a) =>
        Reviews.create(
          {
            application_id: a.application_id,
            country_id: a.default_country_id,
            page: 1,
          },
          trx,
        ),
      ),
    )

    return applications.length
  })
}
