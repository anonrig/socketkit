import Banner from 'components/banner'
import Container from 'components/container'
import Footer from 'components/menu/footer'
import Header from 'components/menu/header'

import { AuthContext } from 'helpers/context'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import { useContext } from 'react'

function AuthorizedLayout({ children }) {
  const router = useRouter()
  const { integration } = useContext(AuthContext)
  const isOnMembership = router.pathname.startsWith('/start-membership')

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
