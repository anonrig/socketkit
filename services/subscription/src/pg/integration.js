import grpc from '@grpc/grpc-js'
import { validate } from 'uuid'

import { ISODate } from '../types.js'

import pg from './index.js'

export async function create({ account_id, provider_id, access_token, vendor_ids }) {
  if (!validate(account_id)) {
    const error = new Error('Invalid account id')
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  return pg
    .queryBuilder()
    .insert({
      access_token,
      account_id,
      last_error_message: null,
      last_fetch: ISODate.today().subtract(9, 'month'),
      provider_id,
      vendor_ids,
    })
    .into('integrations')
    .onConflict(['account_id', 'provider_id'])
    .ignore()
}

export async function update({ account_id, provider_id, access_token = null, state = null }) {
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
      last_error_message: 'Deleting integration',
      state: 'to_be_deleted',
    })
    .from('integrations')
    .where({ account_id, provider_id })
    .onConflict(['account_id', 'provider_id'])
    .ignore()
}

export async function findOne({ account_id, provider_id = 'apple' }) {
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
      access_token: 'access_token',
      account_id: 'account_id',
      failed_fetches: 'failed_fetches',
      last_error_message: 'last_error_message',
      last_fetch: 'last_fetch',
      provider_id: 'provider_id',
      state: 'state',
      vendor_ids: 'vendor_ids',
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
    .first()
}
