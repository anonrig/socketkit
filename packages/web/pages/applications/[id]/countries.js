import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import PropTypes from 'prop-types'
import Table from 'components/table/table'
import { fetcher } from 'helpers/fetcher'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps({
  query,
  req: {
    headers: { cookie, referer },
  },
}) {
  const format = 'YYYY-MM-DD'
  const {
    id,
    start_date = dayjs().subtract(1, 'month').format(format),
    end_date = dayjs().format(format),
  } = query
  const initialData = await fetcher(
    `applications/${id}/countries?from=${start_date}&to=${end_date}`,
    { headers: { cookie, referer } },
  )
  return {
    props: { initialData, id },
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
        accessor: 'country_name',
      },
      {
        id: 'total_count',
        Header: 'Unique Customers',
        accessor: 'total_count',
        className: 'w-24',
      },
      {
        id: 'trial_past_count',
        Header: 'Lost Trials',
        accessor: 'trial_past_count',
        className: 'w-32',
      },
      {
        id: 'churn_count',
        Header: 'Lost Customers',
        accessor: 'churn_count',
        className: 'w-24',
      },
      {
        id: 'churn',
        Header: 'Churn Rate',
        accessor: (field) => {
          return `${((field.churn_count / field.total_count) * 100).toFixed(2)}%`
        },
        className: '!text-right w-24',
      },
      {
        id: 'lead_conversion',
        Header: 'Lead Conversion',
        accessor: (field) => {
          return `${((field.trial_past_count / field.total_count) * 100).toFixed(2)}%`
        },
        className: '!text-right w-32',
      },
      {
        id: 'revenue',
        Header: 'Total Revenue',
        accessor: (field) => `$${field.revenue ?? 0}`,
        className: '!text-right w-24',
      },
    ],
    [],
  )

  console.log('initialData', initialData?.rows[0])

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
        country_name: PropTypes.string.isRequired,
        churn_count: PropTypes.number.isRequired,
        total_count: PropTypes.number.isRequired,
        revenue: PropTypes.number.isRequired,
      }),
    ),
  }),
}

export default Customers
