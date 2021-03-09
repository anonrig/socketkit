import 'tailwindcss/tailwind.css'
import { DefaultSeo } from 'next-seo'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <DefaultSeo
        title="Mobile Analytics & Subscription Tracking Platform"
        titleTemplate="%s - Socketkit, Inc."
        canonical="https://www.socketkit.com"
        description="Socketkit is a security and privacy focused mobile analytics and subscription tracking platform which gives back the power of data to the user."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://www.socketkit.com/',
          site_name: 'Socketkit - Mobile Analytics & Subscription Tracking Platform',
        }}
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
