/* eslint-disable react/prop-types */
import { AuthContext } from 'helpers/context.js'
import { fetcher } from 'helpers/fetcher.js'
import { endpoints, client } from 'helpers/kratos.js'
import { DefaultSeo } from 'next-seo'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

import 'styles/date-range.css'
import 'styles/index.css'
import useSWR, { SWRConfig } from 'swr'
import 'tailwindcss/tailwind.css'

const UnauthorizedLayout = dynamic(() => import('layouts/unauthorized.js'))
const AuthorizedLayout = dynamic(() => import('layouts/authorized.js'))

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [session, setSession] = useState(undefined)
  const Layout = session === null ? UnauthorizedLayout : AuthorizedLayout

  const { data: integration } = useSWR(session ? 'integrations/appstore-connect' : null, fetcher)

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await client.toSession()
      setSession(data)
    } catch (error) {
      if (error.message.includes('401')) {
        if (
          !['/signin', '/signup', '/recover-account', '/failed'].includes(router.pathname) ||
          '/' === router.pathname
        ) {
          window.location.href = endpoints.login
        } else {
          setSession(null)
        }
      } else if (error.message.includes('403')) {
        setSession(null)
      } else {
        window.location.href = endpoints.login
      }
    }
  }, [router.pathname]) // eslint-disable-line

  useEffect(() => {
    // don't fetch user on each page change
    if (!session) {
      fetchUser()
    }
  }, [fetchUser, session])

  if (session === undefined) {
    return null
  }

  return (
    <>
      <DefaultSeo
        openGraph={{
          locale: 'en_US',
          site_name: 'Socketkit',
          type: 'website',
          url: 'https://web.socketkit.com/',
        }}
        titleTemplate="%s - Socketkit"
        title="Subscription Management & Mobile Tracking"
        noindex={true}
      />

      <Toaster
        position="top-center"
        toastOptions={{
          className:
            'p-4 bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 text-sm font-medium text-warmGray-900',
          duration: 5000,
        }}
      />

      <SWRConfig
        value={{
          fetcher,
          refreshInterval: 1 * 60000,
          refreshWhenHidden: true,
          registerOnReconnect: true,
          revalidateOnReconnect: true,
        }}
      >
        <AuthContext.Provider value={{ integration, session }}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthContext.Provider>
      </SWRConfig>
    </>
  )
}

export default MyApp
