import PropTypes from 'prop-types'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { SwitchHorizontalIcon } from '@heroicons/react/solid'

import DatePicker from 'components/date-picker'
import Table from 'components/table/table'
import Heading from 'components/heading'

import { fetchOnBackground } from 'helpers/server-side.js'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import TransactionColumns from 'helpers/columns/transaction.js'
import TransactionPropTypes, { TransactionCursor } from 'helpers/types/transaction.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, 'transactions', true)
}

function Transactions({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => TransactionColumns, [])
  setDateRangeIfNeeded(router, '/transactions')

  return (
    <>
      <div className="flex flex-1 justify-between mb-8 items-center">
        <Heading>Transactions</Heading>
        <div className="inline-flex items-center">
          <span className="hidden sm:block mr-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              type="button"
              onClick={() => router.push('/customers')}>
              <SwitchHorizontalIcon className="-ml-1 mr-2 h-4 w-4 text-orange-500" />
              Switch to Customers
            </button>
          </span>
          <DatePicker
            interval={{
              start_date: dayjs(router.query.start_date),
              end_date: dayjs(router.query.end_date),
            }}
            setInterval={({ start_date, end_date }) => {
              router.push(
                {
                  path: '/transactions',
                  query: {
                    start_date: start_date.format('YYYY-MM-DD'),
                    end_date: end_date.format('YYYY-MM-DD'),
                  },
                },
                undefined,
                { shallow: true },
              )
            }}
          />
        </div>
      </div>
      <Table
        initialData={initialData}
        url="transactions"
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
            callback: () => router.push('/account/integrations/appstore-connect'),
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
