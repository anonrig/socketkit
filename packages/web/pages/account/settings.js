import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { endpoints } from 'helpers/kratos.js'
import { client } from 'helpers/is-authorized.js'
import redirect from 'helpers/redirect'
import Settings from 'components/scenes/account/account-settings.js'
import Password from 'components/scenes/account/account-password.js'

/**
 * @param {import("next").NextPageContext} ctx
 */
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

export default function AccountSettings({ flow }) {
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

  const { profile, oidc, password } = kratos?.methods ?? {}

  return (
    <div className="space-y-8">
      <form action={profile?.config.action} method={profile?.config.method}>
        <Settings fields={profile?.config.fields ?? []} />
      </form>
      <form action={password?.config.action} method={password?.config.method}>
        <Password fields={password?.config.fields ?? []} />
      </form>
    </div>
  )
}
