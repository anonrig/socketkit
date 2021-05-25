import { useRouter } from 'next/router'
import { useMemo } from 'react'
import PropTypes from 'prop-types'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'

import CountryColumns from 'helpers/columns/country.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, `applications/${query.id}/countries`, true)
}

function Customers({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => CountryColumns, [])
  setDateRangeIfNeeded(router, '/applications/[id]/countries')

  return (
    <>
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`applications/${router.query.id}/countries`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.country_id,
          className: 'hover:bg-gray-50 cursor-pointer',
        })}
      />
    </>
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
