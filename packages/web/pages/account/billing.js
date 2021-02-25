import BillingDetails from 'components/scenes/account/billing-details.js'
import BillingPlans from 'components/scenes/account/billing-plans.js'
import BillingHistory from 'components/scenes/account/billing-history.js'

export default function AccountBilling() {
  return (
    <div className="space-y-8">
      <BillingDetails />
      <BillingPlans />
      <BillingHistory />
    </div>
  )
}
