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
  const [versionFilter, setVersionFilter] = useState(null)
  const columns = useMemo(
    () => [
      {
        id: 'country_id',
        accessor: function CountryAccessor(fields) {
          const country_id = fields.country_id.toUpperCase()
          return (
            <div className="flex flex-row space-x-2 flex-1">
              {country_id}
              <InlineRating rating={fields.score ?? 1} className="ml-1" />
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
              <div className="text-xs font-semibold">
                {field.title} -{' '}
                <a className="font-bold hover:text-orange-400" href={field.user_url}>
                  {field.username}
                </a>
              </div>
              <p className="text-sm line-clamp-2">{field.content}</p>
            </div>
          )
        },
        className: 'text-left',
      },
    ],
    [],
  )

  if (initialData.can_fetch) {
    return (
      <div className="mb-48">
        <h2 className="text-xl font-extrabold tracking-tight sm:text-4xl my-4 mb-8">
          Reviews are not initialized
        </h2>
        <p className="text-xl text-warmGray-500 mb-4">
          You need to add an integration to access your reviews for the application.
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
    <>
      <div className="flex flex-1 mb-2 items-center space-x-4 justify-between">
        <Select
          selected={versionFilter}
          setSelected={setVersionFilter}
          values={versions}
          renderer={({ version }) => `v${version}`}
          rendererKey="version"
          subtitleRenderer={({ released_at }) =>
            released_at ? `Released at ${dayjs(released_at).format('DD/MM/YYYY')}` : null
          }
          buttonRenderer={(item) => (!!item ? `Version ${item}` : 'Versions')}
        />
      </div>
      <Table
        initialData={initialData}
        url={`reviews`}
        options={{
          application_id: id,
          ...(!!versionFilter ? { version: versionFilter } : {}),
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
