import cx from 'classnames'

import DatePicker from 'components/date-picker.js'
import ApplicationDropdown from 'components/reports/application-dropdown.js'
import IntervalDropdown from 'components/reports/interval-dropdown.js'
import Sidebar from 'components/sidebar-reports.js'
import dayjs from 'dayjs'
import { getQueryString } from 'helpers/fetcher.js'
import SidebarLayout from 'layouts/sidebar.js'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import SocketkitConfig from 'socketkit.config.js'
import useSWR from 'swr'

const BarChart = dynamic(() => import('components/charts/bar.js'))
const LineChart = dynamic(() => import('components/charts/line.js'))

export async function getServerSideProps({ query: { slug, start_date, end_date } }) {
  const report = SocketkitConfig.reports.find((r) => r.slug === slug)

  if (!report) {
    return {
      notFound: true,
    }
  }

  const format = 'YYYY-MM-DD'
  const interval = report.defaults?.interval ?? 'day'

  return {
    props: {
      query: {
        end_date: dayjs(end_date).endOf(interval).format(format),
        start_date: start_date
          ? dayjs(start_date).startOf(interval).format(format)
          : dayjs()
              .subtract(report.defaults?.range ?? 1, 'month')
              .startOf(interval)
              .format(format),
      },
      slug: report.slug,
    },
  }
}

function Reports({ query, slug }) {
  const report = SocketkitConfig.reports.find((r) => r.slug === slug)
  const [filters, setFilters] = useState({
    application_id: null,
    end_date: dayjs(query.end_date),
    interval: report.defaults?.interval ?? 'day',
    start_date: dayjs(query.start_date),
    type: report.defaults?.graph ?? 'line',
  })
  const { data } = useSWR(
    `reports/subscription/${slug}?${getQueryString({
      application_id: filters.application_id,
      end_date: filters.end_date.format('YYYY-MM-DD'),
      interval: filters.interval,
      start_date: filters.start_date.format('YYYY-MM-DD'),
    })}`,
    { refreshInterval: 0 },
  )
  function changeInterval(interval) {
    setFilters({
      ...filters,
      end_date: filters.end_date.endOf(interval),
      interval,
      start_date: filters.start_date.startOf(interval),
    })
  }

  function changeApplicationId(application_id) {
    setFilters({ ...filters, application_id })
  }

  useEffect(() => {
    const interval = report.defaults?.interval ?? 'day'
    setFilters({
      ...filters,
      application_id: null,
      end_date: dayjs().endOf(interval),
      interval,
      start_date: dayjs()
        .subtract(report.defaults?.range ?? 2, 'month')
        .startOf(interval),
      type: report.defaults?.graph ?? filters.type,
    })
  }, [report]) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <SidebarLayout leading={<Sidebar />}>
      <NextSeo title={report.title} />

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
                end_date,
                interval: filters.interval,
                start_date,
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
                  ])}
                >
                  Line
                </button>
                <button
                  onClick={() => setFilters({ ...filters, type: 'bar' })}
                  className={cx([
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    filters.type === 'bar'
                      ? 'border-orange-500 text-orange-500 hover:border-orange-400 hover:text-orange-400'
                      : 'border-transparent text-warmGray-900 hover:text-warmGray-700 hover:border-warmGray-700',
                  ])}
                >
                  Bar
                </button>
              </nav>
              <div className="flex align-middle items-center space-x-2 mb-1">
                <ApplicationDropdown
                  selected={filters.application_id}
                  onChange={(key) => changeApplicationId(key)}
                />

                <IntervalDropdown
                  selected={filters.interval}
                  onChange={(key) => changeInterval(key)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white py-5 px-4 sm:px-6 h-96 w-full" key={report.slug}>
          {filters.type === 'line' ? (
            <LineChart
              values={[{ fields: report.formats ?? {}, id: report.slug, rows: data?.rows ?? [] }]}
              yFormat={report.defaults.y_format}
            />
          ) : (
            <BarChart
              values={{ fields: report.formats ?? {}, id: report.slug, rows: data?.rows ?? [] }}
            />
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}

Reports.propTypes = {
  query: PropTypes.shape({
    end_date: PropTypes.string.isRequired,
    start_date: PropTypes.string.isRequired,
  }),
  slug: PropTypes.string.isRequired,
}

export default Reports
