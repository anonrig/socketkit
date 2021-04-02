import { Menu, Transition } from '@headlessui/react'
import cx from 'classnames'
import DatePicker from 'components/date-picker.js'
import Tabs from 'components/tabs.js'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'

function ApplicationHeader() {
  const router = useRouter()
  const { start_date = dayjs().subtract(1, 'month'), end_date = dayjs(), id } = router.query
  const { data: application } = useSWR(`applications/${id}`)
  const { data: applications } = useSWR(`applications`)
  const current_page = router.pathname.split(`[id]/`)[1]

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <aside className={cx(['px-2 sm:px-6 lg:px-0 pt-10'])}>
        <div className="md:flex md:items-center md:justify-between mb-4">
          <div className="flex-1 min-w-0">
            <Menu>
              {({ open }) => (
                <>
                  <Menu.Button>
                    <h2 className="text-2xl font-extrabold leading-7 text-gray-900 sm:truncate flex flex-row items-center align-middle">
                      <img
                        src={(application?.icon ?? '').replaceAll('512', '28')}
                        className="h-7 w-7 rounded-md mr-4"
                        alt={application?.title}
                      />
                      {application?.title}
                      <svg
                        className="h-6 w-6 ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </h2>
                  </Menu.Button>
                  <Transition
                    show={open}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95">
                    <Menu.Items
                      className="origin-top-left absolute mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                      static>
                      {applications?.rows.map((application) => (
                        <Menu.Item key={application.application_id}>
                          <Link href={`/applications/${application.application_id}/general`}>
                            <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                              {application.title}
                            </a>
                          </Link>
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
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
              title: 'Status',
              href: `/applications/${application?.application_id}/general`,
            },
            {
              key: 'info',
              title: 'Info',
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
          ]}
        />
      </aside>
    </main>
  )
}

export default ApplicationHeader
