import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import DatePicker from 'components/date-picker'
import TableBadge from 'components/table/badge'
import Table from 'components/table/table'
import { fetcher } from 'helpers/fetcher.js'

export async function getServerSideProps({ query = {}, req: { headers } }) {
  const format = 'YYYY-MM-DD'
  const {
    start_date = dayjs().subtract(1, 'month').format(format),
    end_date = dayjs().format(format),
  } = query
  const { cookie, referer } = headers ?? {}
  const initialData = await fetcher(`transactions?from=${start_date}&to=${end_date}`, {
    headers: { cookie, referer },
  })
  return {
    props: { initialData },
  }
}

function Transactions({ initialData }) {
  const router = useRouter()
  const { start_date, end_date } = router.query

  if (!start_date || !end_date) {
    router.push(
      {
        path: '/transactions',
        query: {
          start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
          end_date: dayjs().format('YYYY-MM-DD'),
        },
      },
      undefined,
      { shallow: true },
    )
  }

  const columns = useMemo(
    () => [
      {
        id: 'subscription_package_name',
        Header: 'Subscription',
        accessor: function SubscriptionAccessor(field) {
          return <div className="text-warmGray-900">{field.subscription_package_name}</div>
        },
        className: 'truncate w-56',
      },
      {
        id: 'country_name',
        Header: 'Country',
        accessor: 'country_name',
      },
      {
        id: 'base_client_purchase',
        Header: 'Sale',
        accessor: function ProceedAccessor(field) {
          return `$${parseFloat(field.base_client_purchase).toFixed(2)}`
        },
        className: '!text-right w-24',
      },
      {
        id: 'base_developer_proceeds',
        Header: 'Proceed',
        accessor: function ProceedAccessor(field) {
          return `$${parseFloat(field.base_developer_proceeds).toFixed(2)}`
        },
        className: '!text-right w-24',
      },
      {
        id: 'transaction_type',
        Header: 'Type',
        accessor: function TransactionStateAccessor(field) {
          const state =
            field.transaction_type == 'renewal'
              ? 'success'
              : field.transaction_type == 'refund'
              ? 'danger'
              : 'info'
          return <TableBadge state={state}>{field.transaction_type}</TableBadge>
        },
        className: 'w-20',
      },
      {
        id: 'event_date',
        Header: 'Event Date',
        accessor: (field) => `${dayjs(field.event_date).format('DD/MM/YYYY')}`,
        className: 'text-right w-32',
      },
    ],
    [],
  )

  return (
    <>
      <div className="flex flex-1 justify-between mb-8 items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-3xl">Transactions</h3>
        </div>
        <span className="hidden sm:block mr-4">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            type="button"
            onClick={() => router.push('/customers')}>
            <svg
              className="-ml-1 mr-2 h-4 w-4 text-orange-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
            Switch to Customers
          </button>
        </span>
        <DatePicker
          interval={{ start_date: dayjs(start_date), end_date: dayjs(end_date) }}
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
      <Table
        initialData={initialData}
        url="transactions"
        options={{
          from: dayjs(start_date).format('YYYY-MM-DD'),
          to: dayjs(end_date).format('YYYY-MM-DD'),
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          id: original.client_id,
          onClick: () => router.push(`/customers/${original.client_id}`),
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
      />
    </>
  )
}

export default Transactions
