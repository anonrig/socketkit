import ApplicationHeader from 'components/menu/application-header'
import Table from 'components/table/table'
import TransactionColumns from 'helpers/columns/transaction'
import { setDateRangeIfNeeded } from 'helpers/date'
import { fetchOnBackground } from 'helpers/server-side'
import TransactionPropTypes, { TransactionCursor } from 'helpers/types/transaction'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, `applications/${query.application_id}/transactions`)
}

function Transactions({ fallbackData }) {
  const router = useRouter()
  const { application_id } = router.query
  const columns = useMemo(() => TransactionColumns, [])
  setDateRangeIfNeeded(router, `/applications/[application_id]/transactions`, {
    application_id,
  })

  return (
    <>
      <NextSeo title="Application Transactions" />
      <ApplicationHeader />
      <Table
        fallbackData={fallbackData}
        url={`applications/${router.query.application_id}/transactions`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          className: 'h-14 hover:bg-stone-50 cursor-pointer',
          key: `${original.subscriber_id}-${original.application_id}-${original.transaction_type}-${original.subscription_package_id}-${original.event_date}`,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
        })}
        notFound={{
          action: {
            callback: () => router.push('/products/subscription-tracking'),
            message: 'Update integration',
          },
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          title: 'No transactions found',
        }}
      />
    </>
  )
}

Transactions.propTypes = {
  fallbackData: PropTypes.shape({
    cursor: TransactionCursor,
    rows: PropTypes.arrayOf(TransactionPropTypes).isRequired,
  }),
}

export default Transactions
