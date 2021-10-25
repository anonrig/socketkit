import mailer from '@sendgrid/client'
import helpers from '@sendgrid/helpers'
import grpc from '@grpc/grpc-js'

import config from '../config.js'
import validator from '../validator.js'
import { convertPropertiesObject } from '../helpers.js'
import Logger from '../logger.js'

import schema, { templates } from './email.schema.js'

const logger = Logger.create().withScope('providers').withTag('email')

if (!config.sendgrid_api_key) {
  logger.warn(`Sendgrid api key is missing. Will not send any email.`)
} else {
  mailer.setApiKey(config.sendgrid_api_key)
}

export async function send(properties_as_array) {
  if (!config.sendgrid_api_key) {
    return logger.warn(`Sendgrid api key is missing. Skipping sending email.`)
  }

  const properties = convertPropertiesObject(properties_as_array)
  const validated_properties = validator.validate(schema, properties)
  if (!validated_properties) {
    const error = new Error(validator.errors[0].message)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  const template = templates[validated_properties.template_name]
  const template_properties = validator.validate(
    template.schema,
    JSON.parse(validated_properties.template_properties),
  )

  if (!template_properties) {
    const error = new Error(validator.errors[0].message)
    error.code = grpc.status.FAILED_PRECONDITION
    throw error
  }

  const { Mail } = helpers.classes

  const mail = new Mail({
    subject: validated_properties.subject,
    from: validated_properties.from,
    to: validated_properties.to,
    replyTo: validated_properties.reply_to,
    templateId: template.id,
    dynamicTemplateData: template_properties,
    mailSettings: {
      footer: { enable: false },
      sandboxMode: { enable: !config.isProduction },
    },
  })

  mailer.request(
    mailer.createRequest({
      method: 'POST',
      url: '/v3/mail/send',
      body: mail,
    }),
  )
}
