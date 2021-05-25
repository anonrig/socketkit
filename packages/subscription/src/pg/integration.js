import grpc from '@grpc/grpc-js'
import { validate } from 'uuid'

import { ISODate } from '../types.js'
import pg from './index.js'

export async function create({
  account_id,
  provider_id,
  access_token,
  vendor_ids,
}) {
  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  return pg
    .queryBuilder()
    .insert({
      last_fetch: ISODate.today().subtract(9, 'month'),
      account_id,
      provider_id,
      access_token,
      vendor_ids,
      last_error_message: null,
    })
    .into('integrations')
    .onConflict(['account_id', 'provider_id'])
    .ignore()
}

export async function update({
  account_id,
  provider_id,
  access_token = null,
  state = null,
}) {
  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  const attributes = new Map()

  if (access_token) attributes.set('access_token', access_token)
  if (state) attributes.set('state', state)

  if (attributes.size === 0) {
    const error = new Error(`No value to update in integration`)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  return pg
    .queryBuilder()
    .update(Object.fromEntries(attributes))
    .where({ account_id, provider_id })
    .from('integrations')
    .onConflict(['account_id'])
    .ignore()
}

export async function destroy({ account_id, provider_id }) {
  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  return pg
    .queryBuilder()
    .update({
      state: 'to_be_deleted',
      last_error_message: 'Deleting integration',
    })
    .from('integrations')
    .where({ account_id, provider_id })
    .onConflict(['account_id', 'provider_id'])
    .ignore()
}

export async function findOne({ account_id, provider_id }) {
  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  return pg
    .queryBuilder()
    .select('*')
    .from('integrations')
    .where({ account_id, provider_id })
    .first()
}

export async function findAll({ account_id }) {
  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  return pg
    .queryBuilder()
    .select({
      state: 'state',
      failed_fetches: 'failed_fetches',
      last_fetch: 'last_fetch',
      account_id: 'account_id',
      provider_id: 'provider_id',
      access_token: 'access_token',
      vendor_ids: 'vendor_ids',
      last_error_message: 'last_error_message',
    })
    .from('integrations')
    .where({ account_id })
}

export async function getTotalRevenue({ account_id, for_date }) {
  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  return pg
    .queryBuilder()
    .sum('total_revenue', { as: 'total' })
    .from('revenues')
    .where({ account_id, for_date, is_valid: true })
}
