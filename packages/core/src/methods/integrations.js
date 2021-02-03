import pg from '../pg.js'
import f from '../server.js'

export async function getActiveIntegrations({ integration_id }) {
  return pg
    .queryBuilder()
    .select(['account_id', 'requirement_payload'])
    .from('account_integrations')
    .where({ failed_since: null, integration_id })
}

export async function getIdentityIntegrations({ identity_id, account_id }) {
  return pg
    .queryBuilder()
    .select({
      account_id: 'account_integrations.account_id',
      integration_id: 'account_integrations.integration_id',
      requirement_payload: 'account_integrations.requirement_payload',
    })
    .from('account_integrations')
    .join('account_identities', function () {
      this.on(
        'account_identities.account_id',
        'account_integrations.account_id',
      )
    })
    .where(function () {
      this.where('account_identities.identity_id', identity_id)

      if (account_id) {
        this.andWhere('account_integrations.account_id', account_id)
      }
    })
}

export async function getIntegrations() {
  return pg
    .queryBuilder()
    .select(['integration_id', 'title', 'description', 'requirement_schema'])
    .from('integrations')
}

export async function getIntegration({ integration_id }) {
  const integration = await pg
    .queryBuilder()
    .select(['integration_id', 'title', 'description', 'requirement_schema'])
    .from('integrations')
    .where(function () {
      this.where({ integration_id })
    })
    .first()

  if (!integration) {
    throw f.httpErrors.notFound(`Integration not found`)
  }

  return integration
}

export async function createOrUpdateIntegration({
  account_id,
  integration_id,
  requirement_payload,
}) {
  const now = new Date()

  return pg
    .queryBuilder()
    .insert({
      account_id,
      integration_id,
      requirement_payload,
      created_at: now,
      requirement_set_at: now,
      failed_since: null,
    })
    .into('account_integrations')
    .onConflict(['account_id', 'integration_id'])
    .merge({ requirement_payload, requirement_set_at: now })
    .returning(['integration_id', 'requirement_payload', 'created_at'])
}
