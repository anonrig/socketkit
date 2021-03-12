import { BreadcrumbJsonLd, NextSeo } from 'next-seo'
import Image from 'next/image'
import Layout from 'components/layout.js'

export default function Security() {
  return (
    <Layout>
      <NextSeo
        title="Security & Privacy Practices"
        description="Security and privacy is a fundemental human right. We believe in the right to anonymize user data despite our competitors."
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: 'Security',
            item: 'https://socketkit.com/security',
          },
        ]}
      />

      <div className="relative">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={'/assets/security-hero.png'}
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
                <span className="block text-white">Protect your</span>
                <span className="block text-orange-500">customer data</span>
              </h1>
              <p className="mt-6 max-w-lg mx-auto text-center text-xl text-white sm:max-w-3xl">
                Privacy is a human right.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-white py-16 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl">
          <p className="mt-2 text-3xl font-extrabold text-warmGray-900 tracking-tight sm:text-4xl">
            We follow the best practices, and we&apos;re transparent about it.
          </p>
          <p className="mt-5 max-w-prose mx-auto text-xl text-trueGray-500">
            Here is a list of our recent improvements on our SDKs and infrastructure.
          </p>
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-orange-500">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      SSL Certificates
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      All network communications between CDN and Socketkit servers are end to end
                      encrypted using ECDSA SSL certificates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Verify & Sign
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      All communications between SDKs and Socketkit servers are signed and verified
                      using HMAC SHA-512.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-orange-500">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Web Application Firewall
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      We use a state of the art web application firewall to track suspicious
                      payloads and remove unwanted requests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Network Firewall
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      We reject all requests except Cloudflare to our internal servers to prevent
                      unauthorized network attempts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-6 w-6 text-orange-500">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Encryption
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      We encrypt and hash all of our users' credentials using Argon2 with multiple
                      iterations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-warmGray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-md shadow-lg bg-white">
                        <svg
                          className="h-6 w-6 text-orange-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold text-warmGray-900 tracking-tight">
                      Backups & Transparency
                    </h3>
                    <p className="mt-5 text-base text-trueGray-500">
                      We back up our data regularly to provide 99.99% uptime and inform users on
                      service interruptions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl pb-24">
        <p className="mt-3 text-3xl font-extrabold text-warmGray-900">Sidenote;</p>
        <p className="mt-5 text-lg text-trueGray-500">
          We believe in the fundamental right to security and privacy. We do our best to protect
          your and your customer's data and protect them from malicious attacks. We're currently in
          the process of complying with <span className="font-semibold">GDPR</span>,{' '}
          <span className="font-semibold">CCPA</span>, and{' '}
          <span className="font-semibold">HIPAA</span>. Please keep in touch for further updates. If
          you have any questions regarding security and privacy practices in Socketkit, please
          contact us.
        </p>
        <div className="mt-6">
          <a
            href="mailto:hello@socketkit.com"
            className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-orange-500 hover:bg-orange-400">
            Contact Us
          </a>
        </div>
      </div>
    </Layout>
  )
}
