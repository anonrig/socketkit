import config from '../config.js'

const client = require('contentful').createClient({
  space: config.contentful.space_id,
  accessToken: config.contentful.delivery_api,
})

export async function fetchEntries(content_type = 'guide') {
  const entries = await client.getEntries({
    content_type,
    order: 'sys.createdAt',
    include: 2,
  })
  return entries.items
}

export async function fetchEntry(content_type = 'guide', category_slug, entry_slug) {
  const entries = await client.getEntries({
    content_type,
    'fields.slug[in]': entry_slug,
    include: 2,
  })

  return entries.items[0]
}

export default { fetchEntries }
