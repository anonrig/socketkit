import PropTypes from 'prop-types'
import useSWR from 'swr'

function StatisticsWidget({ range }) {
  const { data } = useSWR(`accounts/statistics?from=${range.from}&to=${range.to}`)

  return (
    <aside className="lg:col-span-4">
      <dl className="grid grid-cols-1 rounded-lg bg-white overflow-hidden shadow divide-y divide-gray-200 md:grid-cols-4 md:divide-y-0 md:divide-x">
        <div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-lg font-bold text-warmGray-900">Active Subscriptions</dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-orange-500">
                {data?.subscription_counts?.current ?? 0}
                <span className="ml-2 text-sm font-medium text-trueGray-500">
                  from {data?.subscription_counts?.at_start ?? 0}
                </span>
              </div>
            </dd>
          </div>
        </div>
        <div>
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-lg font-bold text-warmGray-900">Active Trials</dt>
            <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
              <div className="flex items-baseline text-2xl font-semibold text-orange-500">
                {data?.subscription_counts?.current_trial ?? 0}
                <span className="ml-2 text-sm font-medium text-trueGray-500">
                  from {data?.subscription_counts?.at_start_trial ?? 0}
                </span>
              </div>
            </dd>
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-lg font-bold text-warmGray-900">Sales</dt>
          <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
            <div className="flex items-baseline text-2xl font-semibold text-orange-500">
              ${data?.transaction_sums?.current_total_base_developer_proceeds ?? 0}
              <span className="ml-2 text-sm font-medium text-trueGray-500">
                from ${data?.transaction_sums?.changed_total_base_developer_proceeds ?? 0}
              </span>
            </div>
          </dd>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dt className="text-lg font-bold text-warmGray-900">Refunds</dt>
          <dd className="mt-1 flex justify-between items-baseline md:block lg:flex">
            <div className="flex items-baseline text-2xl font-semibold text-orange-500">
              ${data?.transaction_sums?.current_refund_base_developer_proceeds ?? 0}
              <span className="ml-2 text-sm font-medium text-trueGray-500">
                from ${data?.transaction_sums?.changed_refund_base_developer_proceeds ?? 0}
              </span>
            </div>
          </dd>
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
