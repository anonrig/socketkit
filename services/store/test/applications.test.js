import { randomUUID } from 'node:crypto'
import { promisify } from 'node:util'

import test from 'ava'

import { build } from '../src/grpc.js'
import pg from '../src/pg.js'

import { getRandomPort, getClients } from './client.js'
import { facebook_application } from './seeds.js'

const app = build()

test.before(async (t) => {
  const port = getRandomPort()
  Object.assign(t.context, getClients(port))

  await app.start(`0.0.0.0:${port}`)

  await promisify(t.context.applications.create).bind(t.context.applications)({
    rows: [facebook_application],
  })
})

test.after(async () => {
  await pg.destroy()
  await app.close()
})

test('search should return valid applications', async (t) => {
  const { applications } = t.context
  const search = promisify(applications.search).bind(applications)
  const response = await search({ text: 'facebook' })

  t.true(Array.isArray(response.rows))

  const app = response.rows.find((r) => r.application_id === facebook_application.application_id)
  t.truthy(app)
  t.is(app.application_id, facebook_application.application_id)
  t.truthy(app.bundle_id)
  t.truthy(app.application_title)
  t.truthy(app.application_icon)
})

test('create should create an application', async (t) => {
  const { applications } = t.context
  const create = promisify(applications.create).bind(applications)
  const response = await create({
    application_id: facebook_application.application_id,
    default_country_id: 'US',
    default_language_id: 'EN',
  })

  t.deepEqual(response, {})
})

test('findAll should find by application_ids', async (t) => {
  const { applications } = t.context
  const findAll = promisify(applications.findAll).bind(applications)
  const response = await findAll({ application_ids: [facebook_application.application_id] })

  t.true(Array.isArray(response.rows))

  const app = response.rows.find((r) => r.application_id === facebook_application.application_id)
  t.truthy(app)
  t.is(app.bundle_id, facebook_application.bundle_id)
})

test('findAll should find by bundle_ids', async (t) => {
  const { applications } = t.context
  const findAll = promisify(applications.findAll).bind(applications)
  const response = await findAll({ bundle_ids: [facebook_application.bundle_id] })

  t.true(Array.isArray(response.rows))

  const app = response.rows.find((r) => r.bundle_id === facebook_application.bundle_id)
  t.truthy(app)
  t.is(app.bundle_id, facebook_application.bundle_id)
})

test('findAll should find by developer_ids', async (t) => {
  const { applications } = t.context
  const findAll = promisify(applications.findAll).bind(applications)
  const response = await findAll({ developer_ids: [facebook_application.developer_id] })

  t.true(Array.isArray(response.rows))

  const app = response.rows.find((r) => r.developer_id === facebook_application.developer_id)
  t.truthy(app)
  t.is(app.bundle_id, facebook_application.bundle_id)
})

test('findAll should return empty if input is invalid', async (t) => {
  const { applications } = t.context
  const findAll = promisify(applications.findAll).bind(applications)
  const response = await findAll({ application_ids: [], bundle_ids: [], developer_ids: [] })

  t.true(Array.isArray(response.rows))
  t.is(response.rows.length, 0)
})

test('findOne should return valid application', async (t) => {
  const { applications } = t.context
  const findOne = promisify(applications.findOne).bind(applications)
  const response = await findOne({ application_id: facebook_application.application_id })

  t.truthy(response.row)
  t.is(response.row.application_id, facebook_application.application_id)
})

test('findOne should validate missing application_id and bundle_id', async (t) => {
  const { applications } = t.context
  const findOne = promisify(applications.findOne).bind(applications)

  try {
    await findOne({ application_id: null, bundle_id: null })
    throw new Error('should not be here')
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.includes('Missing conditions on Applications.findOne'))
  }
})

test('findOne should return null on not found', async (t) => {
  const { applications } = t.context
  const findOne = promisify(applications.findOne).bind(applications)
  const response = await findOne({ application_id: randomUUID() })

  t.deepEqual(response, { row: null })
})

test('findVersions should return available versions', async (t) => {
  const { applications } = t.context
  const findVersions = promisify(applications.findVersions).bind(applications)
  const response = await findVersions({ application_id: facebook_application.application_id })

  t.true(Array.isArray(response.rows))
  t.true(response.rows.length > 0)

  response.rows.forEach((version) => {
    t.truthy(version.version)
    t.truthy(version.released_at)
  })
})

test('findVersions should throw error on missing application_id and bundle_id', async (t) => {
  const { applications } = t.context
  const findVersions = promisify(applications.findVersions).bind(applications)

  try {
    await findVersions({ application_id: null, bundle_id: null })
    throw new Error('should not be here')
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.includes('Missing conditions on Applications.findVersions'))
  }
})

test('findVersions should return empty array on not found', async (t) => {
  const { applications } = t.context
  const findVersions = promisify(applications.findVersions).bind(applications)
  const response = await findVersions({ application_id: randomUUID() })

  t.deepEqual(response, { rows: [] })
})

test('findVersion should return available version', async (t) => {
  const { applications } = t.context
  const findVersions = promisify(applications.findVersions).bind(applications)
  const findVersion = promisify(applications.findVersion).bind(applications)

  const versions = await findVersions({ application_id: facebook_application.application_id })
  const existing_version = versions.rows[0].version

  t.truthy(existing_version)

  const version = await findVersion({
    application_id: facebook_application.application_id,
    version: existing_version,
  })

  t.truthy(version.row)
  t.is(version.row.application_id, facebook_application.application_id)
})

test('findVersion should throw error on missing application_id and bundle_id', async (t) => {
  const { applications } = t.context
  const findVersion = promisify(applications.findVersion).bind(applications)

  try {
    await findVersion({ application_id: null, version: '311.0' })
    throw new Error('should not be here')
  } catch (error) {
    t.not(error.message, 'should not be here')
    t.true(error.message.includes('Missing conditions on Applications.findVersion'))
  }
})

test('findVersion should return null if not founded', async (t) => {
  const { applications } = t.context
  const findVersion = promisify(applications.findVersion).bind(applications)
  const response = await findVersion({
    application_id: facebook_application.application_id,
    version: '0.0',
  })

  t.deepEqual(response, { row: null })
})
