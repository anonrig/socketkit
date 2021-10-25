import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { useRouter } from 'next/router'

import PaymentRequiredModal from 'components/modals/payment-required/index.js'

import { AuthContext } from 'helpers/context.js'

function IntegrationRequired({ title, subtitle, url }) {
  const router = useRouter()
  const [showingPayments, setShowingPayments] = useState(false)
  const { payment } = useContext(AuthContext)

  function startTracking() {
    if (!['active', 'trialing'].includes(payment?.state)) {
      setShowingPayments(true)
    } else {
      router.push(url)
    }
  }

  return (
    <>
      <div className="mb-48">
        <h2 className="text-xl font-extrabold tracking-tight sm:text-4xl my-4 mb-8">{title}</h2>
        <p className="text-xl text-warmGray-500 mb-4">{subtitle}</p>
        <button
          onClick={() => startTracking()}
          className={
            'flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 w-44'
          }>
          Start Tracking
        </button>
      </div>

      <PaymentRequiredModal open={showingPayments} setOpen={setShowingPayments} />
    </>
  )
}

IntegrationRequired.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
}

export default IntegrationRequired
