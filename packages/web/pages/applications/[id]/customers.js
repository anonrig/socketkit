import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Table from 'components/table/table'
import DatePicker from 'components/date-picker'
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
        Header: 'Device',
        accessor: 'device_type_name',
      },
      {
        Header: 'Country',
        accessor: 'country_name',
      },
      {
        Header: 'Sales',
        accessor: (field) => `$${parseFloat(field.total_base_client_purchase).toFixed(2)}`,
      },
      {
        Header: 'Proceeds',
        accessor: (field) => `$${parseFloat(field.total_base_developer_proceeds).toFixed(2)}`,
      },
      {
        Header: 'Since',
        accessor: function IntervalAccessor(f) {
          return dayjs(f.first_interaction).format('YYYY-MM-DD')
        },
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
        className: 'hover:bg-gray-50 cursor-pointer',
      })}
    />
  )
}
