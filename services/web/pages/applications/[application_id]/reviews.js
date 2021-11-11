import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'

import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import ReviewColumns from 'helpers/columns/review.js'
import ReviewPropTypes, { ReviewCursor } from 'helpers/types/review.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground(
    { query, headers },
    `reviews?application_id=${query.application_id}`,
  )
}

function ApplicationReviews({ initialData }) {
  const router = useRouter()
  const { application_id } = router.query
  const columns = useMemo(() => ReviewColumns, [])
  setDateRangeIfNeeded(router, `/applications/[application_id]/reviews`, { application_id })

  return (
    <>
      <NextSeo title="Application Reviews" />
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`reviews`}
        options={{
          application_id: router.query.application_id,
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.review_id,
          className: 'hover:bg-gray-50 cursor-pointer',
        })}
        notFound={{
          title: 'No reviews found',
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          action: {
            message: 'Update integration',
            callback: () => router.push('/products/review-tracking'),
          },
        }}
      />
    </>
  )
}

ApplicationReviews.propTypes = {
  initialData: PropTypes.shape({
    fetching: PropTypes.bool,
    rows: PropTypes.arrayOf(ReviewPropTypes),
    cursor: ReviewCursor,
  }).isRequired,
}

export default ApplicationReviews
