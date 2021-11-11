import PropTypes from 'prop-types'
import { useState } from 'react'
import { NextSeo } from 'next-seo'
import cx from 'classnames'
import { ShieldCheckIcon, InformationCircleIcon } from '@heroicons/react/solid'

import Heading from 'components/heading'
import ApplicationTrackingForm from 'components/scenes/products/application-tracking/form'
import ApplicationTrackingKeys from 'components/scenes/products/application-tracking/api-keys'

import { fetchOnBackground } from 'helpers/server-side'

const tabs = [
  { name: 'General', key: 'general', icon: InformationCircleIcon },
  { name: 'API Keys', key: 'api-keys', icon: ShieldCheckIcon },
]

const breadcrumb = [
  { title: 'Products & Integrations', href: '/products' },
  { title: 'Application Tracking', href: '/products/application-tracking' },
]

export async function getServerSideProps({ query: { application_id }, req: { headers } }) {
  if (application_id === 'new') {
    return {
      props: {
        title: 'Add an Application',
        isCreating: true,
        application_id: '',
        initialData: null,
      },
    }
  }

  const fetched = await fetchOnBackground(
    { query: {}, headers },
    `integrations/tracking/${application_id}`,
  )

  if (fetched.redirect || fetched.notFound) {
    return fetched
  }

  return {
    props: {
      title: fetched.props.initialData.title,
      isCreating: false,
      application_id,
      initialData: fetched.props.initialData,
    },
  }
}

function TrackingApplication({ title, isCreating, application_id, initialData }) {
  const [page, setPage] = useState(tabs[0])

  return (
    <>
      <NextSeo title={title} />
      <Heading steps={breadcrumb}>{title}</Heading>

      <div className="mt-8 mb-4">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
            defaultValue={page.key}
            onBlur={({ target: { value } }) => setPage(tabs.find((i) => i.key === value))}>
            {tabs.map((tab) => (
              <option key={tab.key}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setPage(tab)}
                  disabled={tab.key !== tabs[0].key && isCreating}
                  className={cx(
                    tab.name === page.name
                      ? 'border-orange-600 text-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                  )}
                  aria-current={tab.name === page.name ? 'page' : undefined}>
                  <tab.icon
                    className={cx(
                      tab.name === page.name
                        ? 'text-orange-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      '-ml-0.5 mr-2 h-5 w-5',
                    )}
                    aria-hidden="true"
                  />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {page.key === 'general' && (
        <ApplicationTrackingForm
          isCreating={isCreating}
          initialData={initialData}
          application_id={application_id}
        />
      )}

      {page.key === 'api-keys' && !isCreating && (
        <ApplicationTrackingKeys
          authorization_key={initialData.authorization_key}
          application_key={initialData.application_key}
        />
      )}
    </>
  )
}

TrackingApplication.propTypes = {
  title: PropTypes.string.isRequired,
  isCreating: PropTypes.bool.isRequired,
  application_id: PropTypes.string,
  initialData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    session_timeout: PropTypes.number.isRequired,
    application_id: PropTypes.string.isRequired,
    application_key: PropTypes.string,
    authorization_key: PropTypes.string,
  }),
}

export default TrackingApplication
