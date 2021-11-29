import { SwitchHorizontalIcon } from '@heroicons/react/solid'

import DatePicker from 'components/date-picker'
import Heading from 'components/heading'
import Table from 'components/table/table'
import dayjs from 'dayjs'

import CustomerColumns from 'helpers/columns/customer'
import { setDateRangeIfNeeded } from 'helpers/date'
import { fetchOnBackground } from 'helpers/server-side'
import CustomerPropTypes, { CustomerCursor } from 'helpers/types/customer'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, 'customers')
}

function Customers({ fallbackData }) {
  const router = useRouter()
  const columns = useMemo(() => CustomerColumns, [])
  setDateRangeIfNeeded(router, '/customers')

  return (
    <>
      <NextSeo title="Customers" />

      <div className="flex flex-1 justify-between mb-8 items-center">
        <Heading>Customers</Heading>
        <div className="inline-flex items-center">
          <span className="hidden sm:block mr-4">
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              type="button"
              onClick={() => router.push('/transactions')}
            >
              <SwitchHorizontalIcon className="-ml-1 mr-2 h-4 w-4 text-orange-500" />
              Switch to Transactions
            </button>
          </span>
          <DatePicker
            interval={{
              end_date: dayjs(router.query.end_date?.toString()),
              start_date: dayjs(router.query.start_date?.toString()),
            }}
            setInterval={({ start_date, end_date }) => {
              router.push(
                {
                  pathname: '/customers',
                  query: {
                    end_date: end_date.format('YYYY-MM-DD'),
                    start_date: start_date.format('YYYY-MM-DD'),
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
        fallbackData={fallbackData}
        url="customers"
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
          id: original.subscriber_id,
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
