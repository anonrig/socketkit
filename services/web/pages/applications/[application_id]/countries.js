import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'
import CountryColumns from 'helpers/columns/country.js'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'

import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, `applications/${query.application_id}/countries`)
}

function Customers({ fallbackData }) {
  const router = useRouter()
  const { application_id } = router.query
  const columns = useMemo(() => CountryColumns, [])
  setDateRangeIfNeeded(router, `/applications/[application_id]/countries`, { application_id })

  return (
    <>
      <NextSeo title="Application Countries" />
      <ApplicationHeader />
      <Table
        fallbackData={fallbackData}
        url={`applications/${router.query.application_id}/countries`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          className: 'hover:bg-gray-50 cursor-pointer',
          key: original.country_id,
        })}
        notFound={{
          action: {
            callback: () => router.push('/products/subscription-tracking'),
            message: 'Update integration',
          },
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          title: 'No countries found',
        }}
      />
    </>
  )
}

Customers.propTypes = {
  fallbackData: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        churned_from_direct_sale: PropTypes.number.isRequired,
        churned_from_trial: PropTypes.number.isRequired,
        country_id: PropTypes.string.isRequired,
        paid_converted_from_trial: PropTypes.number.isRequired,
        revenue: PropTypes.number.isRequired,
        total_count: PropTypes.number.isRequired,
        total_direct_sale_count: PropTypes.number.isRequired,
        total_trial_count: PropTypes.number.isRequired,
      }),
    ),
  }),
  id: PropTypes.string.isRequired,
}

export default Customers
