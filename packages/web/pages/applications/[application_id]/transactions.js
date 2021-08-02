import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { NextSeo } from 'next-seo'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import TransactionColumns from 'helpers/columns/transaction.js'
import TransactionPropTypes, { TransactionCursor } from 'helpers/types/transaction.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground(
    { query, headers },
    `applications/${query.application_id}/transactions`,
    true,
  )
}

function Transactions({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => TransactionColumns, [])
  setDateRangeIfNeeded(router, `/applications/${router.query.application_id}/transactions`)

  return (
    <>
      <NextSeo title="Application Transactions" />
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`applications/${router.query.application_id}/transactions`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          key: `${original.subscriber_id}-${original.application_id}-${original.transaction_type}-${original.subscription_package_id}-${original.event_date}`,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
        notFound={{
          title: 'No transactions found',
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

Transactions.propTypes = {
  initialData: PropTypes.shape({
    rows: PropTypes.arrayOf(TransactionPropTypes).isRequired,
    cursor: TransactionCursor,
  }),
}

export default Transactions
