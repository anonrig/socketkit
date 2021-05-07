import { useState, useContext } from 'react'
import cx from 'classnames'
import toast from 'react-hot-toast'

import Loading from 'components/loading.js'
import { fetcher } from 'helpers/fetcher.js'
import { AuthContext } from 'helpers/is-authorized.js'
import getStripe from 'helpers/stripe.js'

export default function CheckoutButton() {
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
              <Loading className="absolute inset-0 flex flex-1 items-center justify-center" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
