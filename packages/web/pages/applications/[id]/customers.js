import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Table from 'components/table/table'
import { fetcher } from 'helpers/fetcher'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps(ctx) {
  const format = 'YYYY-MM-DD'
  const { id } = ctx.query
  const { cookie, referer } = ctx.req?.headers ?? {}
  const initialData = await fetcher(
    `applications/${id}/customers?from=${dayjs()
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

export default function Customers({ initialData }) {
  const router = useRouter()
  const { start_date, end_date, id } = router.query
  const columns = useMemo(
    () => [
      {
        Header: 'Client Id',
        accessor: function ClientAccessor(field) {
          return <div className="text-warmGray-900">{field.client_id}</div>
        },
        className: 'w-32',
      },
      {
        Header: 'Device',
        accessor: 'device_type_name',
        className: 'w-24',
      },
      {
        Header: 'Country',
        accessor: 'country_name',
      },
      {
        Header: 'Sales',
        accessor: (field) => `$${parseFloat(field.total_base_client_purchase).toFixed(2)}`,
        className: 'text-right w-24',
      },
      {
        Header: 'Proceeds',
        accessor: (field) => `$${parseFloat(field.total_base_developer_proceeds).toFixed(2)}`,
        className: 'text-right w-24',
      },
      {
        Header: 'Start Date',
        accessor: function IntervalAccessor(f) {
          return dayjs(f.first_interaction).format('YYYY-MM-DD')
        },
        className: 'text-right w-32',
      },
    ],
    [],
  )

  return (
    <Table
      initialData={initialData}
      url={`applications/${id}/customers`}
      options={{
        limit: 10,
        from: dayjs(start_date).format('YYYY-MM-DD'),
        to: dayjs(end_date).format('YYYY-MM-DD'),
      }}
      columns={columns}
      getRowProps={({ original }) => ({
        key: original.client_id,
        onClick: () => router.push(`/customers/${original.client_id}`),
      })}
    />
  )
}
