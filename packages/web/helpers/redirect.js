import React from 'react'
import Head from 'next/head'
import router from 'next/router'

function redirectTo(destination, { res } = { res: null }) {
  if (res) {
    res.writeHead(302, { Location: destination })
    res.end()
  } else {
    if (destination[0] === '/' && destination[1] !== '/') {
      router.push(destination)
    } else {
      window.location = destination
    }
  }
}

export default (destination) =>
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
