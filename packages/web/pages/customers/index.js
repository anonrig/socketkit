import PropTypes from 'prop-types'
import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { SwitchHorizontalIcon } from '@heroicons/react/solid'
import { NextSeo } from 'next-seo'

import Table from 'components/table/table'
import DatePicker from 'components/date-picker'
import Heading from 'components/heading'

import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import CustomerColumns from 'helpers/columns/customer.js'
import CustomerPropTypes, { CustomerCursor } from 'helpers/types/customer.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, 'customers', true)
}

function Customers({ initialData }) {
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
              onClick={() => router.push('/transactions')}>
              <SwitchHorizontalIcon className="-ml-1 mr-2 h-4 w-4 text-orange-500" />
              Switch to Transactions
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
                  path: '/customers',
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
        url="customers"
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          id: original.subscriber_id,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
        notFound={{
          title: 'No customers found',
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

Customers.propTypes = {
  initialData: PropTypes.shape({
    rows: PropTypes.arrayOf(CustomerPropTypes).isRequired,
    cursor: CustomerCursor,
  }),
}

export default Customers
