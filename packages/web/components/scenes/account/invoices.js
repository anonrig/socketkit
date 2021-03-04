export default function Invoices() {
  return (
    <section aria-labelledby="invoices_heading">
      <div className="shadow sm:rounded-md sm:overflow-hidden bg-white py-6 px-4 space-y-6 sm:p-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900" id="billing_history_heading">
          Invoices
        </h2>
        <div className="mt-6 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden border-t border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-warmGray-50 text-trueGray-500 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left text-xs font-medium" scope="col">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium" scope="col">
                        Description
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-right" scope="col">
                        Amount
                      </th>
                      <th className="relative px-6 py-3 text-left text-xs font-medium" scope="col">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-warmGray-900">
                        01/01/2020
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500">
                        Business Plan - Annual Billing
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-trueGray-500 text-right">
                        CA$109.00
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium float-right">
                        <a className="text-orange-500 hover:text-orange-400" href="/">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                            stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
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
