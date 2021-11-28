import { randomUUID } from 'node:crypto'
import { promisify } from 'node:util'

import test from 'ava'

import { build } from '../src/grpc.js'
import logger from '../src/logger.js'
import pg from '../src/pg.js'

import { getRandomPort, getClients } from './client.js'
import { facebook_application, test_account_id } from './seeds.js'

const app = build()

test.before(async (t) => {
  logger.pauseLogs()
  t.context.port = getRandomPort()

  Object.assign(t.context, getClients(t.context.port))

  await app.start(`0.0.0.0:${t.context.port}`)

  await new Promise((resolve, reject) => {
    t.context.applications.create({ rows: [facebook_application] }, (error) => {
      if (error) reject(error)
      else resolve()
    })
  })
})

test.after(async () => {
  await pg.destroy()
  await app.close()
})

test('findAll should return reviews', async (t) => {
  const { reviews } = t.context
  const findAll = promisify(reviews.findAll).bind(reviews)
  const response = await findAll({ application_ids: [facebook_application.application_id] })

  t.true(Array.isArray(response.rows))
  t.is(response.cursor, null)
})

test('findAll should return empty array on not found', async (t) => {
  const { reviews } = t.context
  const findAll = promisify(reviews.findAll).bind(reviews)
  const response = await findAll({ application_ids: [randomUUID()] })

  t.true(Array.isArray(response.rows))
  t.is(response.cursor, null)
})

test('findVersions should return versions', async (t) => {
  const { reviews } = t.context
  const findVersions = promisify(reviews.findVersions).bind(reviews)
  const response = await findVersions({ application_id: facebook_application.application_id })

  t.true(Array.isArray(response.rows))
})

test('findVersions should throw error on missing application_id', async (t) => {
  const { reviews } = t.context
  const findVersions = promisify(reviews.findVersions).bind(reviews)

  try {
    await findVersions({ application_id: null })
    throw new Error('should not be here')
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.includes('Missing application id'))
  }
})

test('findCountries should return fetched countries', async (t) => {
  const { reviews } = t.context
  const findCountries = promisify(reviews.findCountries).bind(reviews)
  const response = await findCountries({
    account_id: test_account_id,
    application_id: facebook_application.application_id,
  })

  t.truthy(response)
  t.true(Array.isArray(response.rows))
})

test('findCountries should throw an error on invalid account_id', async (t) => {
  const { reviews } = t.context
  const findCountries = promisify(reviews.findCountries).bind(reviews)

  try {
    await findCountries({ account_id: 'ahmet', application_id: null })
    throw new Error('should not be here')
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.includes('Invalid account id'))
  }
})
