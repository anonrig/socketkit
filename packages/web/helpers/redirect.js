import React from 'react'
import Head from 'next/head'
import redirectTo from './redirect-to'

const redirect = destination =>
  class RedirectRoute extends React.Component {
    static getInitialProps({ res }) {
      if (typeof window === 'undefined' && !res.writeHead) {
        // This is the SSR mode
        return { metaRedirect: true }
      }

      redirectTo(destination, { res, status: 301 })
      return {}
    }

    render() {
      if (this.props.metaRedirect) {
        return (
          <Head>
            <meta httpEquiv="refresh" content={`0; url=${destination}`} />
          </Head>
        )
      }

      return null
    }
  }

export default redirect