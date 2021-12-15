import Card from 'components/card'
import Button from 'components/form/button'
import ApplicationHeader from 'components/menu/application-header'
import dayjs from 'dayjs'

import { fetchOnBackground } from 'helpers/server-side'
import ApplicationPropTypes from 'helpers/types/application'
import { NextSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import 'react-medium-image-zoom/dist/styles.css'
import useSWR from 'swr'

const Zoom = dynamic(() => import('react-medium-image-zoom'))

export async function getServerSideProps({ query, req: { headers } }) {
  return fetchOnBackground({ headers, query }, `applications/${query.application_id}`)
}

function ApplicationInformation({ fallbackData }) {
  const router = useRouter()
  const { data: application } = useSWR(`applications/${router.query.application_id}`, {
    fallbackData,
    refreshInterval: 0,
  })
  const { data: versions } = useSWR(
    `applications/${router.query.application_id}/versions`,
    {
      refreshInterval: 0,
    },
  )

  return (
    <>
      <NextSeo title="AppStore Info" />
      <ApplicationHeader />

      <div className="flex-grow lg:flex space-y-8 lg:space-y-0">
        <div className="flex-1 min-w-0 space-y-6">
          <Card title={`Release notes for ${application?.version}`}>
            {application?.release_notes}
          </Card>

          <Card
            title={`Screenshots`}
            className="overflow-y-scroll flex flex-row items-center space-x-4"
          >
            {application?.screenshots?.default.map((link) => (
              <Zoom key={link}>
                <img
                  src={link}
                  className="w-48 rounded-lg object-contain"
                  alt={application?.title}
                />
              </Zoom>
            ))}
          </Card>

          <Card title="Description">
            {application?.description.split('\n').map((item, key) => (
              <span key={key}>
                {item}
                <br />
              </span>
            ))}
          </Card>
        </div>

        <div className="h-full pl-0 lg:pl-6 lg:w-80">
          <Button onClick={() => router.push(application?.store_url)} className="w-full">
            Show on AppStore
          </Button>
          <div className="flex items-center flex-1 mb-8 mt-4 font-semibold">
            <a
              referrerPolicy="no-referrer"
              target="_blank"
              href={application?.developer_url}
              className="text-sm text-center w-full text-stone-700"
              rel="noreferrer"
            >
              See Developer on AppStore
            </a>
          </div>
          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap mt-12">
            <h3 className="text-lg leading-6 font-bold text-gray-900">Information</h3>
          </div>
          <div className="relative flex flex-1 flex-col space-y-6 text-sm mt-4">
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Latest Version</dt>
              <dd className="text-gray-900">v{application?.version}</dd>
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Released At</dt>
              <dd className="text-gray-900">
                {dayjs(application?.released_at).format('DD/MM/YYYY')}
              </dd>
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Score</dt>
              <dd className="text-gray-900">{application?.score}</dd>
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Reviews</dt>
              <dd className="text-gray-900">{application?.reviews}</dd>
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Supported Languages</dt>
              <dd className="text-gray-900">{application?.languages.split(',').length}</dd>
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Content Rating</dt>
              <dd className="text-gray-900">{application?.content_rating}</dd>
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Price</dt>
              <dd className="text-gray-900">
                {application?.price == 0
                  ? 'Free'
                  : `${application?.price} ${application?.currency}`}
              </dd>
            </div>
            <div className="flex flex-row flex-1 justify-between">
              <dt className="font-medium text-gray-500">Required OS Version</dt>
              <dd className="text-gray-900">{application?.required_os_version}</dd>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap mt-12">
            <h3 className="text-lg leading-6 font-bold text-gray-900">Tracked Versions</h3>
          </div>
          <div className="mt-4 text-sm whitespace-pre-wrap">
            <div className="relative flex flex-1 flex-col space-y-6 text-sm">
              {versions?.map(({ version, released_at }) => (
                <div className="flex flex-row flex-1 justify-between" key={version}>
                  <dt className="font-medium text-gray-500">
                    {dayjs(released_at).format('DD MMMM, YYYY')}
                  </dt>
                  <dd className="text-gray-900">v{version}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

ApplicationInformation.propTypes = {
  fallbackData: ApplicationPropTypes,
}

export default ApplicationInformation
