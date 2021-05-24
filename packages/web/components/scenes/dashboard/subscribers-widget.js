import PropTypes from 'prop-types'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import { fetcher } from 'helpers/fetcher.js'

const LineChart = dynamic(() => import('components/charts/line.js'))

function SubscribersWidget({ range, initialData }) {
  const { data } = useSWR(
    `reports/subscription/subscribers?start_date=${range.start_date}&end_date=${range.end_date}&interval=day`,
    fetcher,
    { initialData },
  )

  const { data: activeTrialsData } = useSWR(
    `reports/subscription/active-trials?start_date=${range.start_date}&end_date=${range.end_date}&interval=day`,
  )

  const { data: trialsData } = useSWR(
    `reports/subscription/trials?start_date=${range.start_date}&end_date=${range.end_date}&interval=day`,
  )

  const { data: salesData } = useSWR(
    `reports/subscription/sales-refunds?start_date=${range.start_date}&end_date=${range.end_date}&interval=day`,
  )

  return (
    <section className="lg:col-span-4">
      <dl className="grid grid-cols-1 md:grid-cols-4 md:space-x-6 space-y-6 md:space-y-0">
        <div className="col-span-2 flex flex-1 justify-center items-center rounded-md">
          <div className="bg-white h-80 w-full shadow-lgs rounded-md relative">
            <div className="py-5 px-3.5 sm:px-6 z-10">
              <dt className="font-bold text-warmGray-900 sm:tracking-tight text-2xl">
                Active Subscriptions & Trials
              </dt>
            </div>

            <div className="absolute inset-0 rounded-md">
              <LineChart
                values={[
                  { id: 'subscribers', rows: data?.rows ?? [], fields: { y0: '% subscribers' } },
                  {
                    id: 'active-trials',
                    rows: activeTrialsData?.rows ?? [],
                    fields: { y0: '% active trials' },
                  },
                  { id: 'trials', rows: trialsData?.rows ?? [], fields: { y0: '% new trials' } },
                ]}
                colors={['#3b82f6', '#16A34A']}
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
          <div className="bg-white h-80 w-full shadow-lgs rounded-md relative">
            <div className="py-5 px-4 sm:px-6 z-10">
              <dt className="font-bold text-warmGray-900 sm:tracking-tight text-2xl">
                Sales & Refunds
              </dt>
            </div>

            <div className="absolute inset-0 rounded-md">
              <LineChart
                values={[
                  {
                    id: 'sales-refunds',
                    rows: salesData?.rows ?? [],
                    fields: {
                      y0: '$% sale',
                      y1: '$% refund',
                    },
                  },
                ]}
                yFormat={'>-.2f'}
                margin={{ top: 75, left: 0, right: 0, bottom: 2 }}
                colors={['#16A34A', '#DC2626']}
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
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
  }),
  initialData: PropTypes.any,
}

export default SubscribersWidget
