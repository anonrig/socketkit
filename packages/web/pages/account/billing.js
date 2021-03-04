import BillingDetails from 'components/scenes/account/billing-details.js'
import BillingPlans from 'components/scenes/account/billing-plans.js'
import Invoices from 'components/scenes/account/invoices.js'

export default function AccountBilling() {
  return (
    <div className="space-y-8">
      <BillingPlans />
      <BillingDetails />
      <Invoices />
    </div>
  )
}
