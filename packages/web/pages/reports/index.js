import useSWR from 'swr'
import dayjs from 'dayjs'
import { ResponsiveBar } from '@nivo/bar'
import { useRouter } from 'next/router'
import SidebarLayout from 'layouts/sidebar.js'
import Sidebar from 'components/sidebar-reports.js'
import { fetcher } from 'helpers/fetcher.js'
import DatePicker from 'components/date-picker.js'

export async function getServerSideProps(ctx) {
  const { cookie, referer } = ctx.req?.headers ?? {}
  const initialData = await fetcher(`reports/trials`, {
    headers: { cookie, referer },
  })
  return {
    props: { initialData },
  }
}

export default function Reports({ initialData }) {
  const router = useRouter()
  const { start_date, end_date } = router.query
  const { data } = useSWR(
    `reports/trials?from${dayjs(start_date).subtract(1, 'month').format('YYYY-MM-DD')}to=${dayjs(
      end_date,
    )}`,
    fetcher,
    { initialData },
  )

  if (!start_date || !end_date) {
    router.push(
      {
        path: '/transactions',
        query: {
          start_date: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
          end_date: dayjs().format('YYYY-MM-DD'),
        },
      },
      undefined,
      { shallow: true },
    )
    return null
  }

  return (
    <SidebarLayout leading={<Sidebar />}>
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Free Trials</h3>
              <p className="mt-1 text-sm text-gray-500">
                The number of new free trials started over time.
              </p>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0">
              <DatePicker
                interval={{
                  start_date: dayjs(start_date),
                  end_date: dayjs(end_date),
                }}
                setInterval={({ start_date, end_date }) => {
                  router.push(
                    {
                      path: `/applications/[id]/customers`,
                      query: {
                        id,
                        start_date: start_date.format('YYYY-MM-DD'),
                        end_date: end_date.format('YYYY-MM-DD'),
                      },
                    },
                    undefined,
                    { shallow: true },
                  )
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 h-96 w-full">
          <ResponsiveBar
            data={data.rows}
            keys={['secondary']}
            indexBy="primary"
            margin={{ top: 10, right: 0, bottom: 20, left: 0 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
          />
        </div>
      </div>
    </SidebarLayout>
  )
}
