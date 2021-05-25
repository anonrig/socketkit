import * as Sentry from '@sentry/nextjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { fetcher } from 'helpers/fetcher.js'

const format = 'YYYY-MM-DD'

dayjs.extend(utc)

export async function fetchOnBackground(
  { query, headers: { cookie, referer } },
  resourceUrl,
  checkForPayments = false,
) {
  try {
    if (checkForPayments) {
      const { state } = await fetcher('payments/state', { headers: { cookie, referer } })

      if (state !== 'active') {
        return {
          redirect: {
            destination: '/start-membership',
            permanent: false,
          },
        }
      }
    }

    const start_date = query.start_date
      ? dayjs.utc(query.start_date).format(format)
      : dayjs.utc().subtract(1, 'month').format(format)
    const end_date = dayjs(query.end_date).format(format)

    const initialData = await fetcher(resourceUrl, {
      headers: { cookie, referer },
      qs: { start_date, end_date },
    })
    return { props: { initialData } }
  } catch (error) {
    if (error.message.includes('not found')) {
      return {
        notFound: true,
      }
    }

    Sentry.captureException(error)

    return { props: {} }
  }
}
