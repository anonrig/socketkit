import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { fetcher } from 'helpers/fetcher.js'

const format = 'YYYY-MM-DD'

dayjs.extend(utc)

export async function fetchOnBackground({ query, headers: { cookie, referer } }, resourceUrl) {
  try {
    const start_date = query.start_date
      ? dayjs.utc(query.start_date).format(format)
      : dayjs.utc().subtract(1, 'month').format(format)
    const end_date = dayjs(query.end_date).format(format)

    const fallbackData = await fetcher(resourceUrl, {
      headers: { cookie, referer },
      qs: { end_date, start_date },
    })
    return { props: { fallbackData } }
  } catch (error) {
    if (error.message.includes('not found')) {
      return {
        notFound: true,
      }
    }

    return { props: { fallbackData: undefined } }
  }
}
