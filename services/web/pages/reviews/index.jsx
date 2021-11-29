import { GlobeIcon, ChartSquareBarIcon, DeviceMobileIcon } from '@heroicons/react/outline'

import DatePicker from 'components/date-picker'
import Select from 'components/form/select'
import Heading from 'components/heading'
import ReviewDetailModal from 'components/modals/review-detail'
import Table from 'components/table/table'
import dayjs from 'dayjs'

import ReviewColumns from 'helpers/columns/review'
import { setDateRangeIfNeeded } from 'helpers/date'
import { fetchOnBackground } from 'helpers/server-side'
import ReviewPropTypes, { ReviewCursor } from 'helpers/types/review'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, 'reviews')
}

function Reviews({ fallbackData }) {
  const router = useRouter()
  const [filters, setFilters] = useState({ application: null, country: null, version: null })
  const columns = useMemo(() => ReviewColumns, [])
  const [presentingReview, setPresentingReview] = useState(null)
  setDateRangeIfNeeded(router, '/reviews')

  const { data: countries } = useSWR(`reviews/countries`, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })
  const { data: applications } = useSWR(`integrations/reviews`, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  })
  const { data: versions } = useSWR(
    () => (filters.application ? `reviews/versions/${filters.application}` : null),
    { refreshInterval: 0, revalidateOnFocus: false },
  )

  return (
    <>
      <NextSeo title="Reviews" />

      {presentingReview && (
        <ReviewDetailModal onClose={() => setPresentingReview(null)} review={presentingReview} />
      )}

      <div className="flex flex-1 justify-between mb-8 items-center">
        <Heading>Reviews</Heading>
        <DatePicker
          interval={{
            end_date: dayjs(router.query.end_date?.toString()),
            start_date: dayjs(router.query.start_date?.toString()),
          }}
          setInterval={({ start_date, end_date }) => {
            router.push(
              {
                pathname: '/reviews',
                query: {
                  end_date: end_date.format('YYYY-MM-DD'),
                  start_date: start_date.format('YYYY-MM-DD'),
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
            setFilters({ application: null, country: country_id, version: null })
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
            setFilters({ application: application_id, country: filters.country, version: null })
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
        fallbackData={fallbackData}
        url="reviews"
        options={{
          application_id: filters.application,
          country_id: filters.country,
          version: filters.version,
          ...router.query,
        }}
        columns={columns}
        getRowProps={({ original }) => ({
          className: 'h-14 hover:bg-warmGray-50 cursor-pointer',
          id: original.review_id,
          onClick: () => setPresentingReview(original),
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

Reviews.propTypes = {
  fallbackData: PropTypes.shape({
    cursor: ReviewCursor,
    fetching: PropTypes.bool,
    rows: PropTypes.arrayOf(ReviewPropTypes),
  }).isRequired,
}

export default Reviews
