import BillingDetails from 'components/scenes/account/billing-details.js'
import BillingPlans from 'components/scenes/account/billing-plans.js'
import Invoices from 'components/scenes/account/invoices.js'
import SocketkitConfig from 'socketkit.config.js'

export default function AccountBilling() {
  if (!SocketkitConfig.payments_enabled) {
    return (
      <div className="mb-48">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl my-4 mb-8">
          <span role="img" aria-label="rocket">
            🚀
          </span>{' '}
          Free in beta!
        </h2>
        <p className="text-xl text-warmGray-500 mb-4">Socketkit is free to use while in beta.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <BillingPlans />
      <BillingDetails />
      <Invoices />
    </div>
  )
}
