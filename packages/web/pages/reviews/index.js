import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { GlobeIcon, ChartSquareBarIcon, DeviceMobileIcon } from '@heroicons/react/outline'

import Heading from 'components/heading.js'
import Select from 'components/form/select'
import DatePicker from 'components/date-picker'
import Table from 'components/table/table'

import { fetcher } from 'helpers/fetcher.js'
import { setDateRangeIfNeeded } from 'helpers/date.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import ReviewColumns from 'helpers/columns/review.js'
import ReviewPropTypes, { ReviewCursor } from 'helpers/types/review.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return await fetchOnBackground({ query, headers }, 'reviews', true)
}

function Reviews({ initialData }) {
  const router = useRouter()
  const [filters, setFilters] = useState({ country: null, application: null, version: null })
  const columns = useMemo(() => ReviewColumns, [])
  setDateRangeIfNeeded(router, '/reviews')

  const { data: countries } = useSWR(`reviews/countries`, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })
  const { data: applications } = useSWR(`integrations/reviews`, fetcher, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })
  const { data: versions } = useSWR(
    () => (filters.application ? `reviews/versions/${filters.application}` : null),
    { refreshInterval: 0, revalidateOnFocus: false },
  )

  return (
    <>
      <div className="flex flex-1 justify-between mb-8 items-center">
        <Heading>Reviews</Heading>
        <DatePicker
          interval={{
            start_date: dayjs(router.query.start_date),
            end_date: dayjs(router.query.end_date),
          }}
          setInterval={({ start_date, end_date }) => {
            router.push(
              {
                path: '/reviews',
                query: {
                  start_date: start_date.format('YYYY-MM-DD'),
                  end_date: end_date.format('YYYY-MM-DD'),
                },
              },
              undefined,
              { shallow: true },
            )
          }}
        />
      </div>
      <div className="flex mb-2 items-stretch md:items-center md:space-x-2 space-y-2 md:space-y-0 flex-col md:flex-row">
        <Select
          selected={filters.country}
          setSelected={(country_id) =>
            setFilters({ country: country_id, application: null, version: null })
          }
          values={countries?.rows ?? []}
          renderer={({ name }) => name}
          rendererKey="country_id"
          buttonIconRenderer={() => <GlobeIcon className="h-4 w-4 text-orange-500" />}
          buttonRenderer={(_, { name } = {}) => (filters.country ? name : 'All Countries')}
        />
        <Select
          selected={filters.application}
          setSelected={(application_id) =>
            setFilters({ country: filters.country, application: application_id, version: null })
          }
          values={applications ?? []}
          renderer={({ application_title }) => application_title}
          rendererKey="application_id"
          buttonIconRenderer={() => <DeviceMobileIcon className="h-4 w-4 text-orange-500" />}
          buttonRenderer={(_, { application_title } = {}) =>
            application_title ? application_title : 'All Applications'
          }
        />
        <Select
          selected={filters.version}
          setSelected={(version) => setFilters(Object.assign({}, filters, { version }))}
          values={versions?.rows ?? []}
          renderer={({ version }) => `v${version}`}
          rendererKey="version"
          subtitleRenderer={({ released_at }) =>
            released_at ? `Released at ${dayjs(released_at).format('DD/MM/YYYY')}` : null
          }
          buttonIconRenderer={() => <ChartSquareBarIcon className="h-4 w-4 text-orange-500" />}
          buttonRenderer={(item) => (item ? `Version ${item}` : 'All Versions')}
          disabled={!(!!filters.application && versions?.rows.length > 0)}
        />
        <div></div>
      </div>
      <Table
        initialData={initialData}
        url="reviews"
        options={{
          country_id: filters.country,
          application_id: filters.application,
          version: filters.version,
          ...router.query,
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          id: original.review_id,
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
        })}
      />
    </>
  )
}

Reviews.propTypes = {
  initialData: PropTypes.shape({
    fetching: PropTypes.bool,
    rows: PropTypes.arrayOf(ReviewPropTypes),
    cursor: ReviewCursor,
  }).isRequired,
}

export default Reviews
