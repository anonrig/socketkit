import useSWR from 'swr'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'

import ApplicationHeader from 'components/menu/application-header.js'

import { fetcher } from 'helpers/fetcher.js'
import { fetchOnBackground } from 'helpers/server-side.js'
import ApplicationStatisticsPropTypes from 'helpers/types/application-statistics.js'

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground(
    { query, headers },
    `applications/${query.application_id}/statistics`,
  )
}

function ApplicationDashboard({ initialData }) {
  const router = useRouter()
  const { data } = useSWR(`applications/${router.query.application_id}/statistics`, fetcher, {
    initialData,
  })

  return (
    <>
      <NextSeo title="General" />
      <ApplicationHeader />

      <aside className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div>
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
                <div>
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
                <div>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Subscriptions
                  </dt>
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
                <div>
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
    </>
  )
}

ApplicationDashboard.propTypes = {
  initialData: ApplicationStatisticsPropTypes,
}

export default ApplicationDashboard
