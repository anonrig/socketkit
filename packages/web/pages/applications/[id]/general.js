import useSWR from 'swr'
import { useRouter } from 'next/router'

function ApplicationDashboard() {
  const { id } = useRouter().query
  const { data } = useSWR(`applications/${id}/statistics`)
  const { data: application } = useSWR(`applications/${id}`)

  return (
    <aside className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="">
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    $
                    {(
                      parseFloat(
                        data?.transaction_sums?.current_total_base_developer_proceeds ?? 0,
                      ) +
                      parseFloat(
                        data?.transaction_sums?.current_refund_base_developer_proceeds ?? 0,
                      )
                    ).toFixed(2)}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="">
                <dt className="text-sm font-medium text-gray-500 truncate">Active Subscribers</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {data?.subscription_counts?.current ?? 0}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="">
                <dt className="text-sm font-medium text-gray-500 truncate">Active Trials</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {data?.subscription_counts.current_trial ?? 0}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="">
                <dt className="text-sm font-medium text-gray-500 truncate">Latest Version</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{application?.version}</div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ApplicationDashboard
