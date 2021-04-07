import grpc from '@grpc/grpc-js'

import pg from '../pg.js'
import * as Slack from '../providers/slack.js'
import * as Discord from '../providers/discord.js'
import Logger from '../logger.js'

const logger = Logger.create().withScope('notifications')

export async function send({ account_id, provider_id, review }, trx) {
  logger
    .withTag('send')
    .info(`Sending notification to=${account_id} with provider=${provider_id}`)

  const integration = await pg
    .queryBuilder()
    .select('*')
    .from('integrations')
    // .where({ account_id, provider_id, is_active: true })
    .where({ account_id, provider_id })
    .first()
    .transacting(trx)
    .forUpdate()

  if (!integration) {
    const error = new Error(`Integration not found`)
    error.code = grpc.status.NOT_FOUND
    throw error
  }

  const { url } = integration.requirement

  try {
    switch (provider_id) {
      case 'slack':
        await Slack.sendReview(url, review)
        break
      case 'discord':
        await Discord.sendReview(url, review)
        break
    }

    // reset error counts
    await pg
      .queryBuilder()
      .update({ is_active: true, failed_requests: 0, last_error_message: null })
      .from('integrations')
      .where({ account_id, provider_id })
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
      .where({ account_id, provider_id })
      .transacting(trx)
  }
}
