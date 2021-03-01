import useSWR from 'swr'
import dayjs from 'dayjs'
import { useState } from 'react'
import { ResponsiveBar } from '@nivo/bar'
import PropTypes from 'prop-types'
import SidebarLayout from 'layouts/sidebar.js'
import Sidebar from 'components/sidebar-reports.js'
import { fetcher, getQueryString } from 'helpers/fetcher.js'
import DatePicker from 'components/date-picker.js'
import ButtonGroup from '../../components/form/button-group.js'

const reports = [
  {
    slug: 'trials',
    title: 'Free Trials',
    description: 'The number of new free trials started over time',
    route: 'reports/trials',
  },
  {
    slug: 'mrr',
    title: 'Monthly Recurring Revenue',
    description:
      'MRR is a calculation of your normalised (amortized), monthly subscription revenue.',
    route: 'reports/mrr',
  },
  {
    slug: 'average-duration',
    title: 'Average Subscription Duration',
    description:
      'MRR is a calculation of your normalised (amortized), monthly subscription revenue.',
    route: 'reports/average-duration',
  },
]

export async function getServerSideProps(ctx) {
  const { slug } = ctx.query
  const report = reports.find((r) => r.slug === slug)

  if (!report) {
    return {
      notFound: true,
    }
  }

  const { cookie, referer } = ctx.req?.headers ?? {}
  const initialQuery = {
    start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    end_date: dayjs().format('YYYY-MM-DD'),
    interval: 'week',
  }
  const initialData = await fetcher(`${report.route}?${getQueryString(initialQuery)}`, {
    headers: { cookie, referer },
  })

  return {
    props: {
      initialData,
      title: report.title,
      description: report.description,
      route: report.route,
      initialQuery,
      slug,
    },
  }
}

function Reports({ title, description, initialData, route, initialQuery }) {
  const [filters, setFilters] = useState({
    ...initialQuery,
    start_date: dayjs(initialQuery.start_date),
    end_date: dayjs(initialQuery.end_date),
  })
  const { data } = useSWR(
    `${route}?${getQueryString({
      start_date: filters.start_date.format('YYYY-MM-DD'),
      end_date: filters.end_date.format('YYYY-MM-DD'),
      interval: filters.interval.toLowerCase(),
    })}`,
    fetcher,
    { initialData, refreshInterval: 0 },
  )

  return (
    <SidebarLayout leading={<Sidebar />}>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {title}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">{description}</div>
          </div>
        </div>
        <div className="mt-5 flex lg:mt-0 lg:ml-4">
          <DatePicker
            interval={filters}
            setInterval={({ start_date, end_date }) =>
              setFilters({
                start_date,
                end_date,
                interval: filters.interval,
              })
            }
          />
        </div>
      </div>

      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-4 flex-shrink-0 justify-between flex flex-1">
              <div></div>
              <ButtonGroup
                selected={filters.interval}
                items={['Day', 'Week', 'Month']}
                onSelected={(interval) =>
                  setFilters({
                    ...filters,
                    interval,
                  })
                }
              />
            </div>
          </div>
        </div>
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 h-96 w-full">
          <ResponsiveBar
            data={data?.rows ?? []}
            keys={['secondary']}
            indexBy="primary"
            margin={{ top: 10, right: 0, bottom: 30, left: 0 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      </div>
    </SidebarLayout>
  )
}

Reports.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  initialData: PropTypes.shape({
    rows: PropTypes.arrayOf(PropTypes.any).isRequired,
    available_filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  initialQuery: PropTypes.shape({
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    interval: PropTypes.string.isRequired,
  }),
  slug: PropTypes.string.isRequired,
}

export default Reports
