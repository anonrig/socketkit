import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import Select from 'components/form/select'
import Table from 'components/table/table'
import { fetcher } from 'helpers/fetcher'
import InlineRating from 'components/inline-rating.js'

/**
 * @param {import("next").NextPageContext} ctx
 */
export async function getServerSideProps({
  query,
  req: {
    headers: { cookie, referer },
  },
}) {
  const headers = { headers: { cookie, referer } }
  const initialData = await fetcher(`reviews?application_id=${query.id}`, headers)
  const { rows: versions } = await fetcher(`reviews/versions/${query.id}`, headers)
  return {
    props: { initialData, id: query.id, versions },
  }
}

function ApplicationReviews({ initialData, id, versions }) {
  const columns = useMemo(
    () => [
      {
        id: 'country_id',
        accessor: function ApplicationCountryId(fields) {
          const country_id = fields.country_id.toUpperCase()
          return (
            <div className="flex flex-row space-x-2 flex-1">
              {country_id}
              <InlineRating rating={fields.score ?? 1} className="ml-1" />
            </div>
          )
        },
        className: 'font-semibold w-24',
      },
      {
        id: 'version_number',
        Header: 'Version',
        accessor: 'version_number',
        className: 'w-20',
      },
      {
        id: 'content',
        Header: 'Content',
        accessor: (field) => (
          <div className="space-y-1 w-full relative overflow-hidden">
            <div className="text-xs font-semibold">
              {field.title} -{' '}
              <a className="font-bold hover:text-orange-400" href={field.user_url}>
                {field.username}
              </a>
            </div>
            <p className="text-sm line-clamp-2">{field.content}</p>
          </div>
        ),
      },
    ],
    [],
  )

  if (!initialData.fetching) {
    return (
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
    )
  }

  return (
    <Table
      initialData={initialData}
      url={`reviews`}
      options={{
        application_id: id,
      }}
      columns={columns}
      getRowProps={({ original }) => ({
        key: original.review_id,
        className: 'hover:bg-gray-50 cursor-pointer',
      })}
    />
  )
}
ApplicationReviews.propTypes = {
  id: PropTypes.string.isRequired,
  initialData: PropTypes.shape({
    fetching: PropTypes.bool.isRequired,
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        review_id: PropTypes.string.isRequired,
        country_id: PropTypes.string.isRequired,
        score: PropTypes.number.isRequired,
        version_number: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      }),
    ),
  }),
}

export default ApplicationReviews
