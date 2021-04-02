import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import PropTypes from 'prop-types'

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
  const format = 'YYYY-MM-DD'
  const {
    id,
    start_date = dayjs().subtract(1, 'month').format(format),
    end_date = dayjs().format(format),
  } = query
  const initialData = await fetcher(
    `applications/${id}/reviews?from=${start_date}&to=${end_date}`,
    { headers: { cookie, referer } },
  )
  return {
    props: { initialData, id },
  }
}

function ApplicationReviews({ initialData, id }) {
  const router = useRouter()
  const columns = useMemo(
    () => [
      {
        id: 'country_id',
        accessor: function CountryAccessor(fields) {
          const country_id = fields.country_id.toUpperCase()
          return (
            <div className="flex flex-row space-x-2 flex-1">
              {country_id}
              <InlineRating rating={fields.score ?? 1} className="ml-1"/>
            </div>
          )
        },
        className: 'text-left font-semibold w-24',
      },
      {
        Header: 'Version',
        accessor: 'version_number',
        className: 'text-left w-20',
      },
      {
        Header: 'Content',
        accessor: function ContentAccessor(field) {
          return (
            <div className="space-y-1 w-full relative overflow-hidden">
              <div className="text-xs font-semibold">{field.title} - <a className="font-bold hover:text-orange-400" href={field.user_url}>{field.username}</a></div>
              <p className="text-sm line-clamp-2">{field.content}</p>
            </div>
          )
        },
        className: 'text-left',
      },
    ],
    [],
  )

  return (
    <Table
      initialData={initialData}
      url={`applications/${id}/reviews`}
      options={{}}
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
