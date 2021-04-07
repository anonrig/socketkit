import { IncomingWebhook } from '@slack/webhook'
import dayjs from 'dayjs'
import { countryCodeEmoji, getRatingEmojis } from '../helpers.js'

// https://api.slack.com/messaging/webhooks
export async function sendReview(url, review) {
  const {
    username,
    title,
    content,
    country_id,
    score,
    sent_at,
    application_title,
    application_icon,
    review_url,
  } = review
  const hook = new IncomingWebhook(url, {
    username,
    icon_url: 'https://cdn.socketkit.com/assets/icon.png',
    link_names: false,
  })

  await hook.send({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `You have a new review: *<${review_url}|${score} stars on ${application_title}>*`,
        },
      },
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${title}*\n${content}\n\n*Rating*: ${getRatingEmojis()}\n*Country:* ${country_id.toUpperCase()} ${countryCodeEmoji(
            country_id.toUpperCase(),
          )}\n*Reviewed at:* ${dayjs(sent_at).format('DD.MM.YYYY HH:MM')}`,
        },
        accessory: {
          type: 'image',
          image_url: application_icon,
          alt_text: application_title,
        },
      },
    ],
  })
}
