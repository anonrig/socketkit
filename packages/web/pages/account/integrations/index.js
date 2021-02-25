import useSWR from 'swr'
import IntegrationRow from 'components/scenes/account/integration-row.js'

export default function Integrations() {
  const { data: integrations } = useSWR('integrations')
  const { data: userIntegrations } = useSWR('users/me/integrations')

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Integrations</h3>
        <div className="mt-5">
          {integrations?.map((integration) => (
            <div key={integration.integration_id} className="mt-2">
              <IntegrationRow
                key={integration.integration_id}
                integration={integration}
                userIntegration={(userIntegrations ?? [])[0] ?? null}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
