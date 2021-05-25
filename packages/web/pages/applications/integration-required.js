import Component from 'components/integration-required.js'

export default function IntegrationRequired() {
  return (
    <Component
      title="Application Integration Required"
      subtitle="You need to add an integration to access your Applications list."
      url="/account/integrations"
    />
  )
}
