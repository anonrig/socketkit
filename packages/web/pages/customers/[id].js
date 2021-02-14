import dayjs from 'dayjs'
import TimelineRow from '../../components/scenes/customers/timeline-row.js'
import SubscriptionRow from '../../components/scenes/customers/subscription-row.js'
import useSWR from 'swr'
import { useRouter } from 'next/router'

export default function CustomerDetail() {
  // @ts-ignore
  const { id } = useRouter().query
  
  const { data: customer } = useSWR(`customers/${id}`)
  const { data: transactions } = useSWR(`customers/${id}/transactions`)
  const { data: subscriptions } = useSWR(`customers/${id}/subscriptions`)

  return (
    <div className="mx-auto">
      <div className="flex items-center justify-between pb-8">
        <div className="flex items-center space-x-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer</h1>
            <p className="text-sm font-medium text-gray-500">
              Member since{' '}
              <time
                className="text-gray-900"
                dateTime={dayjs(customer?.first_interaction).format(
                  'YYYY-MM-DD',
                )}
              >
                {dayjs(customer?.first_interaction).format('DD/MM/YYYY')}
              </time>
            </p>
          </div>
        </div>
      </div>
      <div className="lg:grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <section aria-labelledby="subscriptions-title">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  Properties
                </h2>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Device - Provider
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {customer?.device_type_name ?? '-'}{' '}
                      {customer?.provider_name}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Country
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {customer?.country_name ?? '-'}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Total Sales
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {parseFloat(
                        customer?.total_base_client_purchase ?? '0.00',
                      ).toFixed(2)}
                      $
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">
                      Total Revenue
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {parseFloat(
                        customer?.total_base_developer_proceeds ?? '0.00',
                      ).toFixed(2)}
                      $
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
                    <h2 className="text-lg font-medium text-gray-900">
                      Subscriptions
                    </h2>
                  </div>
                  <div>
                    <ul className="divide-y divide-gray-200">
                      <li>
                        {subscriptions?.map((s) => (
                          <SubscriptionRow
                            key={s.subscription_package_id}
                            {...s}
                          />
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
          <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Timeline</h2>
            <div className="mt-6 flow-root">
              <ul className="-mb-8">
                {transactions?.slice(0, 5).map((t) => (
                  <TimelineRow
                    key={`${t.subscription_package_id}-${t.transaction_event_date}`}
                    {...t}
                  />
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
