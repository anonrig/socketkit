import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import DatePicker from '../../../components/date-picker'
import TableBadge from '../../../components/table/badge'
import Table from '../../../components/table/table'
import { fetcher } from '../../../helpers/fetcher.js'
import ApplicationLayout from '../../../layouts/custom/application.js'

/**
 * @param {import("next").NextPageContext} ctx 
 */
 export async function getServerSideProps(ctx) {
  const format = 'YYYY-MM-DD'
  const { id } = ctx.query
  const { cookie, referer } = ctx.req?.headers ?? {}
  const initialData = await fetcher(`applications/${id}/transactions?from=${dayjs().subtract(1, 'month').format(format)}&to=${dayjs().format(format)}`, {
    headers: { cookie, referer }
  })
  return {
    props: { initialData },
  }
}

export default function Transactions({ initialData }) {
  const router = useRouter()
  const { start_date, end_date, id } = router.query

  if (!start_date || !end_date) {
    router.push({
      path: `/applications/[id]/transactions`,
      query: {
        id,
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD')
      },
    }, undefined, { shallow: true })
  }

  const columns = useMemo(
    () => [
      {
        Header: 'Customer',
        accessor: 'client_id',
      },
      {
        Header: 'Country',
        accessor: 'country_name',
      },
      {
        Header: 'Subscription',
        accessor: 'subscription_package_name',
      },
      {
        Header: 'Proceed',
        accessor: function ProceedAccessor(field) {
          return `$${parseFloat(field.base_developer_proceeds).toFixed(2)}`
        },
      },
      {
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
      },
      {
        Header: 'Date',
        accessor: (field) => `${dayjs(field.eventDate).format('DD/MM/YYYY')}`,
      },
    ],
    [],
  )

  return (
    <ApplicationLayout id={id}>
      <div className="flex flex-1 justify-between mb-5 items-center">
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-2xl">
            Transactions
          </h3>
        </div>
        <span className="hidden sm:block mr-3">
          <button
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            type="button"
            onClick={() => router.push(`/applications/${id}/customers`)}
          >
            <svg
              aria-hidden="true"
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                fillRule="evenodd"
              />
            </svg>
            View Customers
          </button>
        </span>
        <DatePicker
          interval={{ start_date: dayjs(start_date), end_date: dayjs(end_date) }} 
          setInterval={({start_date, end_date}) => {
            router.push({
              path: `/applications/[id]/transactions`,
              query: { 
                id,
                start_date: start_date.format('YYYY-MM-DD'),
                end_date: end_date.format('YYYY-MM-DD'),
              }
            }, undefined, { shallow: true })
          }}
        />          
      </div>
      <Table
        initialData={initialData}
        url={`applications/${id}/transactions`}
        options={{
          limit: 10,
          from: dayjs(start_date).format('YYYY-MM-DD'),
          to: dayjs(end_date).format('YYYY-MM-DD'),
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          key: `${original.client_id}-${original.application_id}-${original.subscription_package_id}`,
          onClick: () => router.push(`/customers/${original.client_id}`),
          className: 'hover:bg-gray-50 cursor-pointer',
        })}
      />
    </ApplicationLayout>
  )
}
