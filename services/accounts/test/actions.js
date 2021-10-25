import { randomUUID } from 'crypto'
import faker from 'faker'
import pg from '../src/pg/index.js'
import * as AccountModel from '../src/pg/accounts.js'

export async function createAccount(Accounts, t) {
  const response = await Accounts.findOrCreate({
    owner_identity_id: randomUUID(),
    account_name: faker.company.companyName(),
  })

  t.teardown(() =>
    pg.transaction((trx) =>
      AccountModel.destroy({ account_id: response.account_id }, trx),
    ),
  )

  return response
}
