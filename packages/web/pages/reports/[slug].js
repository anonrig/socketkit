import useSWR from 'swr'
import dayjs from 'dayjs'
import { useState } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'
import dynamic from 'next/dynamic'
import SidebarLayout from 'layouts/sidebar.js'
import Sidebar from 'components/sidebar-reports.js'
import { fetcher, getQueryString } from 'helpers/fetcher.js'
import DatePicker from 'components/date-picker.js'
import SocketkitConfig from 'socketkit.config.js'
import Dropdown from 'components/dropdown.js'

const BarChart = dynamic(() =>
  import('components/charts/bar.js' /* webpackChunkName: "BarChart" */),
)
const LineChart = dynamic(() =>
  import('components/charts/line.js' /* webpackChunkName: "LineChart" */),
)

export async function getServerSideProps(ctx) {
  const { slug } = ctx.query
  const report = SocketkitConfig.reports.find((r) => r.slug === slug)

  if (!report) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      initialQuery: {
        start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
        end_date: dayjs().format('YYYY-MM-DD'),
        interval: 'day',
      },
      slug: report.slug,
    },
  }
}

function Reports({ initialQuery, slug }) {
  const report = SocketkitConfig.reports.find((r) => r.slug === slug)
  const [filters, setFilters] = useState({
    ...initialQuery,
    start_date: dayjs(initialQuery.start_date),
    end_date: dayjs(initialQuery.end_date),
    type: 'line',
  })
  const { data } = useSWR(
    `reports/subscription/${slug}?${getQueryString({
      start_date: filters.start_date.format('YYYY-MM-DD'),
      end_date: filters.end_date.format('YYYY-MM-DD'),
      interval: filters.interval,
    })}`,
    fetcher,
    { refreshInterval: 0 },
  )

  return (
    <SidebarLayout leading={<Sidebar />}>
      <div className="lg:flex lg:items-start lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl sm:truncate">
            {report.title}
          </h2>
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-md text-trueGray-500">
              {report.description}
            </div>
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
        <div className="bg-white px-6 pt-1 border-b border-gray-200 w-full">
          <div className="flex justify-between items-center flex-wrap sm:flex-nowrap">
            <div className="flex-shrink-0 justify-between flex flex-1">
              <nav className="flex space-x-6 align-middle" aria-label="Tabs">
                <button
                  onClick={() => setFilters({ ...filters, type: 'line' })}
                  className={cx([
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    filters.type === 'line'
                      ? 'border-orange-500 text-orange-500 hover:border-orange-400 hover:text-orange-400'
                      : 'border-transparent text-warmGray-900 hover:text-warmGray-700 hover:border-warmGray-700',
                  ])}>
                  Line
                </button>
                <button
                  onClick={() => setFilters({ ...filters, type: 'bar' })}
                  className={cx([
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    filters.type === 'bar'
                      ? 'border-orange-500 text-orange-500 hover:border-orange-400 hover:text-orange-400'
                      : 'border-transparent text-warmGray-900 hover:text-warmGray-700 hover:border-warmGray-700',
                  ])}>
                  Bar
                </button>
              </nav>
              <div className="flex align-middle items-center mb-1">
                <Dropdown
                  selected={filters.interval}
                  items={[
                    { key: 'day', label: 'Daily' },
                    { key: 'week', label: 'Weekly' },
                    { key: 'month', label: 'Monthly' },
                  ]}
                  onChange={({ key }) => {
                    setFilters({
                      ...filters,
                      interval: key,
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white py-5 px-4 sm:px-6 h-96 w-full">
          {filters.type === 'line' ? (
            <LineChart rows={data?.rows ?? []} formats={report.formats ?? {}} />
          ) : (
            <BarChart rows={data?.rows ?? []} formats={report.formats ?? {}} />
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}

Reports.propTypes = {
  initialQuery: PropTypes.shape({
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
    interval: PropTypes.string.isRequired,
  }),
  slug: PropTypes.string.isRequired,
}

export default Reports
