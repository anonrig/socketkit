import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

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

  return { props: { flow } }
}

function AccountSettings({ flow }) {
  const [kratos, setKratos] = useState(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
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
  }, [flow])

  const profile = kratos?.ui.nodes.filter((n) => ['profile', 'default'].includes(n.group))
  const password = kratos?.ui.nodes.filter((n) => ['password', 'default'].includes(n.group))

  return (
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
  )
}

AccountSettings.propTypes = {
  flow: PropTypes.string.isRequired,
}

export default AccountSettings
