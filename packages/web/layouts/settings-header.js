import { useRouter } from 'next/router'
import cx from 'classnames'
import Tabs from 'components/tabs.js'

function SettingsHeader() {
  const router = useRouter()
  const current_page = router.pathname.split(`/account/`)[1]

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:divide-y lg:divide-gray-200 lg:px-8">
      <aside className={cx(['px-2 sm:px-6 lg:px-0 pt-10'])}>
        <div className="md:flex md:items-center md:justify-between mb-4">
          <h2 className="flex-1 min-w-0 text-2xl font-extrabold leading-7 text-gray-900 sm:truncate flex flex-row items-center align-middle">
            Settings
          </h2>
        </div>

        <Tabs
          selected={current_page}
          items={[
            {
              key: 'settings',
              title: 'Account Settings',
              href: `/account/settings`,
            },
            {
              key: 'users',
              title: 'Users',
              href: `/account/users`,
            },
            {
              key: 'billing',
              title: 'Billing & Plan',
              href: `/account/billing`,
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
