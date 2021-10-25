import { Webhook, MessageBuilder } from 'discord-webhook-node'
import dayjs from 'dayjs'
import grpc from '@grpc/grpc-js'

import validator from '../validator.js'
import * as Schemas from './discord.schema.js'
import {
  countryCodeEmoji,
  getRatingEmojis,
  convertPropertiesObject,
} from '../helpers.js'

// https://github.com/matthew1232/discord-webhook-node
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
  const hook = new Webhook(url)
  const embed = new MessageBuilder()
    .setTitle(properties.title)
    .setAuthor(
      'Socketkit',
      'https://cdn.socketkit.com/assets/icon.png',
      'https://socketkit.com',
    )
    .setThumbnail(properties.application_icon)
    .setURL(properties.review_url)
    .setDescription(properties.content)
    .addField('Application', properties.application_title)
    .addField('Username', properties.username)
    .addField('Rating', getRatingEmojis(properties.score))
    .addField(
      'Country',
      `${properties.country_id.toUpperCase()} ${countryCodeEmoji(
        properties.country_id.toUpperCase(),
      )}`,
    )
    .addField(
      `Reviewed at`,
      dayjs(properties.sent_at).format('DD.MM.YYYY HH:MM'),
      true,
    )
    .setFooter('Access this review from https://socketkit.com')
    .setTimestamp()

  await hook.send(embed)
}
