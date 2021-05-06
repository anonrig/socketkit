import { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { endpoints } from 'helpers/kratos.js'
import { client } from 'helpers/is-authorized.js'
import redirect from 'helpers/redirect'
import Settings from 'components/scenes/account/account-settings.js'
import Password from 'components/scenes/account/account-password.js'
import { AuthContext } from 'helpers/is-authorized.js'
import CTA from 'components/cta.js'

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
  const { session } = useContext(AuthContext)
  const isUserVerified = session.identity.verifiable_addresses[0]?.verified
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
      {!isUserVerified && (
        <CTA
          title="Email verification required"
          subtitle="You need to verify your email address."
          primaryButton={{
            title: 'Resend Email',
            href: endpoints.verification,
          }}
        />
      )}

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
