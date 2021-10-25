import { useRouter } from 'next/router'
import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { NextSeo } from 'next-seo'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'

import CountryColumns from 'helpers/columns/country.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground(
    { query, headers },
    `applications/${query.application_id}/countries`,
    true,
  )
}

function Customers({ initialData }) {
  const router = useRouter()
  const { application_id } = router.query
  const columns = useMemo(() => CountryColumns, [])
  setDateRangeIfNeeded(router, `/applications/[application_id]/countries`, { application_id })

  return (
    <>
      <NextSeo title="Application Countries" />
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`applications/${router.query.application_id}/countries`}
        options={router.query}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.country_id,
          className: 'hover:bg-gray-50 cursor-pointer',
        })}
        notFound={{
          title: 'No countries found',
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          action: {
            message: 'Update integration',
            callback: () => router.push('/products/subscription-tracking'),
          },
        }}
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
