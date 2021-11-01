import test from 'ava'

import { build } from '../src/grpc.js'
import logger from '../src/logger.js'
import pg from '../src/pg.js'

import { getRandomPort, getClients } from './client.js'
import {
  facebook_application,
  test_account_id,
  test_application_id,
} from './seeds.js'

const app = build()

test.before(async (t) => {
  logger.pauseLogs()
  t.context.port = getRandomPort()

  Object.assign(t.context, getClients(t.context.port))

  await app.start(`0.0.0.0:${t.context.port}`)
})

test.after(async () => {
  await pg.destroy()
  await app.close()
})

test.cb('Applications.search should return valid applications', (t) => {
  t.context.applications.search({ text: 'facebook ' }, (error, response) => {
    t.falsy(error)
    t.is(typeof response, 'object')
    t.truthy(Array.isArray(response.rows))
    response.rows.forEach((row) => {
      t.truthy(row.application_id.length)
      t.truthy(row.bundle_id.length)
      t.truthy(row.application_title.length)
      t.truthy(row.application_icon.length)
    })
    t.end()
  })
})

test.cb('Applications.create should create an application', (t) => {
  t.context.applications.create(
    { rows: [facebook_application] },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)

      t.context.applications.findAll(
        { application_ids: [facebook_application.application_id] },
        (error, response) => {
          t.falsy(error)
          t.is(
            response.rows[0].application_id,
            facebook_application.application_id,
          )

          t.end()
        },
      )
    },
  )
})

test.cb('Applications.findAll should find by application_ids', (t) => {
  t.context.applications.findAll(
    { application_ids: ['284882215'] },
    (error, response) => {
      t.falsy(error)
      t.is(typeof response, 'object')
      t.is(Array.isArray(response.rows), true)
      t.is(response.rows.length, 1)

      response.rows.forEach((row) => {
        t.is(row.application_id, '284882215')
        t.is(row.bundle_id, 'com.facebook.Facebook')
      })

      t.end()
    },
  )
})

test.cb('Applications.findAll should find by bundle_ids', (t) => {
  t.context.applications.findAll(
    { bundle_ids: ['com.facebook.Facebook'] },
    (error, response) => {
      t.falsy(error)
      t.is(Array.isArray(response.rows), true)
      t.is(response.rows.length, 1)
      t.is(response.rows[0].application_id, '284882215')
      t.end()
    },
  )
})

test.cb('Applications.findAll should find by developer_ids', (t) => {
  t.context.applications.findAll(
    { developer_ids: ['284882218'] },
    (error, response) => {
      t.falsy(error)
      t.is(Array.isArray(response.rows), true)
      t.is(response.rows.length, 1)
      t.is(response.rows[0].application_id, '284882215')
      t.end()
    },
  )
})

test.cb('Applications.findAll should return empty if input is invalid', (t) => {
  t.context.applications.findAll(
    { application_ids: [], bundle_ids: [], developer_ids: [] },
    (error, response) => {
      t.falsy(error)
      t.is(Array.isArray(response.rows), true)
      t.is(response.rows.length, 0)
      t.end()
    },
  )
})

test.cb('Applications.findOne should return valid application', (t) => {
  t.context.applications.findOne(
    { application_id: '284882215' },
    (error, response) => {
      t.falsy(error)
      t.is(response.row.application_id, '284882215')
      t.end()
    },
  )
})

test.cb(
  'Applications.findOne should validate missing application_id and bundle_id',
  (t) => {
    t.context.applications.findOne(
      { application_id: null, bundle_id: null },
      (error) => {
        t.truthy(error)
        t.truthy(
          error.message.includes('Missing conditions on Applications.findOne'),
        )
        t.end()
      },
    )
  },
)

test.cb('Applications.findOne should return null on not found', (t) => {
  t.context.applications.findOne(
    { application_id: '1234512345' },
    (error, response) => {
      t.falsy(error)
      t.deepEqual(response, { row: null })
      t.end()
    },
  )
})

test.cb('Applications.findVersions should return available versions', (t) => {
  t.context.applications.findVersions(
    { application_id: '284882215' },
    (error, response) => {
      t.falsy(error)
      t.is(Array.isArray(response.rows), true)
      response.rows.forEach((version) => {
        t.truthy(version.version)
        t.truthy(version.released_at)
      })
      t.end()
    },
  )
})

test.cb(
  'findVersions should throw error on missing application_id and bundle_id',
  (t) => {
    t.context.applications.findVersions(
      { application_id: null, bundle_id: null },
      (error) => {
        t.truthy(error)
        t.truthy(
          error.message.includes(
            'Missing conditions on Applications.findVersions',
          ),
        )
        t.end()
      },
    )
  },
)

