import dayjs from 'dayjs'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import TimelineRow from 'components/scenes/customers/timeline-row.js'
import SubscriptionRow from 'components/scenes/customers/subscription-row.js'

export default function CustomerDetail() {
  const { id } = useRouter().query
  const { data: customer } = useSWR(`customers/${id}`)
  const { data: transactions } = useSWR(`customers/${id}/transactions`)
  const { data: subscriptions } = useSWR(`customers/${id}/subscriptions`)

  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between pb-8">
        <div className="flex items-center space-x-5">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl sm:truncate">
              Customer
            </h2>
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
              <div className="mt-2 flex items-center text-md text-trueGray-500 space-between">
                Member since
                <time
                  className="text-warmGray-900"
                  dateTime={dayjs(customer?.first_interaction).format('YYYY-MM-DD')}>
                  {dayjs(customer?.first_interaction).format('DD/MM/YYYY')}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section aria-labelledby="subscriptions-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-semibold text-warmGray-900">Properties</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-warmGray-900">Device - Provider</dt>
                    <dd className="mt-1 text-sm text-warmGray-900">
                      {customer?.device_type_name ?? '-'} {customer?.provider_name}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-warmGray-900">Country</dt>
                    <dd className="mt-1 text-sm text-warmGray-900">
                      {customer?.country_name ?? '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-warmGray-900">Total Sales</dt>
                    <dd className="mt-1 text-sm text-warmGray-900">
                      {parseFloat(customer?.total_base_client_purchase ?? '0.00').toFixed(2)}$
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-warmGray-900">Total Revenue</dt>
                    <dd className="mt-1 text-sm text-warmGray-900">
                      {parseFloat(customer?.total_base_developer_proceeds ?? '0.00').toFixed(2)}$
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </section>
          {subscriptions?.length > 0 && (
            <section aria-labelledby="subscriptions-title">
              <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
                <div className="divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:px-6">
                    <h2 className="text-lg leading-6 font-semibold text-warmGray-900">
                      Subscriptions
                    </h2>
                  </div>
                  <div>
                    <ul className="divide-y divide-gray-200">
                      <li>
                        {subscriptions?.map((s) => (
                          <SubscriptionRow key={s.subscription_package_id} {...s} />
                        ))}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <section aria-labelledby="timeline-title" className="lg:col-span-1">
          <div className="bg-white shadow sm:rounded-lg sm:overflow-hidden">
            <div className="divide-y divide-gray-200">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-semibold text-warmGray-900">Timeline</h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <ul className="">
                  {transactions?.map((t, i) => (
                    <TimelineRow
                      key={`${t.subscription_package_id}-${t.transaction_event_date}`}
                      entry={t}
                      indicatorEnabled={i !== transactions.length - 1}
                    />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
