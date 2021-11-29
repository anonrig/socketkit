import ApplicationHeader from 'components/menu/application-header'
import Table from 'components/table/table'

import SubscriptionPackageColumns from 'helpers/columns/subscription-package'
import { fetchOnBackground } from 'helpers/server-side'
import SubscriptionPackagePropTypes from 'helpers/types/subscription-package'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, `applications/${query.application_id}/packages`)
}

function SubscriptionPackages({ fallbackData }) {
  const router = useRouter()
  const columns = useMemo(() => SubscriptionPackageColumns, [])

  return (
    <>
      <NextSeo title="Subscription Packages" />
      <ApplicationHeader />
      <Table
        fallbackData={fallbackData}
        url={`applications/${router.query.application_id}/packages`}
        options={{}}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.subscription_package_id,
          onClick: () => {},
        })}
        notFound={{
          action: {
            callback: () => router.push('/products/subscription-tracking'),
            message: 'Update integration',
          },
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          title: 'No subscription packages found',
        }}
      />
    </>
  )
}

SubscriptionPackages.propTypes = {
  fallbackData: PropTypes.shape({
    rows: PropTypes.arrayOf(SubscriptionPackagePropTypes),
  }),
}

export default SubscriptionPackages
