/* eslint-disable react/prop-types */
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'
import 'tailwindcss/tailwind.css'
import { IntercomProvider } from 'react-use-intercom'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <DefaultSeo
        title="Mobile Analytics & Subscription Tracking"
        titleTemplate="%s - Socketkit"
        canonical="https://socketkit.com"
        description="Get valuable subscription and user insights from your mobile application and act faster upon your product's revenue change. Make your app GDPR and privacy compliant."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://socketkit.com/',
          title: 'Mobile Analytics & Subscription Tracking for mobile apps',
          description: `Get valuable subscription and user insights from your mobile application and act faster upon your product's revenue change. Make your app GDPR and privacy compliant.`,
          site_name: 'Socketkit',
          images: [
            {
              url: 'https://socketkit.com/twitter/homepage.jpg',
              width: 1024,
              height: 538,
              alt: 'Socketkit: Mobile Analytics & Subscription Tracking for mobile apps',
            },
          ],
        }}
        twitter={{
          title: 'Mobile Analytics & Subscription Tracking for mobile apps',
        }}
        additionalMetaTags={[
          { content: 'nositelinkssearchbox', name: 'google' },
          {
            httpEquiv: 'x-ua-compatible',
            content: 'IE=edge',
          },
        ]}
      />
      <IntercomProvider appId="o5s3ss3a">
        <Component {...pageProps} />
      </IntercomProvider>
    </>
  )
}
