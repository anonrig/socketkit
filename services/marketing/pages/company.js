import Layout from '../components/layout.js'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import Image from 'next/image'

export default function Company() {
  return (
    <Layout>
      <NextSeo
        title="Company"
        description="Event Management & Subscription Tracking platform for mobile applications without compromising privacy or security."
      />

      <div className="relative">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={'/assets/company-hero.png'}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="h-full w-full"
                alt="People using Socketkit"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-orange-500"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
            <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
              <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block text-white">Privacy & security</span>
                <span className="block text-orange-500">for applications</span>
              </h1>

              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-white sm:max-w-3xl">
                Without compromising valuable insights about your business
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-warmGray-50 my-28">
        <div className="h-80 absolute bottom-0 xl:inset-0 xl:h-auto xl:grid xl:grid-cols-2 hidden lg:visible">
          <div className="h-full absolute inset-0 col-start-2">
            <img
              className="h-full w-full object-cover opacity-100 xl:absolute xl:inset-0"
              src="/assets/company-aboutus.png"
              alt="People working on laptops"
            />
            <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-200 to-orange-500" />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-128 bg-gradient-to-b from-warmGray-50 xl:inset-y-0 xl:left-0 xl:h-full xl:w-128 xl:bg-gradient-to-r"
            />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 xl:grid xl:grid-cols-2 xl:grid-flow-col-dense xl:gap-x-8">
          <div className="relative pt-24 pb-24 xl:col-start-1 xl:pb-24">
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-warmGray-900">About us</p>
            <p className="mt-5 text-lg text-trueGray-500">
              We're a small team from New York & Istanbul who cares about privacy and security and
              wants to disrupt the event management and tracking industry, enabling faulty solutions
              to a simple problem: protecting users' privacy.
            </p>
            <p className="mt-5 text-lg text-trueGray-500">
              Analytics tracking companies don't care about consumer privacy and force developers to
              use <b>binary</b> libraries (closed-source) and frameworks, making it impossible to
              keep track of which software is installed on your bundled mobile applications.
            </p>
            <p className="mt-5 text-lg text-trueGray-500">
              We care about privacy and security. We limit the data collected from mobile
              applications and open-sourced on{' '}
              <a
                href="https://github.com/socketkit"
                className="text-orange-500 hover:underline font-semibold">
                GitHub
              </a>
              . To learn more about our security and privacy rules, visit our{' '}
              <Link href="/security">
                <a className="text-orange-500 hover:underline font-semibold">Security</a>
              </Link>{' '}
              page.
            </p>
          </div>
        </div>
      </div>

      <div className="relative bg-white">
        <div className="relative pb-28 px-6">
          <div className="mx-auto max-w-lg">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-warmGray-900 text-center">
              Get in touch
            </h2>
            <p className="mt-4 text-lg text-trueGray-500 sm:mt-3 text-center">
              We’d love to hear from you!<br></br>Send us a message using the form below, or email
              us.
            </p>
            <form
              action="#"
              method="POST"
              className="mt-9 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-trueGray-500">
                  First name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="first_name"
                    autoComplete="given-name"
                    className="block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-trueGray-500">
                  Last name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="last_name"
                    autoComplete="family-name"
                    className="block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-trueGray-500">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="how_can_we_help"
                    className="block text-sm font-medium text-trueGray-500">
                    How can we help you?
                  </label>
                  <span id="how_can_we_help_description" className="text-sm text-gray-500">
                    Max. 500 characters
                  </span>
                </div>
                <div className="mt-1">
                  <textarea
                    id="how_can_we_help"
                    name="how_can_we_help"
                    aria-describedby="how_can_we_help_description"
                    rows="4"
                    className="block w-full shadow-sm sm:text-sm focus:ring-orange-500 focus:border-orange-500 border-gray-300 rounded-md"></textarea>
                </div>
              </div>
              <div className="text-right sm:col-span-2">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
