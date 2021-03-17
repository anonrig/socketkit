import useSWR from 'swr'
import { fetcher } from 'helpers/fetcher.js'

export async function getServerSideProps({
  query: { id },
  req: {
    headers: { cookie, referer },
  },
}) {
  try {
    const data = await fetcher(`applications/${id}/statistics`, {
      headers: { cookie, referer },
    })

    return { props: { initialData: data, id } }
  } catch (error) {
    if (error.message.includes('not found')) {
      return {
        notFound: true,
      }
    }
    return { props: { initialData: null, id } }
  }
}

function ApplicationDashboard({ initialData, id }) {
  const { data } = useSWR(`applications/${id}/statistics`, fetcher, { initialData })

  return (
    <aside className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Annual Recurring Revenue
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    $
                    {(
                      (data?.transaction_sums.current_total_base_developer_proceeds ?? 0) * 12
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
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Monthly Recurring Revenue
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    ${data?.transaction_sums.current_total_base_developer_proceeds ?? 0}
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
                <dt className="text-sm font-medium text-gray-500 truncate">Active Subscriptions</dt>
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
      </div>
    </aside>
  )
}

export default ApplicationDashboard
