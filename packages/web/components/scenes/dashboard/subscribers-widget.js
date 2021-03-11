import PropTypes from 'prop-types'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { fetcher } from 'helpers/fetcher.js'

const LineChart = dynamic(() =>
  import('components/charts/line.js' /* webpackChunkName: "LineChart" */),
)

function SubscribersWidget({ range, initialData }) {
  const {
    data,
  } = useSWR(
    `reports/subscribers?start_date=${range.from}&end_date=${range.to}&interval=day`,
    fetcher,
    { initialData },
  )

  return (
    <section className="lg:col-span-4">
      <dl className="grid grid-cols-1 md:grid-cols-4 md:space-x-6 space-y-6 md:space-y-0">
        <div className="col-span-2 flex flex-1 justify-center items-center rounded-md">
          <div className="bg-white h-80 w-full shadow-lgs rounded-md relative overflow-hidden">
            <div className="py-5 px-3.5 sm:px-6 z-10">
              <dt className="font-bold text-warmGray-900 sm:tracking-tight text-2xl">
                Active Subscriptions & Trials
              </dt>
            </div>

            <div className="absolute inset-0 rounded-md">
              <LineChart
                id="subscribers-dashboard-widget"
                rows={data?.rows ?? []}
                fields={[data?.secondary_field] ?? []}
                labelFormat={(l) => `${l} subscribers`}
                margin={{ top: 75, left: 0, right: 0, bottom: 0 }}
                axisLeft={null}
                axisBottom={null}
                axisRight={null}
                axisTop={null}
                enableGridY={false}
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-1 justify-center items-center rounded-md">
          <div className="bg-white h-80 w-full shadow-lgs rounded-md relative overflow-hidden">
            <div className="py-5 px-4 sm:px-6 z-10">
              <dt className="font-bold text-warmGray-900 sm:tracking-tight text-2xl">
                Sales & Refunds
              </dt>
            </div>

            <div className="absolute inset-0 rounded-md">
              <LineChart
                id="subscribers-dashboard-widget"
                rows={data?.rows ?? []}
                fields={[data?.secondary_field] ?? []}
                labelFormat={(l) => `${l} subscribers`}
                margin={{ top: 75, left: 0, right: 0, bottom: 0 }}
                axisLeft={null}
                axisBottom={null}
                axisRight={null}
                axisTop={null}
                enableGridY={false}
              />
            </div>
          </div>
        </div>
      </dl>
    </section>
  )
}

SubscribersWidget.propTypes = {
  range: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }),
  initialData: PropTypes.any,
}

export default SubscribersWidget
