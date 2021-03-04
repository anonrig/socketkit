import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import PropTypes from 'prop-types'
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
    `applications/${id}/countries?from=${dayjs()
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

function Customers({ initialData }) {
  const router = useRouter()
  const { start_date, end_date, id } = router.query
  const columns = useMemo(
    () => [
      {
        Header: 'Country',
        accessor: 'country_name',
      },
      {
        Header: 'Churn',
        accessor: (field) => {
          return `${((field.churn_count / field.total_count) * 100).toFixed(2)}%`
        },
      },
      {
        Header: 'Conversion',
        accessor: (field) => {
          return `${((field.trial_past_count / field.total_count) * 100).toFixed(2)}%`
        },
      },
      {
        Header: 'Revenue',
        accessor: (field) => `$${field.revenue ?? 0}`,
      },
    ],
    [],
  )

  return (
    <Table
      initialData={initialData}
      url={`applications/${id}/countries`}
      options={{
        limit: 10,
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
