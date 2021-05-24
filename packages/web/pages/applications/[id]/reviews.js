import { useMemo } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/router'

import ApplicationHeader from 'components/menu/application-header.js'
import Table from 'components/table/table'

import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import ReviewColumns from 'helpers/columns/review.js'
import ReviewPropTypes, { ReviewCursor } from 'helpers/types/review.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, `reviews?application_id=${query.id}`)
}

function ApplicationReviews({ initialData }) {
  const router = useRouter()
  const columns = useMemo(() => ReviewColumns, [])
  setDateRangeIfNeeded(router, '/applications/[id]/reviews')

  if (!initialData.fetching) {
    return (
      <>
        <ApplicationHeader />
        <div className="mb-48">
          <h2 className="text-xl font-extrabold tracking-tight sm:text-4xl my-4 mb-8">
            Start tracking reviews
          </h2>
          <p className="text-xl text-warmGray-500 mb-4">
            You need to add an integration to access the reviews for your application.
          </p>
          <Link href={'/account/integrations/reviews'}>
            <a
              className={
                'flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 w-44'
              }>
              Start Tracking
            </a>
          </Link>
        </div>
      </>
    )
  }

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