test.cb(
  'Applications.findVersions should return empty array on not found',
  (t) => {
    t.context.applications.findVersions(
      { application_id: '1234512345' },
      (error, response) => {
        t.falsy(error)
        t.is(Array.isArray(response.rows), true)
        t.is(response.rows.length, 0)
        t.end()
      },
    )
  },
)

test.cb('Applications.findVersion should return available version', (t) => {
  t.context.applications.findVersions(
    { application_id: facebook_application.application_id },
    (error, response) => {
      t.falsy(error)
      t.context.applications.findVersion(
        {
          application_id: facebook_application.application_id,
          version: response.rows[0].version,
        },
        (error, response) => {
          t.falsy(error)
          t.is(response.row.application_id, facebook_application.application_id)
          t.end()
        },
      )
    },
  )
})

test.cb(
  'findVersion should throw error on missing application_id and bundle_id',
  (t) => {
    t.context.applications.findVersion(
      { application_id: null, version: '311.0' },
      (error) => {
        t.truthy(error)
        t.truthy(
          error.message.includes(
            'Missing conditions on Applications.findVersion',
          ),
        )
        t.end()
      },
    )
  },
)

test.cb('Applications.findVersion should return null if not founded', (t) => {
  t.context.applications.findVersion(
    { application_id: '284882215', version: '0.0' },
    (error, response) => {
      t.falsy(error)
      t.is(response.row, null)
      t.end()
    },
  )
})

test.cb('Reviews.findAll should return reviews', (t) => {
  t.context.reviews.findAll(
    { application_ids: ['284882215'] },
    (error, response) => {
      t.falsy(error)
      t.truthy(response.rows)
      t.is(Array.isArray(response.rows), true)
      response.rows.forEach((version) => {
        t.is(version.application_id, '284882215')
      })
      t.end()
    },
  )
})

test.cb('Reviews.findAll should return empty array on not found', (t) => {
  t.context.reviews.findAll(
    { application_ids: ['123123123123'] },
    (error, response) => {
      t.falsy(error)
      t.is(typeof response, 'object')
      t.truthy(Array.isArray(response.rows))
      t.is(response.rows.length, 0)
      t.end()
    },
  )
})

test.cb('Reviews.findVersions should return versions', (t) => {
  t.context.reviews.findVersions(
    { application_id: '284882215' },
    (error, response) => {
      t.falsy(error)
      t.is(typeof response, 'object')
      t.truthy(Array.isArray(response.rows))
      response.rows.forEach((row) => {
        t.truthy(row.version.length)
      })
      t.end()
    },
  )
})

test.cb(
  'Reviews.findVersions should throw error on missing application_id',
  (t) => {
    t.context.reviews.findVersions({ application_id: null }, (error) => {
      t.truthy(error)
      t.truthy(error.message.includes('Missing application id'))
      t.end()
    })
  },
)

test.cb('Reviews.findCountries should return fetched countries', (t) => {
  t.context.reviews.findCountries(
    { account_id: test_account_id, application_id: '284882215' },
    (error, response) => {
      t.falsy(error)
      t.is(typeof response, 'object')
      t.end()
    },
  )
})

test.cb(
  'Reviews.findCountries should throw an error on invalid account_id',
  (t) => {
    t.context.reviews.findCountries(
      { account_id: 'ahmet', application_id: null },
      (error) => {
        t.truthy(error)
        t.truthy(error.message.includes('Invalid account id'))
        t.end()
      },
    )
  },
)

test.cb('Integrations.findAll should return available integrations', (t) => {
  t.context.integrations.findAll(
    {
      account_id: test_account_id,
    },
    (error, response) => {
      t.falsy(error)
      t.truthy(response)
      t.is(Array.isArray(response.rows), true)
      response.rows.forEach((integration) => {
        t.is(integration.account_id, test_account_id)
        t.truthy(integration.application_title)
        t.truthy(integration.application_icon)
      })
      t.end()
    },
  )
})

test.cb('Integrations.findAll should validate account_id', (t) => {
  t.context.integrations.findAll(
    {
      account_id: 'ahmet',
    },
    (error) => {
      t.truthy(error)
      t.truthy(error.message.includes('Invalid account id'))
      t.end()
    },
  )
})

// test.cb('Integrations.upsertAll should insert properly', (t) => {
//   t.context.integrations.upsertAll(
//     {
//       account_id: test_account_id,
//       applications: [
//         { application_id: test_application_id, country_ids: ['us'] },
//       ],
//     },
//     (error, response) => {
//       t.falsy(error)
//       t.truthy(response)
//       t.end()
//     },
//   )
// })

test.cb('Integrations.upsertAll should validate account_id', (t) => {
  t.context.integrations.upsertAll(
    {
      account_id: 'ahmet',
    },
    (error) => {
      t.truthy(error)
      t.truthy(error.message.includes('Invalid account id'))
      t.end()
    },
  )
})
