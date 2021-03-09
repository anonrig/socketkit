import { NextSeo } from 'next-seo'
import Layout from 'components/layout.js'

export default function Analytics() {
  return (
    <Layout>
      <NextSeo title={'Mobile Analytics & Event Tracking'} description={`@TODO - fix this`} />

      <div className="relative bg-gray-50 pt-16 sm:pt-24 lg:pt-32">
        <div className="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
          <div>
            <h2 className="text-base font-semibold tracking-wider text-cyan-600 uppercase">
              Serverless
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              No server? No problem.
            </p>
            <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
              Phasellus lorem quam molestie id quisque diam aenean nulla in. Accumsan in quis quis
              nunc, ullamcorper malesuada. Eleifend condimentum id viverra nulla.
            </p>
          </div>
          <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
            <img
              className="rounded-lg shadow-xl ring-1 ring-black ring-opacity-5"
              src="https://tailwindui.com/img/component-images/green-project-app-screenshot.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
