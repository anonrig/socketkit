import grpc from '@grpc/grpc-js'
import pg from '../pg.js'
import Logger from '../logger.js'

import * as Email from '../providers/email.js'
import * as Slack from '../providers/slack.js'
import * as Discord from '../providers/discord.js'

const logger = Logger.create().withScope('notifications')

export async function send({ account_id, type, properties }, trx) {
  logger
    .withTag('send')
    .info(`Sending notification to=${account_id} with provider=${provider_id}`)

  const integrations = await pg
    .queryBuilder()
    .select('*')
    .from('integrations')
    .where({ account_id, is_active: true })
    .transacting(trx)
    .forUpdate()

  if (!integrations.length) {
    const error = new Error(`Integration not found`)
    error.code = grpc.status.NOT_FOUND
    throw error
  }

  for (let integration of integrations) {
    try {
      switch (provider_id) {
        case 'email':
          await Email.send(integration.requirement.to, properties)
        case 'slack':
          await Slack.send(type, integration.requirement.url, properties)
          break
        case 'discord':
          await Discord.send(type, integration.requirement.url, properties)

          break
      }

      // reset error counts
      await pg
        .queryBuilder()
        .update({
          is_active: true,
          failed_requests: 0,
          last_error_message: null,
        })
        .from('integrations')
        .where({ account_id, provider_id: integration.provider_id })
        .transacting(trx)
    } catch (error) {
      logger.withTag('send').fatal(error)
      const failed_requests = integration.failed_requests + 1
      await pg
        .queryBuilder()
        .update({
          is_active: failed_requests !== 3,
          failed_requests,
          last_error_message: error.message,
        })
        .from('integrations')
        .where({ account_id, provider_id: integration.provider_id })
        .transacting(trx)
    }
  }
}
