import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import DatePicker from 'components/date-picker'
import TableBadge from 'components/table/badge'
import Table from 'components/table/table'

import Heading from 'components/heading'
import { SwitchHorizontalIcon } from '@heroicons/react/solid'

import countries from 'helpers/countries.json'
import { fetcher } from 'helpers/fetcher'

export async function getServerSideProps({
  query,
  req: {
    headers: { cookie, referer },
  },
}) {
  const format = 'YYYY-MM-DD'
  const start_date = query.start_date
    ? dayjs(query.start_date).format(format)
    : dayjs().subtract(1, 'month').format(format)
  const end_date = dayjs(query.end_date).format(format)
  const initialData = await fetcher(`transactions`, {
    headers: { cookie, referer },
    qs: { from: start_date, to: end_date },
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
        accessor: (field) => (
          <div className="text-warmGray-900">{field.subscription_package_name}</div>
        ),
        className: 'truncate w-56',
      },
      {
        id: 'country_name',
        Header: 'Country',
        accessor: (field) => countries[field.country_id]?.name,
      },
      {
        id: 'base_subscriber_purchase',
        Header: 'Sale',
        accessor: (field) => `$${parseFloat(field.base_subscriber_purchase).toFixed(2)}`,
        className: '!text-right w-24',
      },
      {
        id: 'base_developer_proceeds',
        Header: 'Proceed',
        accessor: (field) => `$${parseFloat(field.base_developer_proceeds).toFixed(2)}`,
        className: '!text-right w-24',
      },
      {
        id: 'transaction_type',
        Header: 'Type',
        accessor: (field) => {
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
        <Heading>Transactions</Heading>
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
          key: `${original.subscriber_id}-${original.application_id}-${original.transaction_type}-${original.subscription_package_id}-${original.event_date}`,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
      />
    </>
  )
}

export default Transactions
