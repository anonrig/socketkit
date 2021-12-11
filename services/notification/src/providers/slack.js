import grpc from '@grpc/grpc-js'
import { IncomingWebhook } from '@slack/webhook'
import dayjs from 'dayjs'

import { countryCodeEmoji, getRatingEmojis, convertPropertiesObject } from '../helpers.js'
import validator from '../validator.js'

import * as Schemas from './slack.schema.js'

// https://api.slack.com/messaging/webhooks
export async function send(type = 'review', url, properties) {
  const schema = Schemas[`${type}`] // eslint-disable-line

  if (!schema) {
    const error = new Error(`Type of ${type} is not available for Slack integration`)
    error.code = grpc.status.NOT_FOUND
    throw error
  }
  const validated_properties = validator.validate(
    Schemas[`${type}`], // eslint-disable-line
    convertPropertiesObject(properties),
  )

  if (!validated_properties) {
    const error = new Error(validator.errors[0].message)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  if (type === 'review') {
    await sendReview(url, validated_properties)
  }
}

export async function sendReview(url, properties) {
  const hook = new IncomingWebhook(url, {
    icon_url: 'https://cdn.socketkit.com/assets/icon.png',
    link_names: false,
    username: properties.username,
  })

  await hook.send({
    blocks: [
      {
        text: {
          text: `You have a new review: *<${properties.review_url}|${properties.score} stars on ${properties.application_title}>*`,
          type: 'mrkdwn',
        },
        type: 'section',
      },
      { type: 'divider' },
      {
        accessory: {
          alt_text: properties.application_title,
          image_url: properties.application_icon,
          type: 'image',
        },
        text: {
          text: `*${properties.title}*\n${properties.content}\n\n*Rating*: ${getRatingEmojis(
            properties.score,
          )}\n*Country:* ${properties.country_id.toUpperCase()} ${countryCodeEmoji(
            properties.country_id.toUpperCase(),
          )}\n*Reviewed at:* ${dayjs(properties.sent_at).format('DD.MM.YYYY HH:MM')}`,
          type: 'mrkdwn',
        },
        type: 'section',
      },
    ],
  })
}
