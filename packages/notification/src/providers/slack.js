import { IncomingWebhook } from '@slack/webhook'
import dayjs from 'dayjs'
import grpc from '@grpc/grpc-js'

import validator from '../validator.js'
import * as Schemas from './slack.schema.js'
import {
  countryCodeEmoji,
  getRatingEmojis,
  convertPropertiesObject,
} from '../helpers.js'

// https://api.slack.com/messaging/webhooks
export async function send(type = 'review', url, properties) {
  const schema = Schemas[type]

  if (!schema) {
    const error = new Error(
      `Type of ${type} is not available for Slack integration`,
    )
    error.code = grpc.status.NOT_FOUND
    throw error
  }
  const validated_properties = validator.validate(
    Schemas[type],
    convertPropertiesObject(properties),
  )

  if (!validated_properties) {
    const error = new Error(validator.errors[0].message)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  if (type === 'review') {
    sendReview(url, validated_properties)
  }
}

export async function sendReview(url, properties) {
  const hook = new IncomingWebhook(url, {
    username: properties.username,
    icon_url: 'https://cdn.socketkit.com/assets/icon.png',
    link_names: false,
  })

  await hook.send({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `You have a new review: *<${properties.review_url}|${properties.score} stars on ${properties.application_title}>*`,
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${properties.title}*\n${
            properties.content
          }\n\n*Rating*: ${getRatingEmojis(
            properties.score,
          )}\n*Country:* ${properties.country_id.toUpperCase()} ${countryCodeEmoji(
            properties.country_id.toUpperCase(),
          )}\n*Reviewed at:* ${dayjs(properties.sent_at).format(
            'DD.MM.YYYY HH:MM',
          )}`,
        },
        accessory: {
          type: 'image',
          image_url: properties.application_icon,
          alt_text: properties.application_title,
        },
      },
    ],
  })
}
