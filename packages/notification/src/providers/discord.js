import { Webhook, MessageBuilder } from 'discord-webhook-node'
import dayjs from 'dayjs'
import { countryCodeEmoji, getRatingEmojis } from '../helpers.js'

// https://github.com/matthew1232/discord-webhook-node
export async function send(type = 'review', { url, review }) {
  if (type === 'review') {
    sendReview(url, review)
  }
}

export async function sendReview(url, review) {
  const {
    username,
    title,
    content,
    country_id,
    score,
    sent_at,
    application_id,
    application_title,
    application_icon,
    review_url,
  } = review
  const hook = new Webhook(url)
  const embed = new MessageBuilder()
    .setTitle(title)
    .setAuthor(
      'Socketkit',
      'https://cdn.socketkit.com/assets/icon.png',
      'https://socketkit.com',
    )
    .setThumbnail(application_icon)
    .setURL(`https://web.socketkit.com/applications/${application_id}/reviews`)
    .setDescription(content)
    .addField('Application', application_title)
    .addField('Username', username)
    .addField('Rating', getRatingEmojis(score))
    .addField(
      'Country',
      `${country_id.toUpperCase()} ${countryCodeEmoji(
        country_id.toUpperCase(),
      )}`,
    )
    .addField(`Reviewed at`, dayjs(sent_at).format('DD.MM.YYYY HH:MM'), true)
    .setFooter('Access this review from https://socketkit.com')
    .setTimestamp()

  await hook.send(embed)
}
