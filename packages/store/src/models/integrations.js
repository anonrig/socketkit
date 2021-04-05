import _ from 'lodash'
import pg from '../pg.js'
import * as Applications from './applications.js'
import * as AppStore from '../requests/app-store.js'

export async function findAll({ account_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'i.account_id',
      application_id: 'i.application_id',
      application_title: 'avc.title',
      application_icon: 'av.icon',
      country_ids: 'i.country_ids',
    })
    .joinRaw(
      `FROM (${pg
        .queryBuilder()
        .select([
          'account_id',
          'application_id',
          pg.raw('array_agg(country_id) AS country_ids'),
        ])
        .from('integrations')
        .groupBy(['account_id', 'application_id'])
        .toString()}) i`,
    )
    .where({
      'i.account_id': account_id,
    })
    .join('applications AS a', 'a.application_id', 'i.application_id')
    .join('application_releases AS ar', function () {
      this.on('a.application_id', 'ar.application_id').andOn(
        'a.default_country_id',
        'ar.country_id',
      )
    })
    .join('application_version_contents AS avc', function () {
      this.on('a.application_id', 'avc.application_id')
        .andOn('ar.latest_version_number', 'avc.version_number')
        .andOn('ar.default_language_id', 'avc.language_id')
    })
    .join('application_versions AS av', function () {
      this.on('a.application_id', 'av.application_id').andOn(
        'ar.latest_version_number',
        'av.version_number',
      )
    })
}

export async function upsertAll({ account_id, applications }, trx) {
  // @TODO add pg advisory lock on account id

  const currently_tracking = await pg
    .queryBuilder()
    .select(['application_id', 'country_id'])
    .from('integrations')
    .where({ account_id })
    .transacting(trx)
    .forUpdate()

  const removed_applications = _.differenceWith(
    currently_tracking,
    applications,
    (t, a) =>
      t.application_id === a.application_id &&
      a.country_ids.includes(t.country_id),
  )

  if (removed_applications.length) {
    await Promise.all(
      removed_applications.map((removed) =>
        pg
          .queryBuilder()
          .where({
            account_id,
            country_id: removed.country_id,
            application_id: removed.application_id,
          })
          .from('integrations')
          .delete()
          .transacting(trx),
      ),
    )
  }

  const existing = await pg
    .queryBuilder()
    .select('application_id')
    .from('applications')
    .where({ default_country_id: 'us' })
    .whereIn(
      'application_id',
      applications.map((a) => a.application_id),
    )
    .transacting(trx)
    .forUpdate()

  const new_applications = _.differenceWith(
    applications,
    existing,
    (n, e) => n.application_id === e.application_id,
  )
  const scraped_apps = await Promise.all(
    new_applications.map((app) =>
      AppStore.scrapeApp(app.application_id, 'us', 'EN'),
    ),
  )

  const normalized = scraped_apps.filter((a) => !!a)

  if (normalized.length) {
    await Applications.create(trx, normalized)
  }

  const flat_applications = applications
    .map((a) =>
      a.country_ids.map((c) => ({
        application_id: a.application_id,
        country_id: c,
      })),
    )
    .flat()

  if (flat_applications.length) {
    await pg
      .queryBuilder()
      .insert(flat_applications)
      .into('reviews_watchlist')
      .onConflict(['application_id', 'country_id'])
      .ignore()
      .transacting(trx)

    await pg
      .queryBuilder()
      .insert(flat_applications.map((f) => ({ ...f, account_id })))
      .into('integrations')
      .onConflict(['application_id', 'account_id', 'country_id'])
      .ignore()
      .transacting(trx)
  }

  return {}
}
