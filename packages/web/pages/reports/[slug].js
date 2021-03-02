import useSWR from 'swr'
import dayjs from 'dayjs'
import { useState } from 'react'
import PropTypes from 'prop-types'
import SidebarLayout from 'layouts/sidebar.js'
import Sidebar from 'components/sidebar-reports.js'
import { fetcher, getQueryString } from 'helpers/fetcher.js'
import DatePicker from 'components/date-picker.js'
import ButtonGroup from 'components/form/button-group.js'
import BarChart from 'components/charts/bar.js'
import LineChart from 'components/charts/line.js'
import SocketkitConfig from 'socketkit.config.js'

export async function getServerSideProps(ctx) {
  const { slug } = ctx.query
  const report = SocketkitConfig.reports.find((r) => r.slug === slug)

  if (!report) {
    return {
      notFound: true,
    }
  }

  const initialQuery = {
    start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    end_date: dayjs().format('YYYY-MM-DD'),
    interval: 'Week',
  }

  return {
    props: {
      initialQuery,
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
    type: 'Line',
  })
  const { data } = useSWR(
    `${report.route}?${getQueryString({
      start_date: filters.start_date.format('YYYY-MM-DD'),
      end_date: filters.end_date.format('YYYY-MM-DD'),
      interval: filters.interval.toLowerCase(),
    })}`,
    fetcher,
    { refreshInterval: 0 },
  )

  return (
    <SidebarLayout leading={<Sidebar />}>
      <div className="lg:flex lg:items-center lg:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {report.title}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">{report.description}</div>
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
              <ButtonGroup
                selected={filters.type}
                items={['Bar', 'Line']}
                onSelected={(type) =>
                  setFilters({
                    ...filters,
                    type,
                  })
                }
              />
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
        <div className="bg-white py-5 px-4 border-b border-gray-200 sm:px-6 h-96 w-full">
          {filters.type === 'Line' ? (
            <LineChart
              id={`${filters.interval}`}
              rows={data?.rows ?? []}
              fields={[data?.secondary_field] ?? []}
              labelFormat={report.labelFormat}
            />
          ) : (
            <BarChart
              rows={data?.rows ?? []}
              fields={[data?.secondary_field] ?? []}
              labelFormat={report.labelFormat}
            />
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
