import 'tailwindcss/tailwind.css'
import { SWRConfig } from 'swr'
import { DefaultSeo } from 'next-seo'
import router, { useRouter } from 'next/router'
import Progress from 'nprogress'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

import { endpoints } from '../helpers/kratos.js'
import { fetcher } from '../helpers/fetcher.js'
import { AuthContext, client } from '../helpers/is-authorized.js'
import UnauthorizedLayout from '../layouts/unauthorized.js'
import AuthorizedLayout from '../layouts/authorized.js'

import 'nprogress/nprogress.css'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import '../styles/index.css'

Progress.configure({ easing: 'ease', speed: 800 })

router.events.on('routeChangeStart', () => Progress.start())
router.events.on('routeChangeComplete', () => Progress.done())
router.events.on('routeChangeError', () => Progress.done())

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [session, setSession] = useState(undefined)
  const Layout = session === null ? UnauthorizedLayout : AuthorizedLayout

  useEffect(async () => {
    try {
      const { data } = await client.whoami()
      setSession(data)
    } catch (error) {
      if (error.message.includes(401)) {
        if (!['/signin', '/signup', '/recover-account', '/failed'].includes(router.pathname)) {
          window.location.href = endpoints.login
          return null
        } else {
          setSession(null)
        }
      } else {
        window.location.href = endpoints.login
        return null
      }
    }
  }, [])

  if (session === undefined) {
    return null
  }

  return (
    <>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://web.socketkit.com/',
          site_name: 'Socketkit, Inc.',
        }}
        titleTemplate="%s - Socketkit, Inc."
        title="Subscription Management & Mobile Tracking"
        noindex={true}
      />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          className:
            'p-4 bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 text-sm font-medium text-gray-900',
        }}
      />

      <SWRConfig
        value={{
          refreshInterval: 30000,
          refreshWhenHidden: true,
          fetcher,
        }}>
        <AuthContext.Provider value={{ session }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContext.Provider>
      </SWRConfig>
    </>
  )
}

export default MyApp
