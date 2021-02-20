import PropTypes from 'prop-types'
import useSWR from 'swr'
import Banner from 'components/banner.js'
import Footer from 'components/footer.js'
import Header from 'components/header.js'
import Container from 'components/container.js'

function AuthorizedLayout({ children }) {
  const { data: integrations } = useSWR('users/me/integrations')

  return (
    <>
      <Header />
      <Container>{children}</Container>
      <Footer />

      {integrations && integrations?.length === 0 && (
        <Banner
          destination="/settings/integrations"
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
