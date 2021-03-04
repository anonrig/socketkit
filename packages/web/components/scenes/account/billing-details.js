export default function BillingDetails() {
  return (
    <section aria-labelledby="payment_details_heading">
      <form action="#" method="POST">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 sm:p-6">
            <div>
              <h2
                className="text-lg leading-6 font-medium text-warmGray-900"
                id="payment_details_heading">
                Billing Details
              </h2>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6">
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="first_name">
                  First name
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                  id="first_name"
                  type="text"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="last_name">
                  Last name
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                  id="last_name"
                  type="text"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email_address">
                  Email address
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                  id="email_address"
                  type="text"
                />
              </div>
              <div className="col-span-4 sm:col-span-1">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="expiration_date">
                  Expration date
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                  id="expiration_date"
                  placeholder="MM / YY"
                  type="text"
                />
              </div>
              <div className="col-span-4 sm:col-span-1">
                <label
                  className="flex items-center text-sm font-medium text-gray-700"
                  htmlFor="security_code">
                  <span>Security code</span>
                  <svg
                    aria-hidden="true"
                    className="ml-1 flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      clipRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      fillRule="evenodd"
                    />
                  </svg>
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                  id="security_code"
                  type="text"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="country">
                  Country / Region
                </label>
                <select
                  className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                  id="country">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700" htmlFor="postal_code">
                  ZIP / Postal
                </label>
                <input
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-warmGray-900 focus:border-warmGray-900 sm:text-sm"
                  id="postal_code"
                  type="text"
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 text-right sm:px-6 border-t border-gray-200">
            <button
              className="bg-orange-500 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-warmGray-900"
              type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
