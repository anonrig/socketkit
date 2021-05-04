import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import Table from 'components/table/table'
import DatePicker from 'components/date-picker'
import countries from 'helpers/countries.json'
import { fetcher } from 'helpers/fetcher.js'

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
  const initialData = await fetcher(`customers`, {
    headers: { cookie, referer },
    qs: { from: start_date, to: end_date },
  })
  return {
    props: { initialData },
  }
}

export default function Customers({ initialData }) {
  const router = useRouter()
  const { start_date, end_date } = router.query

  if (!start_date || !end_date) {
    router.push(
      {
        path: '/customers',
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
        id: 'subscriber_id',
        Header: 'Subscriber Id',
        accessor: (field) => <div className="text-warmGray-900">{field.subscriber_id}</div>,
        className: 'w-32',
      },
      {
        id: 'device_type_name',
        Header: 'Device',
        accessor: 'device_type_name',
        className: 'w-24',
      },
      {
        id: 'country_name',
        Header: 'Country',
        accessor: (field) => countries[field.country_id]?.name,
      },
      {
        id: 'total_base_subscriber_purchase',
        Header: 'Sales',
        accessor: (field) => `$${parseFloat(field.total_base_subscriber_purchase).toFixed(2)}`,
        className: '!text-right w-24',
      },
      {
        id: 'total_base_developer_proceeds',
        Header: 'Proceeds',
        accessor: (field) => `$${parseFloat(field.total_base_developer_proceeds).toFixed(2)}`,
        className: '!text-right w-24',
      },
      {
        id: 'first_interaction',
        Header: 'Start Date',
        accessor: (field) => dayjs(field.first_interaction).format('YYYY-MM-DD'),
        className: '!text-right w-36',
      },
    ],
    [],
  )

  return (
    <>
      <div className="flex flex-1 justify-between mb-8 items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-3xl">Customers</h3>
        </div>
        <span className="hidden sm:block mr-4">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            type="button"
            onClick={() => router.push('/transactions')}>
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
            Switch to Transactions
          </button>
        </span>
        <DatePicker
          interval={{ start_date: dayjs(start_date), end_date: dayjs(end_date) }}
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
      <Table
        initialData={initialData}
        url="customers"
        options={{
          from: dayjs(start_date).format('YYYY-MM-DD'),
          to: dayjs(end_date).format('YYYY-MM-DD'),
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          id: original.subscriber_id,
          onClick: () => router.push(`/customers/${original.subscriber_id}`),
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
      />
    </>
  )
}
