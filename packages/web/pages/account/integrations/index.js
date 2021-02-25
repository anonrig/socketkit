import PropTypes from 'prop-types'
import useSWR from 'swr'
import IntegrationRow from 'components/scenes/account/integration-row.js'
import { fetcher } from 'helpers/fetcher'

export async function getServerSideProps(ctx) {
  const { cookie, referer } = ctx.req?.headers ?? {}
  const [integrations, userIntegrations] = await Promise.all([
    fetcher(`integrations`, {
      headers: { cookie, referer },
    }),
    fetcher(`users/me/integrations`, {
      headers: { cookie, referer },
    }),
  ])
  return {
    props: { integrations, userIntegrations },
  }
}

function Integrations(props) {
  const { data: integrations } = useSWR('integrations', fetcher, {
    initialData: props.integrations,
  })
  const { data: userIntegrations } = useSWR('users/me/integrations', fetcher, {
    initialData: props.userIntegrations,
  })

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Integrations</h3>
        <div className="mt-5">
          {integrations?.map((integration) => (
            <IntegrationRow
              className="mt-2"
              key={integration.integration_id}
              integration={integration}
              userIntegration={(userIntegrations ?? [])[0] ?? null}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

Integrations.propTypes = {
  integrations: PropTypes.arrayOf(
    PropTypes.shape({
      integration_id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    }),
  ),
  userIntegrations: PropTypes.arrayOf(
    PropTypes.shape({
      requirement_set_at: PropTypes.string.isRequired,
    }),
  ),
}

export default Integrations
