import Tabs from 'components/tabs.js'
import { useRouter } from 'next/router'
import { getUrl } from 'helpers/fetcher.js'
import Heading from 'components/heading.js'

function SettingsHeader() {
  const [, currentPage] = useRouter().pathname.split('/account/')

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <aside className={'px-2 sm:px-6 lg:px-0 pt-10'}>
        <Heading className="mb-4">Settings</Heading>

        <Tabs
          selected={currentPage}
          items={[
            {
              key: 'settings',
              title: 'Account Settings',
              href: `/account/settings`,
            },
            {
              key: 'billing',
              title: 'Billing & Plan',
              href: getUrl(`payments/portal`),
            },
            {
              key: 'integrations',
              title: 'Integrations & API',
              href: `/account/integrations`,
            },
          ]}
        />
      </aside>
    </main>
  )
}

export default SettingsHeader
