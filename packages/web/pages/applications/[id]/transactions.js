import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

import DatePicker from 'components/date-picker'
import TableBadge from 'components/table/badge'
import Table from 'components/table/table'
import { fetcher } from 'helpers/fetcher.js'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  const format = 'YYYY-MM-DD'
  const { id } = ctx.query
  const { cookie, referer } = ctx.req?.headers ?? {}
  const initialData = await fetcher(
    `applications/${id}/transactions?from=${dayjs()
      .subtract(1, 'month')
      .format(format)}&to=${dayjs().format(format)}`,
    {
      headers: { cookie, referer },
    },
  )
  return {
    props: { initialData },
  }
}

export default function Transactions({ initialData }) {
  const router = useRouter()
  const { start_date, end_date, id } = router.query

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
  )
}
