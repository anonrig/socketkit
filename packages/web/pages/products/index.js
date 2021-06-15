import * as Sentry from '@sentry/nextjs'
import { useState, useContext } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import dayjs from 'dayjs'
import { NextSeo } from 'next-seo'

import IntegrationRow from 'components/scenes/integration-row'
import Heading from 'components/heading'
import PaymentRequiredModal from 'components/modals/payment-required/index.js'

import { fetcher } from 'helpers/fetcher.js'
import { AuthContext } from 'helpers/context.js'

export async function getServerSideProps({
  req: {
    headers: { cookie, referer },
  },
}) {
  const request = { headers: { cookie, referer } }
  try {
    const appstoreConnect = await fetcher(`integrations/appstore-connect`, request)
    const reviews = await fetcher(`integrations/reviews`, request)
    const tracking = await fetcher(`integrations/tracking`, request)

    return {
      props: { initial: { appstoreConnect, reviews, tracking } },
    }
  } catch (error) {
    Sentry.captureException(error)
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
  const { payment } = useContext(AuthContext)
  const [showingPayments, setShowingPayments] = useState(false)

  const { data: appstoreConnect } = useSWR('integrations/appstore-connect', fetcher, {
    initialData: initial.appstoreConnect,
  })
  const { data: reviews } = useSWR(`integrations/reviews`, fetcher, {
    initialData: initial.reviews,
  })
  const { data: tracking } = useSWR(`integrations/tracking`, fetcher, {
    initialData: initial.tracking,
  })

  function navigateTo(url) {
    if (!['active', 'trialing'].includes(payment?.state)) {
      setShowingPayments(true)
    } else {
      router.push(url)
    }
  }

  return (
    <>
      <NextSeo title="Products & Integrations" />
      <PaymentRequiredModal open={showingPayments} setOpen={setShowingPayments} />
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
              {reviews.length > 0 ? `Following ${reviews.length} applications` : `Inactive`}
            </span>
          }
          action={reviews.length > 0 ? 'Preferences' : 'Set Up'}
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
