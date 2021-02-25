import dayjs from 'dayjs'
import Settings from 'components/scenes/account/account-settings.js'
import { endpoints } from 'helpers/kratos.js'
import { client } from 'helpers/is-authorized.js'

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

  try {
    const { data } = await client.getSelfServiceLoginFlow(flow)
    const isBefore = dayjs(data?.expires_at).isBefore(dayjs())

    if (isBefore) {
      return redirect()
    }
    return { props: { kratos: data } }
  } catch (error) {
    console.error(error)
    return redirect()
  }
}

export default function AccountSettings({ kratos }) {
  console.log('kratos', kratos)
  const profile = kratos.methods.profile.config ?? {}
  const oidc = kratos.methods.oidc.config ?? {}

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
