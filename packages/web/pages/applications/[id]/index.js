import useSWR from 'swr'
import { useRouter } from 'next/router'
import ApplicationLayout from '../../../layouts/custom/application'

function ApplicationDashboard() {
  const { id } = useRouter().query
  const { data } = useSWR(`applications/${id}/statistics`)
  const { data: application } = useSWR(`applications/${id}`)

  return (
    <ApplicationLayout id={id}>
      <aside className="space-y-4">
        <div className="flex flex-1 items-center space-x-4">
          <span>
            <img
              src={application?.icon}
              className="h-14 w-14 rounded-md"
              alt={application?.title}
            />
          </span>

          <div className="space-y-2">
            <h3 className="font-extrabold text-gray-900 sm:tracking-tight text-2xl">
              {application?.title ?? 'Application'}
            </h3>

            <a
              href={application?.store_url}
              className="flex flex-row space-x-4 text-sm text-gray-500"
            >
              Visit on store
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-4 mt-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    MRR
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${data?.mrr ?? 0}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Subscribers
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.subscribers ?? 0}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Trials
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {data?.trials ?? 0}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Latest Version
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {application?.version}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Screenshots
                </h3>
              </div>
            </div>

            <div className="overflow-y-scroll flex flex-row space-x-4 mt-4">
              {application?.screenshots?.default.map((link) => (
                <img
                  className="w-48 rounded-lg object-contain"
                  src={link}
                  alt={application?.title}
                  key={link}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Description
                </h3>
              </div>
            </div>

            <div className="flex flex-row space-x-4 mt-4 text-sm text-gray-800 font-medium">
              {application?.description}
            </div>
          </div>
        </div>
      </aside>
    </ApplicationLayout>
  )
}

export default ApplicationDashboard