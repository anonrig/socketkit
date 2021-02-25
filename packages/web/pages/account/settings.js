import dayjs from 'dayjs'
import Settings from 'components/scenes/account/account-settings.js'
import { endpoints } from 'helpers/kratos.js'
import { client } from 'helpers/is-authorized.js'
import { useEffect, useState } from 'react'
import redirect from 'helpers/redirect'

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
  }, [])

  const profile = kratos?.methods.profile.config ?? {}
  const oidc = kratos?.methods.oidc.config ?? {}

  return (
    <>
      <form action={profile.action} method={profile.method}>
        <Settings fields={profile.fields ?? []} />
      </form>
      {/* <form action={oidc.action} method={oidc.method}>
        <Providers fields={oidc.fields ?? []} />
      </form> */}
    </>
  )
}
