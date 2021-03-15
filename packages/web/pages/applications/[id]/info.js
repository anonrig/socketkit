import useSWR from 'swr'
import { useRouter } from 'next/router'
import { fetcher } from 'helpers/fetcher.js'

export async function getServerSideProps({
  query: { id },
  req: {
    headers: { cookie, referer },
  },
}) {
  try {
    const data = await fetcher(`applications/${id}`, {
      headers: { cookie, referer },
    })

    return { props: { initialData: data } }
  } catch (error) {
    if (error.message.includes('not found')) {
      return {
        notFound: true,
      }
    }
    return { props: { initialData: null, id } }
  }
}

function ApplicationInformation({ initialData, id }) {
  const { data: application } = useSWR(`applications/${id}`, fetcher, { initialData })

  return (
    <aside className="space-y-6">
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Screenshots</h3>
            </div>
          </div>

          <div className="overflow-y-scroll flex flex-row items-center space-x-4 mt-4">
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

      <div className="bg-white shadow rounded-lg">
        <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
            <div className="ml-4 mt-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Description</h3>
            </div>
          </div>

          <div className="mt-4 text-sm whitespace-pre-wrap">
            {application?.description.split('\n').map((item, key) => (
              <span key={key}>
                {item}
                <br />
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

export default ApplicationInformation
