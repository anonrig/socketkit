export default function BillingPlans() {
  return (
    <section aria-labelledby="plan_heading">
      <form action="#" method="POST">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h2 className="text-lg leading-6 font-medium text-warmGray-900" id="plan_heading">
                Plans
              </h2>
            </div>
            <fieldset>
              <legend className="sr-only">Pricing plans</legend>
              <ul className="relative bg-white rounded-md -space-y-px">
                <li>
                  {/* On: "bg-orange-50 border-orange-200 z-10", Off: "border-gray-200" */}
                  <div className="relative border rounded-tl-md rounded-tr-md p-4 flex flex-col md:pl-4 md:pr-6 md:grid md:grid-cols-3">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        aria-describedby="plan-option-pricing-0 plan-option-limit-0"
                        className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-warmGray-900 border-gray-300"
                        name="pricing_plan"
                        type="radio"
                      />
                      <span className="ml-3 font-medium text-warmGray-900">Startup</span>
                    </label>
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                      id="plan-option-pricing-0">
                      {/* On: "text-orange-900", Off: "text-warmGray-900" */}
                      <span className="font-medium">$29 / mo</span>
                      {/* On: "text-orange-700", Off: "text-gray-500" */}
                      <span>($290 / yr)</span>
                    </p>
                    {/* On: "text-orange-700", Off: "text-gray-500" */}
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                      id="plan-option-limit-0">
                      Up to 5 active job postings
                    </p>
                  </div>
                </li>
                <li>
                  {/* On: "bg-orange-50 border-orange-200 z-10", Off: "border-gray-200" */}
                  <div className="relative border border-gray-200 p-4 flex flex-col md:pl-4 md:pr-6 md:grid md:grid-cols-3">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        aria-describedby="plan-option-pricing-1 plan-option-limit-1"
                        className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-warmGray-900 border-gray-300"
                        name="pricing_plan"
                        type="radio"
                        defaultChecked
                      />
                      <span className="ml-3 font-medium text-warmGray-900">Business</span>
                    </label>
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                      id="plan-option-pricing-1">
                      {/* On: "text-orange-900", Off: "text-warmGray-900" */}
                      <span className="font-medium">$99 / mo</span>
                      {/* On: "text-orange-700", Off: "text-gray-500" */}
                      <span>($990 / yr)</span>
                    </p>
                    {/* On: "text-orange-700", Off: "text-gray-500" */}
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                      id="plan-option-limit-1">
                      Up to 25 active job postings
                    </p>
                  </div>
                </li>
                <li>
                  {/* On: "bg-orange-50 border-orange-200 z-10", Off: "border-gray-200" */}
                  <div className="relative border border-gray-200 rounded-bl-md rounded-br-md p-4 flex flex-col md:pl-4 md:pr-6 md:grid md:grid-cols-3">
                    <label className="flex items-center text-sm cursor-pointer">
                      <input
                        aria-describedby="plan-option-pricing-2 plan-option-limit-2"
                        className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-warmGray-900 border-gray-300"
                        name="pricing_plan"
                        type="radio"
                      />
                      <span className="ml-3 font-medium text-warmGray-900">Enterprise</span>
                    </label>
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                      id="plan-option-pricing-2">
                      {/* On: "text-orange-900", Off: "text-warmGray-900" */}
                      <span className="font-medium">$249 / mo</span>
                      {/* On: "text-orange-700", Off: "text-gray-500" */}
                      <span>($2490 / yr)</span>
                    </p>
                    {/* On: "text-orange-700", Off: "text-gray-500" */}
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-right"
                      id="plan-option-limit-2">
                      Unlimited active job postings
                    </p>
                  </div>
                </li>
              </ul>
            </fieldset>
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
