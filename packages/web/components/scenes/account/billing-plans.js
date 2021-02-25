export default function BillingPlans() {
  return (
    <section aria-labelledby="plan_heading">
      <form action="#" method="POST">
        <div className="shadow sm:rounded-md sm:overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div>
              <h2 className="text-lg leading-6 font-medium text-gray-900" id="plan_heading">
                Plan
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
                        className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-gray-900 border-gray-300"
                        name="pricing_plan"
                        type="radio"
                      />
                      <span className="ml-3 font-medium text-gray-900">Startup</span>
                    </label>
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                      id="plan-option-pricing-0">
                      {/* On: "text-orange-900", Off: "text-gray-900" */}
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
                        className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-gray-900 border-gray-300"
                        name="pricing_plan"
                        type="radio"
                        defaultChecked
                      />
                      <span className="ml-3 font-medium text-gray-900">Business</span>
                    </label>
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                      id="plan-option-pricing-1">
                      {/* On: "text-orange-900", Off: "text-gray-900" */}
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
                        className="h-4 w-4 text-orange-500 cursor-pointer focus:ring-gray-900 border-gray-300"
                        name="pricing_plan"
                        type="radio"
                      />
                      <span className="ml-3 font-medium text-gray-900">Enterprise</span>
                    </label>
                    <p
                      className="ml-6 pl-1 text-sm md:ml-0 md:pl-0 md:text-center"
                      id="plan-option-pricing-2">
                      {/* On: "text-orange-900", Off: "text-gray-900" */}
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
            <div className="flex items-center">
              {/* On: "bg-orange-500", Off: "bg-gray-200" */}
              <button
                aria-labelledby="toggleLabel"
                aria-pressed="true"
                className="bg-gray-200 relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors ease-in-out duration-200"
                type="button">
                <span className="sr-only">Use setting</span>
                {/* On: "translate-x-5", Off: "translate-x-0" */}
                <span
                  aria-hidden="true"
                  className="translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
                />
              </button>
              <span className="ml-3" id="toggleLabel">
                <span className="text-sm font-medium text-gray-900">Annual billing </span>
                <span className="text-sm text-gray-500">(Save 10%)</span>
              </span>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              className="bg-gray-800 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              type="submit">
              Save
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}
