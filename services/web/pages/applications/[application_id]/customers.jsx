import ApplicationHeader from 'components/menu/application-header'
import Table from 'components/table/table'

import CustomerColumns from 'helpers/columns/customer'
import { setDateRangeIfNeeded } from 'helpers/date'
import { fetchOnBackground } from 'helpers/server-side'
import CustomerPropTypes, { CustomerCursor } from 'helpers/types/customer'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, `applications/${query.application_id}/customers`)
}

function Customers({ fallbackData }) {
  const router = useRouter()
  const { application_id } = router.query
  const columns = useMemo(() => CustomerColumns, [])
  setDateRangeIfNeeded(router, `/applications/[application_id]/customers`, { application_id })

  return (
    <>
      <NextSeo title="Application Customers" />
      <ApplicationHeader />
      <Table
        fallbackData={fallbackData}
        url={`applications/${router.query.application_id}/customers`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.subscriber_id,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
        })}
        notFound={{
          action: {
            callback: () => router.push('/products/subscription-tracking'),
            message: 'Update integration',
          },
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          title: 'No customers found',
        }}
      />
    </>
  )
}

Customers.propTypes = {
  fallbackData: PropTypes.shape({
    cursor: CustomerCursor,
    rows: PropTypes.arrayOf(CustomerPropTypes).isRequired,
  }),
}

export default Customers
