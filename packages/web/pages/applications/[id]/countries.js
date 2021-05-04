import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import PropTypes from 'prop-types'

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
  const initialData = await fetcher(`applications/${query.id}/countries`, {
    headers: { cookie, referer },
    qs: { from: start_date, to: end_date },
  })
  return {
    props: { initialData, id: query.id },
  }
}

function Customers({ initialData, id }) {
  const router = useRouter()
  const { start_date, end_date } = router.query

  if (!start_date || !end_date) {
    router.push(
      {
        path: `/applications/[id]/countries`,
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
        id: 'country_name',
        Header: 'Country',
        accessor: (field) => countries[field.country_id]?.name,
      },
      {
        id: 'total_count',
        Header: 'Customers',
        accessor: 'total_count',
        className: 'w-24',
      },
      {
        id: 'total_direct_sale_count',
        Header: 'Direct Sale',
        accessor: 'total_direct_sale_count',
        className: 'w-36',
      },
      {
        id: 'total_trial_count',
        Header: 'Trials',
        accessor: 'total_trial_count',
        className: 'w-24',
      },
      {
        id: 'churn',
        Header: 'Churn',
        accessor: (field) =>
          `${(
            ((field.churned_from_trial + field.churned_from_direct_sale) / field.total_count) *
            100
          ).toFixed(2)}%`,
        className: '!text-right w-24',
      },
      {
        id: 'lead_conversion',
        Header: 'Conversion',
        accessor: (field) =>
          `${((field.paid_converted_from_trial / field.total_trial_count) * 100).toFixed(2)}%`,
        className: '!text-right w-32',
      },
      {
        id: 'revenue',
        Header: 'Revenue',
        accessor: (field) => `$${field.revenue ?? 0}`,
        className: '!text-right w-24',
      },
    ],
    [],
  )

  return (
    <Table
      initialData={initialData}
      url={`applications/${id}/countries`}
      options={{
        from: dayjs(start_date).format('YYYY-MM-DD'),
        to: dayjs(end_date).format('YYYY-MM-DD'),
      }}
      columns={columns}
      getRowProps={({ original }) => ({
        key: original.country_id,
        className: 'hover:bg-gray-50 cursor-pointer',
      })}
    />
  )
}

Customers.propTypes = {
  id: PropTypes.string.isRequired,
  initialData: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        country_id: PropTypes.string.isRequired,
        total_count: PropTypes.number.isRequired,
        total_direct_sale_count: PropTypes.number.isRequired,
        total_trial_count: PropTypes.number.isRequired,
        paid_converted_from_trial: PropTypes.number.isRequired,
        revenue: PropTypes.number.isRequired,
        churned_from_direct_sale: PropTypes.number.isRequired,
        churned_from_trial: PropTypes.number.isRequired,
      }),
    ),
  }),
}

export default Customers
