import { useRouter } from 'next/router'
import useSWR from 'swr'
import dayjs from 'dayjs'
import Container from 'components/container.js'
import Tabs from 'components/tabs.js'
import DatePicker from 'components/date-picker.js'

function TabHeader() {
  const router = useRouter()
  const { start_date, end_date, id } = router.query
  const { data: application } = useSWR(`applications/${id}`)
  const current_page = router.pathname.split(`applications/[id]/`)[1]

  return (
    <Container>
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-extrabold leading-7 text-gray-900 sm:truncate">
            {application?.title}
          </h2>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <DatePicker
            interval={{ start_date: dayjs(start_date), end_date: dayjs(end_date) }}
            setInterval={({ start_date, end_date }) => {
              router.push(
                {
                  path: `/applications/[id]/[current_page]`,
                  query: {
                    id,
                    current_page,
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

      <Tabs
        selected={current_page}
        items={[
          {
            key: 'general',
            title: 'General Status',
            href: `/applications/${application?.application_id}/general`,
          },
          {
            key: 'info',
            title: 'App Info',
            href: `/applications/${application?.application_id}/info`,
          },
          {
            key: 'packages',
            title: 'Packages',
            href: `/applications/${application?.application_id}/packages`,
          },
          {
            key: 'customers',
            title: 'Customers',
            href: `/applications/${application?.application_id}/customers`,
          },
          {
            key: 'transactions',
            title: 'Transactions',
            href: `/applications/${application?.application_id}/transactions`,
          },
          {
            key: 'countries',
            title: 'Countries',
            href: `/applications/${application?.application_id}/countries`,
          },
          {
            key: 'reviews',
            title: 'Reviews',
            href: `/applications/${application?.application_id}/reviews`,
          },
        ]}
      />
    </Container>
  )
}

export default TabHeader
