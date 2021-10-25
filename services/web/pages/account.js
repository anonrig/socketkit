import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { NextSeo } from 'next-seo'

import Heading from 'components/heading'
import Settings from 'components/scenes/account/account-settings.js'
import Password from 'components/scenes/account/account-password.js'

import { endpoints, client } from 'helpers/kratos.js'
import redirect from 'helpers/redirect'

export async function getServerSideProps(ctx) {
  const { flow } = ctx.query

  const redirect = () => {
    ctx.res.statusCode = 302
    ctx.res?.setHeader('Location', endpoints.profile)
    return { props: {} }
  }

  if (!flow) {
    return redirect()
  }

  return { props: { flow, cookie: ctx.req.headers.cookie } }
}

function AccountSettings({ flow, cookie }) {
  const [kratos, setKratos] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    try {
      const { data: kratos } = await client.getSelfServiceSettingsFlow(flow, cookie)
      const isBefore = dayjs(kratos?.expires_at).isBefore(dayjs())

      if (isBefore) {
        return redirect()
      }

      setKratos(kratos)
    } catch (error) {
      return redirect()
    }
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
  cookie: PropTypes.string.isRequired,
}

export default AccountSettings
