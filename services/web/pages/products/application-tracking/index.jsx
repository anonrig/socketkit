import Button from 'components/form/button'
import Heading from 'components/heading'
import dayjs from 'dayjs'

import { fetchOnBackground } from 'helpers/server-side'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import useSWR from 'swr'

const breadcrumb = [{ href: '/products', title: 'Products & Integrations' }]

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, `integrations/tracking`)
}

function TrackingApplications({ fallbackData }) {
  const router = useRouter()
  const { data: applications } = useSWR('integrations/tracking', { fallbackData })
  const pageHeader = (
    <>
      <NextSeo title="Application Tracking" />
      <Heading
        steps={breadcrumb}
        action={
          <Link href="/products/application-tracking/new" passHref>
            <Button as="a">Add New</Button>
          </Link>
        }
      >
        Application Tracking
      </Heading>
    </>
  )

  if (Array.isArray(applications) && applications?.length === 0) {
    return (
      <>
        {pageHeader}

        <div className="shadow-lgs sm:rounded-lg mt-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-trueGray-900">No Results Found</h3>
            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <Link href="/products/application-tracking/new">
              <a className="mt-3 text-sm font-medium text-orange-500 hover:text-orange-400">
                Add a new application <span aria-hidden="true">&rarr;</span>
              </a>
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {pageHeader}

      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-warmGray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-trueGray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      Identifier
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-trueGray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      Title
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-trueGray-500 uppercase tracking-wider"
                      scope="col"
                    >
                      State
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-trueGray-500 uppercase tracking-wider text-right"
                      scope="col"
                    >
                      Created At
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-trueGray-500 uppercase tracking-wider text-right"
                      scope="col"
                    >
                      Last Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications?.map((row) => (
                    <tr
                      className="hover:bg-warmGray-50 cursor-pointer"
                      key={row.application_id}
                      onClick={() =>
                        router.push(`/products/application-tracking/${row.application_id}`)
                      }
                    >
                      <td className="px-6 py-4 text-sm text-trueGray-500 whitespace-nowrap md:whitespace-normal w-40 font-semibold">
                        {row.application_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-trueGray-500 whitespace-nowrap md:whitespace-normal">
                        {row.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-trueGray-500 whitespace-nowrap md:whitespace-normal w-24">
                        {row.is_active ? 'Active' : 'Inactive'}
                      </td>
                      <td className="px-6 py-4 text-sm text-trueGray-500 whitespace-nowrap md:whitespace-normal w-36 text-right">
                        {dayjs(row.created_at).format('YYYY-MM-DD')}
                      </td>
                      <td className="px-6 py-4 text-sm text-trueGray-500 whitespace-nowrap md:whitespace-normal w-44 text-right">
                        {dayjs(row.updated_at).format('YYYY-MM-DD HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

TrackingApplications.propTypes = {
  fallbackData: PropTypes.arrayOf(
    PropTypes.shape({
      application_id: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      is_active: PropTypes.bool.isRequired,
      title: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired,
    }),
  ),
}

export default TrackingApplications
