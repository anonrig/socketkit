export default function BillingHistory() {
  return (
    <section aria-labelledby="billing_history_heading">
      <div className="bg-white pt-6 shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900" id="billing_history_heading">
            Billing history
          </h2>
        </div>
        <div className="mt-6 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        scope="col">
                        Date
                      </th>
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        scope="col">
                        Description
                      </th>
                      <th
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        scope="col">
                        Amount
                      </th>
                      <th
                        className="relative px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        scope="col">
                        <span className="sr-only">View receipt</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        1/1/2020
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Business Plan - Annual Billing
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        CA$109.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a className="text-orange-600 hover:text-orange-900" href="/">
                          View receipt
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
