import 'tailwindcss/tailwind.css'
import { SWRConfig } from 'swr'
import { DefaultSeo } from 'next-seo'
import router from 'next/router'
import Progress from 'nprogress'

import { endpoints } from '../helpers/kratos.js'
import redirectTo from '../helpers/redirect-to.js'
import { fetcher } from '../helpers/fetcher.js'
import UnauthorizedLayout from '../layouts/unauthorized.js'
import isAuthorized, { AuthContext } from '../helpers/is-authorized.js'
import AuthorizedLayout from '../layouts/authorized.js'

import 'nprogress/nprogress.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'

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

/**
 * @param {{ ctx: import("next").NextPageContext}} params0 
 */
MyApp.getInitialProps = async ({ ctx }) => {
  const session = await isAuthorized(ctx)
  const unauthorized = ['/signin', '/signup', 'recover-account']

  if (!session) {
    if (!unauthorized.includes(ctx.pathname)) {
      redirectTo(endpoints.login, { res: ctx.res, status: 301 })
    }
  } else {
    if (unauthorized.includes(ctx.pathname)) {
      redirectTo('/', { res: ctx.res, status: 301 })
    }
  }
  return { session }
}

export default MyApp
