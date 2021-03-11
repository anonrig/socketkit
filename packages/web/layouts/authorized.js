import PropTypes from 'prop-types'
import { useContext, useEffect } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import Banner from 'components/banner.js'
import Footer from 'components/footer.js'
import Header from 'components/header.js'
import Container from 'components/container.js'
import ApplicationHeader from './application-header.js'
import SettingsHeader from './settings-header.js'
import { useIntercom } from 'react-use-intercom'
import { AuthContext } from '../helpers/is-authorized.js'

function AuthorizedLayout({ children }) {
  const { session } = useContext(AuthContext)
  const intercom = useIntercom()
  const router = useRouter()
  const { data } = useSWR('integrations')
  let header = null

  // Application header
  if (router.pathname.startsWith('/applications')) {
    // Don't render header on integration required page.
    if (!router.pathname.includes('integration-required')) {
      header = <ApplicationHeader />
    }
  }
  // Account header
  else if (router.pathname.startsWith('/account')) {
    header = <SettingsHeader />
  }

  useEffect(() => {
    if (session) {
      intercom.boot({
        email: session.identity.traits.email,
        user_id: session.identity.id,
        name: session.identity.traits.name,
      })
    } else {
      intercom.shutdown()
    }
  }, [intercom, session])

  useEffect(() => {
    intercom.update({ last_request_at: parseInt(new Date().getTime() / 1000) })
  }, [router.pathname, intercom])

  return (
    <>
      <Header />
      {header}
      <Container>{children}</Container>
      <Footer />

      {data && data[0].rows.filter((d) => !!d.integration).length === 0 && (
        <Banner
          destination="/account/integrations"
          longMessage="Please, add an integration for Socketkit to work."
          shortMessage="Please, add an integration."
        />
      )}
    </>
  )
}

AuthorizedLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
}

export default AuthorizedLayout
