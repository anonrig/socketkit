import Image from 'next/image'
import { NextSeo } from 'next-seo'
import Layout from 'components/layout.js'

export default function Reviews() {
  return (
    <Layout>
      <NextSeo
        title={'Tracking Application Reviews'}
        description={`Understand and analyze feedback from your customers. Track reviews from AppStore and Google Playstore.`}
      />

      <div className="relative bg-white pt-16 sm:pt-24 lg:pt-32 overflow-hidden">
        <div className="mx-auto max-w-md text-center  sm:max-w-3xl lg:max-w-7xl">
          <div>
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Subscription Management. Simplified.
            </p>
            <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
              Understand where your customers and revenue coming from with Socketkit.
            </p>
          </div>
          <div className="mt-12 -mb-10 sm:-mb-24 lg:-mb-80">
            <div className="rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 overflow-hidden">
              <Image
                src="https://cdn.socketkit.com/assets/solutions/subscription-management.png"
                alt="Subscription Management for AppStore"
                width={800}
                height={488}
                layout="responsive"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
