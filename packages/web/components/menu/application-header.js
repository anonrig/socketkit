import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import DatePicker from 'components/date-picker.js'
import Tabs from 'components/tabs.js'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import { ChevronDownIcon } from '@heroicons/react/solid'

function ApplicationHeader() {
  const router = useRouter()
  const {
    start_date = dayjs().subtract(1, 'month'),
    end_date = dayjs(),
    application_id,
  } = router.query
  const { data: application } = useSWR(`applications/${application_id}`, { refreshInterval: 0 })
  const { data: applications } = useSWR(`applications`, { refreshInterval: 0 })
  const current_page = router.pathname.split(`[application_id]/`)[1]

  return (
    <main className="mb-10">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="flex-1 min-w-0">
          <Menu>
            {({ open }) => (
              <>
                <Menu.Button className="leading-7 sm:truncate flex flex-row items-center rounded-md shadow-sm px-2 py-1 space-x-2">
                  <>
                    <img
                      src={(application?.icon ?? '').replaceAll('512', '36')}
                      className="h-7 w-7 rounded-md mr-2"
                      alt={application?.title}
                    />
                    <p className="line-clamp-1 text-left text-gray-900 text-2xl font-extrabold">
                      {application?.title}
                    </p>
                    <ChevronDownIcon className="h-5 w-5" />
                  </>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  show={open}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95">
                  <Menu.Items
                    className="origin-top-left absolute mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30"
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
                  path: `/applications/${application_id}/[current_page]`,
                  query: {
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
            href: `/applications/${application_id}/general`,
          },
          {
            key: 'info',
            title: 'Info',
            href: `/applications/${application_id}/info`,
          },
          {
            key: 'packages',
            title: 'Packages',
            href: `/applications/${application_id}/packages`,
          },
          {
            key: 'customers',
            title: 'Customers',
            href: `/applications/${application_id}/customers`,
          },
          {
            key: 'transactions',
            title: 'Transactions',
            href: `/applications/${application_id}/transactions`,
          },
          {
            key: 'countries',
            title: 'Countries',
            href: `/applications/${application_id}/countries`,
          },
          {
            key: 'reviews',
            title: 'Reviews',
            href: `/applications/${application_id}/reviews`,
          },
        ]}
      />
    </main>
  )
}

export default ApplicationHeader
