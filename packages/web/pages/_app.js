import 'tailwindcss/tailwind.css'
import { SWRConfig } from 'swr'
import { DefaultSeo } from 'next-seo'
import { fetcher } from '../helpers/fetcher.js'
import UnauthorizedLayout from '../layouts/unauthorized.js'
import isAuthorized, { AuthContext } from '../helpers/is-authorized.js'
import AuthorizedLayout from '../layouts/authorized.js'

import router from 'next/router'
import Progress from 'nprogress'
import 'nprogress/nprogress.css'

Progress.configure({ easing: 'ease', speed: 800 })
router.events.on('routeChangeStart', () => Progress.start()) 
router.events.on('routeChangeComplete', () => Progress.done()) 
router.events.on('routeChangeError', () => Progress.done())

function MyApp({ Component, pageProps, session }) {
  const Layout = session === null ? UnauthorizedLayout : AuthorizedLayout

  return (
    <>
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://web.socketkit.com/",
          site_name: "Socketkit, Inc.",
        }}
        titleTemplate="%s - Socketkit, Inc."
        title="Subscription Management & Mobile Tracking"
        noindex={true}
      />

      <SWRConfig
        value={{
          refreshInterval: 60000,
          refreshWhenHidden: true,
          fetcher,
        }}
      >
        <AuthContext.Provider value={{ session }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContext.Provider>
      </SWRConfig>
    </>
  )
}

MyApp.getInitialProps = async ({ ctx }) => {
  const session = await isAuthorized(ctx)
  return { session }
}

export default MyApp
