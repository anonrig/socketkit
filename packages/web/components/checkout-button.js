import { useState, useContext } from 'react'
import { fetcher } from 'helpers/fetcher.js'
import getStripe from 'helpers/stripe.js'
import cx from 'classnames'
import toast from 'react-hot-toast'
import { AuthContext } from 'helpers/is-authorized.js'

function CheckoutButton() {
  const { session } = useContext(AuthContext)
  const [loading, setLoading] = useState(false)

  const onClick = async () => {
    setLoading(true)
    try {
      const { session_id } = await fetcher(`payments/checkout`)
      const stripe = await getStripe()
      await stripe.redirectToCheckout({
        sessionId: session_id,
      })
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-between lg:items-center lg:justify-between shadow-lgs px-6 py-5 rounded-md flex-col md:flex-row">
      <h2 className="text-xl font-extrabold tracking-tight text-warmGray-900 sm:flex-1">
        <span className="block">Ready to dive in?</span>
        <span className="block text-trueGray-500 text-lg font-semibold">
          Start your free trial today.
        </span>
      </h2>
      <div className="mt-6 md:mt-0">
        <div className="rounded-md shadow">
          <button
            disabled={loading}
            onClick={() => onClick()}
            className="relative flex-1 flex w-full items-center justify-center px-5 py-3 text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400">
            <span className={cx([loading ? 'opacity-0' : null])}>Start Free Trial</span>
            {loading && (
              <div className="absolute inset-0 flex flex-1 items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

CheckoutButton.propTypes = {}

export default CheckoutButton
