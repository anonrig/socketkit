import Heading from 'components/heading'
import IntegrationRow from 'components/scenes/integration-row'
import dayjs from 'dayjs'
import { fetcher } from 'helpers/fetcher.js'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import useSWR from 'swr'

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  const request = { headers: { cookie, referer } }
  try {
    const [appstoreConnect, reviews, tracking] = await Promise.all([
      fetcher(`integrations/appstore-connect`, request),
      fetcher(`integrations/reviews`, request),
      fetcher(`integrations/tracking`, request),
    ])

    return {
      props: { initial: { appstoreConnect, reviews, tracking } },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        initial: {
          appstoreConnect: { access_token: null, last_fetch: null },
          reviews: [],
          tracking: [],
        },
      },
    }
  }
}

function Integrations({ initial }) {
  const router = useRouter()

  const { data: appstoreConnect } = useSWR('integrations/appstore-connect', {
    fallbackData: initial.appstoreConnect,
  })
  const { data: reviews } = useSWR(`integrations/reviews`, {
    fallbackData: initial.reviews,
  })
  const { data: tracking } = useSWR(`integrations/tracking`, {
    fallbackData: initial.tracking,
  })

  function navigateTo(url) {
    router.push(url)
  }

  return (
    <>
      <NextSeo title="Products & Integrations" />
      <Heading subtitle="All products and integrations supported by Socketkit.">
        Products & Integrations
      </Heading>

      <div className="space-y-4">
        <IntegrationRow
          className="shadow-lgs"
          title="Application Tracking"
          description={
            <>
              <span className="font-semibold mr-1">
                {(tracking?.length ?? 0) === 0
                  ? 'Inactive'
                  : `Tracking on ${tracking?.length ?? 0} applications`}
              </span>{' '}
              - Real-time mobile app behaviour tracking
            </>
          }
          action="Set Up Tracking"
          onAction={() => navigateTo(`/products/application-tracking`)}
        />

        <IntegrationRow
          title="Subscription & Revenue Tracking"
          description={
            <span className="font-semibold mr-1">
              {appstoreConnect?.state === 'active'
                ? `Active - Fetched at ${dayjs(appstoreConnect.last_fetch).format('DD/MM/YYYY')}`
                : appstoreConnect?.state ?? 'Inactive'}
            </span>
          }
          action={appstoreConnect?.access_token ? 'Preferences' : 'Set Up'}
          onAction={() => navigateTo(`/products/subscription-tracking`)}
        />

        <IntegrationRow
          title="Review Tracking"
          description={
            <span className="font-semibold mr-1">
              {reviews?.length > 0 ? `Following ${reviews?.length ?? 0} applications` : `Inactive`}
            </span>
          }
          action={reviews?.length > 0 ? 'Preferences' : 'Set Up'}
          onAction={() => navigateTo(`/products/review-tracking`)}
        />
      </div>
    </>
  )
}

Integrations.propTypes = {
  initial: PropTypes.shape({
    appstoreConnect: PropTypes.shape({
      access_token: PropTypes.string,
      failed_fetches: PropTypes.number.isRequired,
      last_fetch: PropTypes.string,
      state: PropTypes.string.isRequired,
    }),
    reviews: PropTypes.arrayOf(
      PropTypes.shape({
        application_id: PropTypes.string.isRequired,
        country_ids: PropTypes.arrayOf(PropTypes.string.isRequired),
      }),
    ),
    tracking: PropTypes.arrayOf(PropTypes.shape({ application_id: PropTypes.string.isRequired })),
  }),
}

export default Integrations
