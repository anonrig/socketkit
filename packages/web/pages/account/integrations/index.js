import PropTypes from 'prop-types'
import useSWR from 'swr'
import cx from 'classnames'
import Link from 'next/link'
import { fetcher } from 'helpers/fetcher'
import dayjs from 'dayjs'

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  const request = { headers: { cookie, referer } }
  try {
    const appstoreConnect = await fetcher(`integrations/appstore-connect`, request)
    const reviews = await fetcher(`integrations/reviews`, request)

    return {
      props: { initial: { appstoreConnect, reviews } },
    }
  } catch (error) {
    return {
      props: { initial: { appstoreConnect: null, reviews: [] } },
    }
  }
}

function Integrations({ initial }) {
  const { data: appstoreConnect } = useSWR('integrations/appstore-connect', fetcher, {
    initialData: initial.appstoreConnect,
  })

  const { data: reviews } = useSWR(`integrations/reviews`, fetcher, {
    initialData: initial.reviews,
  })

  return (
    <div className="space-y-4">
      <div
        className={cx(
          'rounded-md px-6 py-5 flex items-center justify-between border border-gray-200',
        )}>
        <div className="flex items-leading justify-center flex-col">
          <div className="text-md font-medium text-warmGray-900">
            AppStore Subscription Tracking
          </div>
          <div className="text-sm text-trueGray-500 flex items-center">
            <span className="font-semibold mr-1">
              {!!appstoreConnect?.access_token
                ? `Active - Fetched at ${dayjs(appstoreConnect.fetched_at).format('DD/MM/YYYY')}`
                : `Inactive`}
            </span>{' '}
            - Real-time subscription and revenue tracking from AppStore
          </div>
        </div>
        <div className="ml-4 sm:flex-shrink-0">
          <Link href={`/account/integrations/appstore-connect`}>
            <a className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              {!!appstoreConnect?.access_token ? 'Update' : 'Setup Integration'}
            </a>
          </Link>
        </div>
      </div>
      <div
        className={cx(
          'rounded-md px-6 py-5 flex items-center justify-between border border-gray-200',
        )}>
        <div className="flex items-leading justify-center flex-col">
          <div className="text-md font-medium text-warmGray-900">AppStore Reviews</div>
          <div className="text-sm text-trueGray-500 flex items-center">
            <span className="font-semibold mr-1">
              {reviews.length > 0 ? `Tracking ${reviews.length} applications` : `Inactive`}
            </span>{' '}
            - Real-time application review tracking for better customer feedback
          </div>
        </div>
        <div className="ml-4 sm:flex-shrink-0">
          <Link href={`/account/integrations/reviews`}>
            <a className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
              {reviews.length > 0 ? 'Update' : 'Start tracking'}
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

Integrations.propTypes = {
  initial: PropTypes.shape({
    appstoreConnect: PropTypes.shape({
      access_token: PropTypes.string,
      failed_fetches: PropTypes.number.isRequired,
      last_fetch: PropTypes.string,
      state: PropTypes.string,
    }),
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        application_id: PropTypes.string.isRequired,
        country_id: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
      }),
    ),
  }),
}

export default Integrations
