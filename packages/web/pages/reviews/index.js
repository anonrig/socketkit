import { useMemo, useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'

import { GlobeIcon, ChartSquareBarIcon, DeviceMobileIcon } from '@heroicons/react/outline'

import Heading from 'components/heading.js'
import Select from 'components/form/select'
import DatePicker from 'components/date-picker'
import Table from 'components/table/table'
import InlineRating from 'components/inline-rating'
import { fetcher } from 'helpers/fetcher.js'

export async function getServerSideProps({
  query,
  req: {
    headers: { cookie, referer },
  },
}) {
  const format = 'YYYY-MM-DD'
  const start_date = query.start_date
    ? dayjs(query.start_date).format(format)
    : dayjs().subtract(1, 'month').format(format)
  const end_date = dayjs(query.end_date).format(format)
  const initialData = await fetcher(`reviews`, {
    headers: { cookie, referer },
    qs: { from: start_date, to: end_date },
  })
  return {
    props: { initialData },
  }
}

function Reviews({ initialData }) {
  const router = useRouter()
  const { start_date, end_date } = router.query
  const [filters, setFilters] = useState({ country: null, application: null, version: null })

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

  const columns = useMemo(
    () => [
      {
        id: 'country_id',
        accessor: (fields) => {
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

  if (!start_date || !end_date) {
    router.push(
      {
        path: '/reviews',
        query: {
          start_date: dayjs().subtract(3, 'month').format('YYYY-MM-DD'),
          end_date: dayjs().format('YYYY-MM-DD'),
        },
      },
      undefined,
      { shallow: true },
    )
  }

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
    <>
      <div className="flex flex-1 justify-between mb-8 items-center">
        <Heading>Reviews</Heading>
        <DatePicker
          interval={{ start_date: dayjs(start_date), end_date: dayjs(end_date) }}
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
          buttonRenderer={(_, { name } = {}) => (!!filters.country ? name : 'All Countries')}
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
            !!application_title ? application_title : 'All Applications'
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
          buttonRenderer={(item) => (!!item ? `Version ${item}` : 'All Versions')}
          disabled={!(!!filters.application && versions?.rows.length > 0)}
        />
        <div></div>
      </div>
      <Table
        initialData={initialData}
        url="reviews"
        options={{
          from: dayjs(start_date).format('YYYY-MM-DD'),
          to: dayjs(end_date).format('YYYY-MM-DD'),
          country_id: filters.country,
          application_id: filters.application,
          version: filters.version,
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

export default Reviews
