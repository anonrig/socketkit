import Percentage from '../../../components/percentage.js'
import PropTypes from 'prop-types'
import useSWR from 'swr'

function StatisticsWidget({ range }) {
  const { data } = useSWR(`accounts/statistics?from=${range.from}&to=${range.to}`)

  return (
    <aside className="lg:col-span-3">
      <dl className="grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-3 md:divide-y-0 md:divide-x">
        <div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">New Client</dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                {data?.clients?.now ?? 0}
                <span className="ml-2 text-sm font-medium text-gray-500">
                  from {data?.clients?.previous ?? 0}
                </span>
              </div>
              {data?.clients?.change && (
                <Percentage
                  value={data.clients.change}
                  positive={data.clients.positive}
                />
              )}
            </dd>
          </div>
        </div>
        <div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">New Revenue</dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                ${data?.sales?.now ?? 0}
                <span className="ml-2 text-sm font-medium text-gray-500">
                  from ${data?.sales?.previous ?? 0}
                </span>
              </div>
              {data?.sales?.change && (
                <Percentage
                  value={data.sales.change}
                  positive={data.sales.positive}
                />
              )}
            </dd>
          </div>
        </div>
        <div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-base font-normal text-gray-900">New Refunds</dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-indigo-600">
                ${data?.refunds?.now ?? 0}
                <span className="ml-2 text-sm font-medium text-gray-500">
                  from ${data?.refunds?.previous ?? 0}
                </span>
              </div>
              {data?.refunds?.change && (
                <Percentage
                  value={data.refunds.change}
                  positive={data.refunds.positive}
                />
              )}
            </dd>
          </div>
        </div>
      </dl>
    </aside>
  )
}

StatisticsWidget.propTypes = {
  range: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }),
}
export default StatisticsWidget
