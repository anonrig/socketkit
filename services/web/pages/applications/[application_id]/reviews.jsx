import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'

import ReviewColumns from 'helpers/columns/review.js'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import ReviewPropTypes, { ReviewCursor } from 'helpers/types/review.js'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo } from 'react'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, `reviews?application_id=${query.application_id}`)
}

function ApplicationReviews({ fallbackData }) {
  const router = useRouter()
  const { application_id } = router.query
  const columns = useMemo(() => ReviewColumns, [])
  setDateRangeIfNeeded(router, `/applications/[application_id]/reviews`, { application_id })

  return (
    <>
      <NextSeo title="Application Reviews" />
      <ApplicationHeader />
      <Table
        fallbackData={fallbackData}
        url={`reviews`}
        options={{
          application_id: router.query.application_id,
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          className: 'hover:bg-gray-50 cursor-pointer',
          key: original.review_id,
        })}
        notFound={{
          action: {
            callback: () => router.push('/products/review-tracking'),
            message: 'Update integration',
          },
          message: `Try adjusting your filter or update your integration to find what you're looking for.`,
          title: 'No reviews found',
        }}
      />
    </>
  )
}

ApplicationReviews.propTypes = {
  fallbackData: PropTypes.shape({
    cursor: ReviewCursor,
    fetching: PropTypes.bool,
    rows: PropTypes.arrayOf(ReviewPropTypes),
  }).isRequired,
}

export default ApplicationReviews
