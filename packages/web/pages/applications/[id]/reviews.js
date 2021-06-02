import { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'

import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import ReviewColumns from 'helpers/columns/review.js'
import ReviewPropTypes, { ReviewCursor } from 'helpers/types/review.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, `reviews?application_id=${query.id}`, true)
}

function ApplicationReviews({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => ReviewColumns, [])
  setDateRangeIfNeeded(router, '/applications/[id]/reviews')

  return (
    <>
      <ApplicationHeader />
      <Table
        initialData={initialData}
        url={`reviews`}
        options={{
          application_id: router.query.id,
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          key: original.review_id,
          className: 'hover:bg-gray-50 cursor-pointer',
        })}
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
