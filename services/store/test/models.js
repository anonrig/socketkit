import { promisify } from 'util'

import * as Applications from '../src/models/applications.js'
import pg from '../src/pg.js'

import { getClients } from './client.js'

export function createApplication(application_id, port) {
  const clients = getClients(port)
  const create = promisify(clients.applications.create).bind(clients.applications)
  return create({
    rows: [
      {
        application_id,
        default_country_id: 'us',
        default_language_id: 'EN',
      },
    ],
  })
}

export function getApplication(application_id) {
  return Applications.findAll({ application_ids: [application_id] }).first()
}

export function deleteApplication(application_id) {
  return pg.transaction(async (trx) => Applications.destroy(application_id, trx))
}
