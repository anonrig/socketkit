import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Table from 'components/table/table'
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
  const initialData = await fetcher(`applications/${query.id}/customers`, {
    headers: { cookie, referer },
    qs: { from: start_date, to: end_date },
  })
  return {
    props: { initialData, id: query.id },
  }
}

export default function Customers({ initialData, id }) {
  const router = useRouter()
  const { start_date, end_date } = router.query

  if (!start_date || !end_date) {
    router.push(
      {
        path: `/applications/[id]/customers`,
        query: {
          id,
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
        id: 'device',
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
        id: 'sales',
        Header: 'Sales',
        accessor: (field) => `$${parseFloat(field.total_base_subscriber_purchase).toFixed(2)}`,
        className: '!text-right w-24',
      },
      {
        id: 'proceeds',
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
    <Table
      initialData={initialData}
      url={`applications/${id}/customers`}
      options={{
        from: dayjs(start_date).format('YYYY-MM-DD'),
        to: dayjs(end_date).format('YYYY-MM-DD'),
      }}
      columns={columns}
      getRowProps={({ original }) => ({
        key: original.subscriber_id,
        onClick: () => router.push(`/customers/${original.subscriber_id}`),
      })}
    />
  )
}
