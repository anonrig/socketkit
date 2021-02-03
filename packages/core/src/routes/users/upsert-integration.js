import { verify } from '../../hooks.js'
import f from '../../server.js'
import Ajv from 'ajv'
import {
  createOrUpdateIntegration,
  getIntegration,
} from '../../methods/integrations.js'
import {
  accountHasIntegration,
  createAccount,
  getAccounts,
} from '../../methods/accounts.js'

export default {
  method: 'PUT',
  path: '/me/integrations',
  schema: {
    body: {
      type: 'object',
      properties: {
        integration_id: { type: 'string' },
        requirement_payload: {
          type: 'object',
          properties: {
            access_token: { type: 'string' },
          },
          required: ['access_token'],
        },
      },
      required: ['integration_id', 'requirement_payload'],
    },
  },
  preHandler: verify,
  handler: async ({ body, user: { identity } }) => {
    const ajv = new Ajv()
    let [account] = await getAccounts({ identity_id: identity.id })

    if (!account) {
      account = await createAccount({ identity_id: identity.id })
    }
    const integration = await getIntegration({
      integration_id: body.integration_id,
    })
    const isRequirementValid = ajv.validate(
      integration.requirement_schema,
      body.requirement_payload,
    )

    if (!isRequirementValid) {
      throw f.httpErrors.expectationFailed()
    }

    const { state } = await f.grpc.integrations.validate({
      access_token: body.requirement_payload.access_token,
    })

    if (!state) {
      throw f.httpErrors.preconditionFailed()
    }

    const existing = await accountHasIntegration({
      integration_id: integration.integration_id,
      account_id: account.account_id,
    })

    if (!existing) {
      await f.grpc.integrations.create({
        account_id: account.account_id,
        access_token: body.requirement_payload.access_token,
      })
    }

    return createOrUpdateIntegration({
      account_id: account.account_id,
      integration_id: integration.integration_id,
      requirement_payload: body.requirement_payload,
    })
  },
}
