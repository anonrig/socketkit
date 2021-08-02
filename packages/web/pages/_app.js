/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { SWRConfig } from 'swr'
import { DefaultSeo } from 'next-seo'
import { Toaster } from 'react-hot-toast'
import useSWR from 'swr'
import { IntercomProvider } from 'react-use-intercom'

import { fetcher } from 'helpers/fetcher.js'
import { AuthContext } from 'helpers/context.js'
import { endpoints, client } from 'helpers/kratos.js'
import { intercomAppId } from 'helpers/config.js'

import 'styles/date-range.css'
import 'styles/index.css'
import 'tailwindcss/tailwind.css'

const UnauthorizedLayout = dynamic(() => import('layouts/unauthorized.js'))
const AuthorizedLayout = dynamic(() => import('layouts/authorized.js'))

function MyApp({ Component, pageProps, cookie }) {
  const router = useRouter()
  const [session, setSession] = useState(undefined)
  const Layout = session === null ? UnauthorizedLayout : AuthorizedLayout

  const { data: integration } = useSWR(session ? 'integrations/appstore-connect' : null, fetcher)
  const { data: payment } = useSWR(session ? 'payments/state' : null, fetcher, {
    refreshInterval: 60000,
  })

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await client.toSession(null, cookie)
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
  }, [fetchUser]) /* eslint-disable-line react-hooks/exhaustive-deps */

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
        position="top-center"
        toastOptions={{
          duration: 5000,
          className:
            'p-4 bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 text-sm font-medium text-warmGray-900',
        }}
      />

      <SWRConfig
        value={{
          refreshInterval: 1 * 60000,
          refreshWhenHidden: true,
          registerOnReconnect: true,
          revalidateOnReconnect: true,
          fetcher,
        }}>
        <AuthContext.Provider value={{ session, integration, payment }}>
          <IntercomProvider appId={intercomAppId} autoBoot>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </IntercomProvider>
        </AuthContext.Provider>
      </SWRConfig>
    </>
  )
}

/**
 * @param {import('next').NextPageContext} ctx
 */
MyApp.getInitialProps = async (context) => {
  return { cookie: context.ctx.req?.headers.cookie }
}

export default MyApp
