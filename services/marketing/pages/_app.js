import 'tailwindcss/tailwind.css'
import { DefaultSeo } from 'next-seo'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s - Socketkit, Inc."
        title="Mobile Analytics & Subscription Tracking Platform"
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
