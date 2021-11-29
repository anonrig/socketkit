import Heading from 'components/heading'
import Password from 'components/scenes/account/account-password.js'

import Settings from 'components/scenes/account/account-settings.js'
import dayjs from 'dayjs'

import { endpoints, client } from 'helpers/kratos.js'
import redirect from 'helpers/redirect'
import { NextSeo } from 'next-seo'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

export async function getServerSideProps({ query: { flow } }) {
  if (!flow) {
    return {
      redirect: {
        destination: endpoints.profile,
        permanent: false,
      },
    }
  }

  return { props: { flow } }
}

function AccountSettings({ flow }) {
  const [kratos, setKratos] = useState(null)

  useEffect(() => {
    async function getSettings() {
      try {
        const { data: kratos } = await client.getSelfServiceSettingsFlow(flow)
        const isBefore = dayjs(kratos?.expires_at).isBefore(dayjs())

        if (isBefore) {
          return redirect()
        }

        setKratos(kratos)
      } catch (error) {
        return redirect()
      }
    }

    getSettings()
  }, [flow])

  const profile = kratos?.ui.nodes.filter((n) => ['profile', 'default'].includes(n.group))
  const password = kratos?.ui.nodes.filter((n) => ['password', 'default'].includes(n.group))

  return (
    <>
      <NextSeo title="Account Settings" />
      <Heading className="mb-8">Account Settings</Heading>

      <div className="space-y-8">
        {profile?.length > 0 && (
          <form action={kratos?.ui.action} method={kratos?.ui.method}>
            <Settings fields={profile} />
          </form>
        )}

        {password?.length > 0 && (
          <form action={kratos?.ui.action} method={kratos?.ui.method}>
            <Password fields={password} />
          </form>
        )}
      </div>
    </>
  )
}

AccountSettings.propTypes = {
  flow: PropTypes.string.isRequired,
}

export default AccountSettings
