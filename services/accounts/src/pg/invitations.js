import grpc from '@grpc/grpc-js'
import pg from './index.js'

export async function findAll({ email, account_id }) {
  if (!email && !account_id) {
    const error = new Error(
      `Both email and account_id is missing from Invitations.findAll`,
    )
    error.code = grpc.status.INVALID_ARGUMENT
    throw error
  }

  return pg
    .queryBuilder()
    .select({
      account_id: 'i.account_id',
      account_name: 'a.name',
      email: 'i.email',
      invited_at: 'i.invited_at',
    })
    .from('invitations AS i')
    .join('accounts AS a', 'a.account_id', 'i.account_id')
    .where(function () {
      if (email) {
        this.where('i.email', email)
      }

      if (account_id) {
        this.where('i.account_id', account_id)
      }
    })
}

export async function create(payload, trx) {
  return pg
    .queryBuilder()
    .insert(payload)
    .into('invitations')
    .transacting(trx)
    .onConflict(['account_id', 'email'])
    .ignore()
}

export async function accept({ identity_id, account_id, email }, trx) {
  const invitation = await pg
    .queryBuilder()
    .select('*')
    .from('invitations')
    .where({ account_id, email })
    .transacting(trx)
    .forUpdate()
    .first()

  if (!invitation) {
    const error = new Error(`Invitation not found`)
    error.code = grpc.status.NOT_FOUND
    throw error
  }

  await pg
    .queryBuilder()
    .delete()
    .from('invitations')
    .where({ account_id, email })
    .transacting(trx)

  await pg
    .queryBuilder()
    .insert({ account_id, identity_id })
    .into('memberships')
    .transacting(trx)
}

export async function reject({ account_id, email }, trx) {
  await pg
    .queryBuilder()
    .delete()
    .from('invitations')
    .where({ account_id, email })
    .transacting(trx)
}
