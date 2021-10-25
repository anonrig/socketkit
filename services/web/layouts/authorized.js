import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useIntercom } from 'react-use-intercom'

import Banner from 'components/banner.js'
import Container from 'components/container.js'
import Footer from 'components/menu/footer.js'
import Header from 'components/menu/header.js'

import { AuthContext } from 'helpers/context.js'

function AuthorizedLayout({ children }) {
  const router = useRouter()
  const { integration, session, payment } = useContext(AuthContext)
  const intercom = useIntercom()
  const isOnMembership = router.pathname.startsWith('/start-membership')

  useEffect(() => {
    const traits = session?.identity?.traits ?? {}
    intercom.update({
      last_request_at: parseInt(new Date().getTime() / 1000),
      ...traits,
      user_id: payment?.identity_id,
      segments: [{ type: 'account', id: payment?.account_id }],
    })
  }, [router.pathname, intercom, payment]) // eslint-disable-line

  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />

      {integration?.access_token === null && !isOnMembership && (
        <Banner
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
