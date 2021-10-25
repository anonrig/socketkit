import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table.js'

import { fetchOnBackground } from 'helpers/server-side.js'
import SubscriptionPackageColumns from 'helpers/columns/subscription-package.js'
import SubscriptionPackagePropTypes from 'helpers/types/subscription-package.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground(
    { query, headers },
    `applications/${query.application_id}/packages`,
    true,
  )
}

function SubscriptionPackages({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => SubscriptionPackageColumns, [])

  return (
    <>
      <NextSeo title="Subscription Packages" />
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`applications/${router.query.application_id}/packages`}
        options={{}}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.subscription_package_id,
          onClick: () => {},
        })}
        notFound={{
          title: 'No subscription packages found',
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          action: {
            message: 'Update integration',
            callback: () => router.push('/products/subscription-tracking'),
          },
        }}
      />
    </>
  )
}

SubscriptionPackages.propTypes = {
  initialData: PropTypes.shape({
    rows: PropTypes.arrayOf(SubscriptionPackagePropTypes),
  }),
}

export default SubscriptionPackages
